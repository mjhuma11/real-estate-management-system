<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['user_id', 'property_id', 'booking_type', 'booking_date'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

try {
    $conn->beginTransaction();
    
    // Insert appointment
    $appointment_sql = "INSERT INTO appointments (
        user_id, property_id, booking_type, total_property_price, 
        booking_money_amount, installment_option, down_payment_details,
        registration_cost_responsibility, handover_date, developer_info,
        previous_ownership_info, monthly_rent_amount, advance_deposit_amount,
        security_deposit_details, maintenance_responsibility, 
        utility_bills_responsibility, emergency_contact, family_members_count,
        booking_date, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)";
    
    $appointment_stmt = $conn->prepare($appointment_sql);
    $appointment_stmt->execute([
        $input['user_id'],
        $input['property_id'],
        $input['booking_type'],
        $input['total_property_price'] ?? null,
        $input['booking_money_amount'] ?? null,
        $input['installment_option'] ?? null,
        $input['down_payment_details'] ?? null,
        $input['registration_cost_responsibility'] ?? null,
        $input['handover_date'] ?? null,
        $input['developer_info'] ?? null,
        $input['previous_ownership_info'] ?? null,
        $input['monthly_rent_amount'] ?? null,
        $input['advance_deposit_amount'] ?? null,
        $input['security_deposit_details'] ?? null,
        $input['maintenance_responsibility'] ?? null,
        $input['utility_bills_responsibility'] ?? null,
        $input['emergency_contact'] ?? null,
        $input['family_members_count'] ?? null,
        $input['booking_date'],
        $input['notes'] ?? ''
    ]);
    
    $appointment_id = $conn->lastInsertId();
    
    // Create payment plan
    $payment_plan_sql = "INSERT INTO payment_plans (
        appointment_id, property_id, user_id, booking_type,
        total_property_price, down_payment_amount, installment_amount,
        installment_frequency, total_installments, monthly_rent_amount,
        advance_deposit_amount, security_deposit_amount, rent_start_date,
        rent_end_date, registration_cost, maintenance_charge,
        utility_responsibility, notes, plan_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')";
    
    $installment_amount = null;
    $total_installments = null;
    
    if ($input['booking_type'] === 'sale' && isset($input['total_installments']) && $input['total_installments'] > 0) {
        $remaining_amount = ($input['total_property_price'] ?? 0) - ($input['down_payment_details'] ?? 0);
        $installment_amount = $remaining_amount / $input['total_installments'];
        $total_installments = $input['total_installments'];
    }
    
    $payment_plan_stmt = $conn->prepare($payment_plan_sql);
    $payment_plan_stmt->execute([
        $appointment_id,
        $input['property_id'],
        $input['user_id'],
        $input['booking_type'],
        $input['total_property_price'] ?? null,
        $input['down_payment_details'] ?? null,
        $installment_amount,
        $input['installment_frequency'] ?? 'monthly',
        $total_installments,
        $input['monthly_rent_amount'] ?? null,
        $input['advance_deposit_amount'] ?? null,
        $input['security_deposit_amount'] ?? null,
        $input['rent_start_date'] ?? null,
        $input['rent_end_date'] ?? null,
        $input['registration_cost'] ?? null,
        $input['maintenance_charge'] ?? null,
        $input['utility_responsibility'] ?? null,
        $input['notes'] ?? ''
    ]);
    
    $payment_plan_id = $conn->lastInsertId();
    
    // Calculate initial payment required
    $initial_payment_amount = 0;
    $payment_description = '';
    
    if ($input['booking_type'] === 'sale') {
        $initial_payment_amount = $input['down_payment_details'] ?? 0;
        $payment_description = 'Down Payment';
    } else {
        $initial_payment_amount = ($input['advance_deposit_amount'] ?? 0) + ($input['security_deposit_amount'] ?? 0);
        $payment_description = 'Advance + Security Deposit';
    }
    
    // Get property details for response
    $property_sql = "SELECT title, address, price, monthly_rent FROM properties WHERE id = ?";
    $property_stmt = $conn->prepare($property_sql);
    $property_stmt->execute([$input['property_id']]);
    $property = $property_stmt->fetch(PDO::FETCH_ASSOC);
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Booking created successfully',
        'data' => [
            'appointment_id' => $appointment_id,
            'payment_plan_id' => $payment_plan_id,
            'booking_type' => $input['booking_type'],
            'property_title' => $property['title'] ?? 'Unknown Property',
            'property_address' => $property['address'] ?? '',
            'initial_payment_required' => $initial_payment_amount,
            'payment_description' => $payment_description,
            'total_amount' => $input['total_property_price'] ?? $input['monthly_rent_amount'] ?? 0
        ]
    ]);
    
} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Booking failed: ' . $e->getMessage()]);
}
?>