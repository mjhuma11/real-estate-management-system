<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Set headers manually for debugging
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Test database connection first
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    echo json_encode([
        'step' => 1,
        'message' => 'Database connection successful'
    ]);
    
    // Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            'step' => 2,
            'error' => 'Users table does not exist',
            'tables' => $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN)
        ]);
        exit;
    }
    
    // Check table structure
    $stmt = $conn->query("DESCRIBE users");
    $columns = $stmt->fetchAll();
    
    echo json_encode([
        'step' => 3,
        'message' => 'Users table exists',
        'columns' => array_column($columns, 'Field')
    ]);
    
    // Try to get users
    $sql = "SELECT * FROM users LIMIT 5";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    echo json_encode([
        'step' => 4,
        'message' => 'Query successful',
        'user_count' => count($users),
        'sample_users' => $users
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>