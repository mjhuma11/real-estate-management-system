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

$required_fields = ['payment_plan_id', 'amount', 'payment_method', 'transaction_type'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

try {
    $conn->beginTransaction();
    
    // Get payment plan details
    $plan_sql = "SELECT pp.*, p.title as property_title, u.username, u.email 
                FROM payment_plans pp
                JOIN properties p ON pp.property_id = p.id
                JOIN users u ON pp.user_id = u.id
                WHERE pp.id = ?";
    $plan_stmt = $conn->prepare($plan_sql);
    $plan_stmt->execute([$input['payment_plan_id']]);
    $plan = $plan_stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$plan) {
        throw new Exception('Payment plan not found');
    }
    
    // Generate receipt number
    $receipt_number = 'RCP-' . date('Ymd') . '-' . str_pad($input['payment_plan_id'], 4, '0', STR_PAD_LEFT) . '-' . rand(100, 999);
    $transaction_id = 'TXN-' . time() . '-' . rand(1000, 9999);
    
    // Insert payment transaction
    $transaction_sql = "INSERT INTO payment_transactions (
        payment_plan_id, appointment_id, user_id, property_id,
        transaction_type, amount, payment_method, payment_reference,
        transaction_id, bank_name, account_number, cheque_number,
        mobile_banking_service, mobile_number, payment_date,
        payment_status, receipt_number, late_fee, discount, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?, ?)";
    
    $transaction_stmt = $conn->prepare($transaction_sql);
    $transaction_stmt->execute([
        $input['payment_plan_id'],
        $plan['appointment_id'],
        $plan['user_id'],
        $plan['property_id'],
        $input['transaction_type'],
        $input['amount'],
        $input['payment_method'],
        $input['payment_reference'] ?? null,
        $transaction_id,
        $input['bank_name'] ?? null,
        $input['account_number'] ?? null,
        $input['cheque_number'] ?? null,
        $input['mobile_banking_service'] ?? null,
        $input['mobile_number'] ?? null,
        date('Y-m-d'),
        $receipt_number,
        $input['late_fee'] ?? 0,
        $input['discount'] ?? 0,
        $input['notes'] ?? ''
    ]);
    
    $payment_transaction_id = $conn->lastInsertId();
    
    // Update payment plan totals
    $update_plan_sql = "UPDATE payment_plans 
                       SET total_amount_paid = total_amount_paid + ?,
                           total_amount_due = GREATEST(0, total_amount_due - ?)
                       WHERE id = ?";
    $update_plan_stmt = $conn->prepare($update_plan_sql);
    $update_plan_stmt->execute([$input['amount'], $input['amount'], $input['payment_plan_id']]);
    
    // Check if this completes the initial payment requirement
    $initial_payment_complete = false;
    
    if ($input['transaction_type'] === 'down_payment' || 
        $input['transaction_type'] === 'advance_deposit') {
        
        // Update appointment status to confirmed
        $update_appointment_sql = "UPDATE appointments SET status = 'confirmed' WHERE id = ?";
        $update_appointment_stmt = $conn->prepare($update_appointment_sql);
        $update_appointment_stmt->execute([$plan['appointment_id']]);
        
        $initial_payment_complete = true;
        
        // Generate payment schedules if not already created
        if ($plan['booking_type'] === 'sale' && $plan['total_installments'] > 0) {
            // Create installment schedule
            $installment_amount = $plan['installment_amount'];
            
            for ($i = 1; $i <= $plan['total_installments']; $i++) {
                $due_date = date('Y-m-d', strtotime($plan['created_at'] . " +$i month"));
                
                $installment_sql = "INSERT INTO installment_schedules (
                    payment_plan_id, appointment_id, user_id, installment_number,
                    installment_amount, due_date, status
                ) VALUES (?, ?, ?, ?, ?, ?, 'pending')";
                
                $installment_stmt = $conn->prepare($installment_sql);
                $installment_stmt->execute([
                    $input['payment_plan_id'],
                    $plan['appointment_id'],
                    $plan['user_id'],
                    $i,
                    $installment_amount,
                    $due_date
                ]);
            }
        } elseif ($plan['booking_type'] === 'rent') {
            // Create rent schedule for 12 months
            for ($i = 1; $i <= 12; $i++) {
                $due_date = date('Y-m-d', strtotime($plan['created_at'] . " +$i month"));
                $month = date('n', strtotime($due_date));
                $year = date('Y', strtotime($due_date));
                
                $rent_sql = "INSERT INTO rent_schedules (
                    payment_plan_id, appointment_id, user_id, month, year,
                    month_year, rent_amount, due_date, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
                
                $rent_stmt = $conn->prepare($rent_sql);
                $rent_stmt->execute([
                    $input['payment_plan_id'],
                    $plan['appointment_id'],
                    $plan['user_id'],
                    $month,
                    $year,
                    date('M Y', strtotime($due_date)),
                    $plan['monthly_rent_amount'],
                    $due_date
                ]);
            }
        }
    }
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Payment processed successfully',
        'data' => [
            'transaction_id' => $payment_transaction_id,
            'receipt_number' => $receipt_number,
            'amount' => $input['amount'],
            'payment_method' => $input['payment_method'],
            'transaction_type' => $input['transaction_type'],
            'initial_payment_complete' => $initial_payment_complete,
            'booking_confirmed' => $initial_payment_complete,
            'property_title' => $plan['property_title'],
            'customer_name' => $plan['username'],
            'customer_email' => $plan['email'],
            'payment_date' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Payment processing failed: ' . $e->getMessage()]);
}
?>