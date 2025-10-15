<?php
// Function to set CORS headers consistently
function setCORSHeaders()
{
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400"); // Cache preflight for 24 hours
    header("Content-Type: application/json");
}

// Set CORS headers FIRST before any output
setCORSHeaders();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'netro-estate');

// Create database connection
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    setCORSHeaders(); // Ensure CORS headers are set even in error cases
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Upload configuration
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Helper function for logging errors
function logError($message, $data = [])
{
    error_log($message . ' - ' . json_encode($data));
}
// Gateway payment system configuration
if (!defined('PROJECT_PATH')) {
    define('PROJECT_PATH', 'http://localhost/WDPF/React-project/real-estate-management-system/API'); // replace this value with your project path
}

if (!defined('IS_SANDBOX')) {
    define('IS_SANDBOX', true); // 'true' for sandbox, 'false' for live
}

if (!defined('STORE_ID')) {
    define('STORE_ID', ''); // your store id. For sandbox, register at https://developer.sslcommerz.com/registration/
}

if (!defined('STORE_PASSWORD')) {
    define('STORE_PASSWORD', ''); // your store password.
}

return [
    'success_url' => 'pg_redirection/success.php', // your success url
    'failed_url' => 'pg_redirection/fail.php', // your fail url
    'cancel_url' => 'pg_redirection/cancel.php', //your cancel url
    'ipn_url' => 'pg_redirection/ipn.php', // your ipn url


    'projectPath' => PROJECT_PATH,
    'apiDomain' => IS_SANDBOX ? 'https://sandbox.sslcommerz.com' : 'https://securepay.sslcommerz.com',
    'apiCredentials' => [
        'store_id' => STORE_ID,
        'store_password' => STORE_PASSWORD,
    ],
    'apiUrl' => [
        'make_payment' => "/gwprocess/v4/api.php",
        'order_validate' => "/validator/api/validationserverAPI.php",
    ],
    'connect_from_localhost' => false,
    'verify_hash' => true,
];
