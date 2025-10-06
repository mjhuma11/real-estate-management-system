<?php
// Start output buffering to prevent any unwanted output
ob_start();

// Set CORS headers first - moved to a function for consistency
function setCORSHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
}

// Set CORS headers immediately
setCORSHeaders();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean(); // Clear buffer
    exit(0);
}

// Disable HTML error output to prevent JSON corruption
ini_set('display_errors', 0);
error_reporting(0); // Turn off all error reporting

// Database connection
try {
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'error_type' => 'database_connection'
    ]);
    // Only flush if output buffer is active
    if (ob_get_level() > 0) {
        ob_end_flush(); // Send output
    }
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method allowed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input or empty request body');
    }

    // Validate required fields
    $required_fields = ['user_id', 'property_id', 'booking_type', 'booking_date'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate booking type
    if (!in_array($input['booking_type'], ['sale', 'rent'])) {
        throw new Exception('Invalid booking type. Must be "sale" or "rent"');
    }

    // Additional validation based on booking type
    if ($input['booking_type'] === 'sale') {
        if (!isset($input['total_property_price']) || !isset($input['booking_money_amount']) || 
            empty($input['total_property_price']) || empty($input['booking_money_amount'])) {
            throw new Exception('Total property price and booking money amount are required for sale bookings');
        }
    } elseif ($input['booking_type'] === 'rent') {
        if (!isset($input['monthly_rent_amount']) || !isset($input['advance_deposit_amount']) || 
            empty($input['monthly_rent_amount']) || empty($input['advance_deposit_amount'])) {
            throw new Exception('Monthly rent amount and advance deposit amount are required for rent bookings');
        }
    }

    // Prepare SQL statement
    $sql = "INSERT INTO appointments (
        user_id, 
        agent_id, 
        property_id, 
        booking_type, 
        booking_date,
        notes,
        total_property_price,
        booking_money_amount,
        installment_option,
        down_payment_details,
        registration_cost_responsibility,
        handover_date,
        previous_ownership_info,
        developer_info,
        monthly_rent_amount,
        advance_deposit_amount,
        security_deposit_details,
        maintenance_responsibility,
        utility_bills_responsibility,
        emergency_contact,
        status,
        created_at
    ) VALUES (
        :user_id,
        :agent_id,
        :property_id,
        :booking_type,
        :booking_date,
        :notes,
        :total_property_price,
        :booking_money_amount,
        :installment_option,
        :down_payment_details,
        :registration_cost_responsibility,
        :handover_date,
        :previous_ownership_info,
        :developer_info,
        :monthly_rent_amount,
        :advance_deposit_amount,
        :security_deposit_details,
        :maintenance_responsibility,
        :utility_bills_responsibility,
        :emergency_contact,
        :status,
        NOW()
    )";

    $stmt = $conn->prepare($sql);

    // Bind parameters correctly (avoiding pass by reference issues)
    $user_id = (int)$input['user_id'];
    $property_id = (int)$input['property_id'];
    $booking_type = $input['booking_type'];
    $booking_date = $input['booking_date'];
    $notes = $input['notes'] ?? null;
    
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':property_id', $property_id, PDO::PARAM_INT);
    $stmt->bindParam(':booking_type', $booking_type, PDO::PARAM_STR);
    $stmt->bindParam(':booking_date', $booking_date, PDO::PARAM_STR);
    $stmt->bindParam(':notes', $notes, PDO::PARAM_STR);

    // Handle agent_id (can be null)
    if (!empty($input['agent_id'])) {
        $agent_id = (int)$input['agent_id'];
        $stmt->bindParam(':agent_id', $agent_id, PDO::PARAM_INT);
    } else {
        $agent_id = null;
        $stmt->bindParam(':agent_id', $agent_id, PDO::PARAM_NULL);
    }

    // Sale-specific fields (will be null for rent bookings)
    if ($booking_type === 'sale') {
        $total_property_price = (float)($input['total_property_price'] ?? 0);
        $booking_money_amount = (float)($input['booking_money_amount'] ?? 0);
        $installment_option = $input['installment_option'] ?? null;
        $down_payment_details = (float)($input['down_payment_details'] ?? 0);
        $registration_cost_responsibility = $input['registration_cost_responsibility'] ?? null;
        $handover_date = $input['handover_date'] ?? null;
        $previous_ownership_info = $input['previous_ownership_info'] ?? null;
        $developer_info = $input['developer_info'] ?? null;
        
        $stmt->bindParam(':total_property_price', $total_property_price, PDO::PARAM_STR);
        $stmt->bindParam(':booking_money_amount', $booking_money_amount, PDO::PARAM_STR);
        $stmt->bindParam(':installment_option', $installment_option, PDO::PARAM_STR);
        $stmt->bindParam(':down_payment_details', $down_payment_details, PDO::PARAM_STR);
        $stmt->bindParam(':registration_cost_responsibility', $registration_cost_responsibility, PDO::PARAM_STR);
        $stmt->bindParam(':handover_date', $handover_date, PDO::PARAM_STR);
        $stmt->bindParam(':previous_ownership_info', $previous_ownership_info, PDO::PARAM_STR);
        $stmt->bindParam(':developer_info', $developer_info, PDO::PARAM_STR);
        
        // Set rent-specific fields to null
        $monthly_rent_amount = null;
        $advance_deposit_amount = null;
        $security_deposit_details = null;
        $maintenance_responsibility = null;
        $utility_bills_responsibility = null;
        $emergency_contact = null;
        
        $stmt->bindParam(':monthly_rent_amount', $monthly_rent_amount, PDO::PARAM_NULL);
        $stmt->bindParam(':advance_deposit_amount', $advance_deposit_amount, PDO::PARAM_NULL);
        $stmt->bindParam(':security_deposit_details', $security_deposit_details, PDO::PARAM_NULL);
        $stmt->bindParam(':maintenance_responsibility', $maintenance_responsibility, PDO::PARAM_NULL);
        $stmt->bindParam(':utility_bills_responsibility', $utility_bills_responsibility, PDO::PARAM_NULL);
        $stmt->bindParam(':emergency_contact', $emergency_contact, PDO::PARAM_NULL);
    } else {
        // Rent-specific fields
        $monthly_rent_amount = (float)($input['monthly_rent_amount'] ?? 0);
        $advance_deposit_amount = (float)($input['advance_deposit_amount'] ?? 0);
        $security_deposit_details = $input['security_deposit_details'] ?? null;
        $maintenance_responsibility = $input['maintenance_responsibility'] ?? null;
        $utility_bills_responsibility = $input['utility_bills_responsibility'] ?? null;
        $emergency_contact = $input['emergency_contact'] ?? null;
        
        $stmt->bindParam(':monthly_rent_amount', $monthly_rent_amount, PDO::PARAM_STR);
        $stmt->bindParam(':advance_deposit_amount', $advance_deposit_amount, PDO::PARAM_STR);
        $stmt->bindParam(':security_deposit_details', $security_deposit_details, PDO::PARAM_STR);
        $stmt->bindParam(':maintenance_responsibility', $maintenance_responsibility, PDO::PARAM_STR);
        $stmt->bindParam(':utility_bills_responsibility', $utility_bills_responsibility, PDO::PARAM_STR);
        $stmt->bindParam(':emergency_contact', $emergency_contact, PDO::PARAM_STR);
        
        // Set sale-specific fields to null
        $total_property_price = null;
        $booking_money_amount = null;
        $installment_option = null;
        $down_payment_details = null;
        $registration_cost_responsibility = null;
        $handover_date = null;
        $previous_ownership_info = null;
        $developer_info = null;
        
        $stmt->bindParam(':total_property_price', $total_property_price, PDO::PARAM_NULL);
        $stmt->bindParam(':booking_money_amount', $booking_money_amount, PDO::PARAM_NULL);
        $stmt->bindParam(':installment_option', $installment_option, PDO::PARAM_NULL);
        $stmt->bindParam(':down_payment_details', $down_payment_details, PDO::PARAM_NULL);
        $stmt->bindParam(':registration_cost_responsibility', $registration_cost_responsibility, PDO::PARAM_NULL);
        $stmt->bindParam(':handover_date', $handover_date, PDO::PARAM_NULL);
        $stmt->bindParam(':previous_ownership_info', $previous_ownership_info, PDO::PARAM_NULL);
        $stmt->bindParam(':developer_info', $developer_info, PDO::PARAM_NULL);
    }

    // Default status
    $status = 'pending';
    $stmt->bindParam(':status', $status, PDO::PARAM_STR);

    if ($stmt->execute()) {
        $booking_id = $conn->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking_id' => $booking_id,
            'data' => [
                'id' => $booking_id,
                'booking_type' => $booking_type,
                'status' => 'pending'
            ]
        ]);
    } else {
        throw new Exception('Failed to create booking');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error' => $e->getMessage(),
        'error_type' => 'application_error'
    ]);
} catch (Throwable $t) {
    // Catch any other errors that might occur
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred: ' . $t->getMessage(),
        'error' => $t->getMessage(),
        'error_type' => 'unexpected_error'
    ]);
} finally {
    // Close connection
    $conn = null;
    // Only flush if output buffer is active
    if (ob_get_level() > 0) {
        ob_end_flush(); // Send output
    }
}
?>