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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    ob_end_flush(); // Send output
    exit;
}

// Database connection (direct to avoid config.php conflicts)
try {
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    ob_end_flush(); // Send output
    exit;
}

// Get the request data
$input = file_get_contents('php://input');
if (empty($input)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No data received'
    ]);
    ob_end_flush(); // Send output
    exit;
}

$requestData = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON data'
    ]);
    ob_end_flush(); // Send output
    exit;
}

// Validate request data
if (!$requestData || !isset($requestData['username']) || !isset($requestData['email']) || !isset($requestData['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Username, email, and password are required'
    ]);
    ob_end_flush(); // Send output
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
    ob_end_flush(); // Send output
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid email format'
    ]);
    ob_end_flush(); // Send output
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Password must be at least 6 characters long'
    ]);
    ob_end_flush(); // Send output
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
        ob_end_flush(); // Send output
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
} finally {
    // Close connection
    $conn = null;
    ob_end_flush(); // Send output
}
?>