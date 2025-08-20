<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    // Get input values according to appointments table structure
    $user_id = $input['user_id'] ?? null;
    $property_id = $input['property_id'] ?? null;
    $project_id = $input['project_id'] ?? null;
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $phone = $input['phone'] ?? '';
    $appointment_date = $input['appointment_date'] ?? $input['preferred_date'] ?? null;
    $appointment_time = $input['appointment_time'] ?? $input['preferred_time'] ?? null;
    $notes = $input['notes'] ?? $input['message'] ?? '';
    $type = $input['type'] ?? 'buy'; // buy or rent
    $status = $input['status'] ?? 'scheduled';

    // Validate required fields
    $required_fields = ['name', 'email', 'phone', 'appointment_date', 'appointment_time'];
    foreach ($required_fields as $field) {
        $value = $$field; // Get the variable value dynamically
        if (empty($value)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required']);
            exit;
        }
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    // Validate type
    if (!in_array($type, ['buy', 'rent'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Type must be either "buy" or "rent"']);
        exit;
    }

    // Validate date is in the future
    $preferred_date = new DateTime($appointment_date);
    $today = new DateTime();
    if ($preferred_date <= $today) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Appointment date must be in the future']);
        exit;
    }

    // Get agent_id from property or project, or default to 1
    $agent_id = 1; // Default agent
    
    if ($property_id) {
        $property_check = $conn->prepare("SELECT agent_id FROM properties WHERE id = :property_id");
        $property_check->bindParam(':property_id', $property_id, PDO::PARAM_INT);
        $property_check->execute();
        
        $property = $property_check->fetch(PDO::FETCH_ASSOC);
        if ($property && $property['agent_id']) {
            $agent_id = $property['agent_id'];
        }
    }

    // Try to find existing user by email if user_id not provided
    if (!$user_id && !empty($email)) {
        $user_check = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $user_check->bindParam(':email', $email, PDO::PARAM_STR);
        $user_check->execute();
        
        $user = $user_check->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            $user_id = $user['id'];
        }
    }

    // Insert appointment according to appointments table structure
    $sql = "INSERT INTO appointments (
        user_id, agent_id, property_id, project_id, name, email, phone, 
        appointment_date, appointment_time, status, notes, created_at
    ) VALUES (
        :user_id, :agent_id, :property_id, :project_id, :name, :email, :phone,
        :appointment_date, :appointment_time, :status, :notes, NOW()
    )";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':agent_id', $agent_id, PDO::PARAM_INT);
    $stmt->bindParam(':property_id', $property_id, PDO::PARAM_INT);
    $stmt->bindParam(':project_id', $project_id, PDO::PARAM_INT);
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
    $stmt->bindParam(':appointment_date', $appointment_date, PDO::PARAM_STR);
    $stmt->bindParam(':appointment_time', $appointment_time, PDO::PARAM_STR);
    $stmt->bindParam(':status', $status, PDO::PARAM_STR);
    $stmt->bindParam(':notes', $notes, PDO::PARAM_STR);
    
    if ($stmt->execute()) {
        $appointment_id = $conn->lastInsertId();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Appointment booked successfully',
            'appointment_id' => $appointment_id,
            'type' => $type,
            'user_matched' => $user_id ? true : false
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to book appointment']);
    }

} catch (PDOException $e) {
    error_log("Database error in book-appointment.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("General error in book-appointment.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred while processing your request']);
}
?>
