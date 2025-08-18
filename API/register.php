<?php
require_once 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the request data
$requestData = json_decode(file_get_contents('php://input'), true);

// Validate request data
if (!$requestData || !isset($requestData['username']) || !isset($requestData['email']) || !isset($requestData['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Username, email, and password are required'
    ]);
    exit;
}

$username = trim($requestData['username']);
$email = trim($requestData['email']);
$password = $requestData['password'];
$role = 'customer'; // Default role is customer

// Validate input
if (empty($username) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'All fields are required'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid email format'
    ]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Password must be at least 6 characters long'
    ]);
    exit;
}

try {
    // Check if email already exists
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode([
            'success' => false,
            'error' => 'Email already exists'
        ]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) 
                           VALUES (:username, :email, :password, :role)");
    
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':role', $role);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'user' => [
                'id' => $conn->lastInsertId(),
                'username' => $username,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } else {
        throw new Exception('Failed to create user');
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log('Registration Error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Registration failed. Please try again.'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

// Close connection
$conn = null;
?>