<?php
// Comprehensive server debugging script
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$debug = [];

// 1. PHP Version and Extensions
$debug['php_info'] = [
    'version' => phpversion(),
    'extensions' => [
        'pdo' => extension_loaded('pdo'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'mysqli' => extension_loaded('mysqli'),
        'curl' => extension_loaded('curl')
    ]
];

// 2. Server Information
$debug['server_info'] = [
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'Unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
    'http_host' => $_SERVER['HTTP_HOST'] ?? 'Unknown'
];

// 3. File System Check
$debug['file_system'] = [
    'current_directory' => __DIR__,
    'config_exists' => file_exists(__DIR__ . '/config.php'),
    'htaccess_exists' => file_exists(__DIR__ . '/.htaccess'),
    'writable' => is_writable(__DIR__)
];

// 4. Database Connection Test
try {
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Test basic query
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users");
    $stmt->execute();
    $userCount = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $debug['database'] = [
        'connection' => 'SUCCESS',
        'user_count' => $userCount['count'],
        'error' => null
    ];
} catch (Exception $e) {
    $debug['database'] = [
        'connection' => 'FAILED',
        'error' => $e->getMessage()
    ];
}

// 5. CORS Headers Test
$debug['cors_headers'] = [
    'access_control_allow_origin' => '*',
    'access_control_allow_methods' => 'GET, POST, PUT, DELETE, OPTIONS',
    'access_control_allow_headers' => 'Content-Type, Authorization, X-Requested-With'
];

// 6. Environment Check
$debug['environment'] = [
    'timestamp' => date('Y-m-d H:i:s'),
    'timezone' => date_default_timezone_get(),
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time')
];

// Output debug information
echo json_encode([
    'success' => true,
    'message' => 'Server debug information',
    'debug' => $debug
], JSON_PRETTY_PRINT);
?>