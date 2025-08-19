<?php
// Set JSON header first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

require_once 'config.php';

// Disable HTML error output to prevent JSON corruption
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Get the request data
$input = file_get_contents('php://input');
if (empty($input)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No data received'
    ]);
    exit;
}

$requestData = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON data'
    ]);
    exit;
}

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
    error_log('Registration Exception: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    // Catch any other errors that might occur
    http_response_code(500);
    error_log('Registration Fatal Error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'An unexpected error occurred. Please try again.'
    ]);
}

// Close connection
$conn = null;
?>