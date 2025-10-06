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

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => false,
        'message' => 'Only POST method allowed',
        'user' => null
    ]);
    ob_end_flush(); // Send output
    exit;
}

// Database connection (direct connection to avoid config.php issues)
try {
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'user' => null
    ]);
    ob_end_flush(); // Send output
    exit;
}

// Get the request data
$requestData = json_decode(file_get_contents('php://input'), true);

if (!$requestData || !isset($requestData['email']) || !isset($requestData['password'])) {
    echo json_encode([
        'status' => false,
        'message' => 'Email and password are required',
        'user' => null
    ]);
    ob_end_flush(); // Send output
    exit;
}

$email = $requestData['email'];
$password = $requestData['password'];

try {
    // Get user data
    $stmt = $conn->prepare("
        SELECT id, username, email, password, role, created_at
        FROM users 
        WHERE email = :email 
        LIMIT 1
    ");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch();

    if ($user) {
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Remove password from response
            unset($user['password']);
            
            $response = [
                'status' => true,
                'message' => 'Login successful',
                'user' => $user
            ];
        } else {
            $response = [
                'status' => false,
                'message' => 'Invalid credentials',
                'user' => null
            ];
        }
    } else {
        $response = [
            'status' => false,
            'message' => 'User not found',
            'user' => null
        ];
    }

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'user' => null
    ]);
} finally {
    // Close connection
    $conn = null;
    ob_end_flush(); // Send output
}
?>