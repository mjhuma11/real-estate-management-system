<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'netro-estate');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Set response content type
header("Content-Type: application/json");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // First, try to connect without specifying database
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
    $dbExists = $stmt->rowCount() > 0;
    
    if (!$dbExists) {
        echo json_encode([
            'success' => false,
            'error' => 'Database "' . DB_NAME . '" does not exist',
            'available_databases' => []
        ]);
        exit;
    }
    
    // Connect to the specific database
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Get all tables
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Check if users table exists and get its structure
    $usersTableExists = in_array('users', $tables);
    $usersStructure = [];
    
    if ($usersTableExists) {
        $stmt = $conn->query("DESCRIBE users");
        $usersStructure = $stmt->fetchAll();
        
        // Count users
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
        $userCount = $stmt->fetch()['count'];
    }
    
    echo json_encode([
        'success' => true,
        'database' => DB_NAME,
        'database_exists' => $dbExists,
        'users_table_exists' => $usersTableExists,
        'user_count' => $userCount ?? 0,
        'all_tables' => $tables,
        'users_table_structure' => $usersStructure,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
        'database' => DB_NAME
    ]);
}
?>
