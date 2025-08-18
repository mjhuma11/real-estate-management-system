<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Test database connection
    $results = [];
    
    // Test 1: Check if database exists
    $results['database_connection'] = 'SUCCESS';
    
    // Test 2: Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        $results['users_table'] = 'SUCCESS - Table exists';
        
        // Test 3: Get table structure
        $stmt = $conn->query("DESCRIBE users");
        $structure = $stmt->fetchAll();
        $results['table_structure'] = $structure;
        
        // Test 4: Count users
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
        $userCount = $stmt->fetch()['count'];
        $results['user_count'] = $userCount;
        
        // Test 5: Get sample users
        $stmt = $conn->query("SELECT id, username, email, role FROM users LIMIT 5");
        $sampleUsers = $stmt->fetchAll();
        $results['sample_users'] = $sampleUsers;
        
    } else {
        $results['users_table'] = 'FAILED - Users table not found';
    }
    
    // Test 6: Check all tables
    $stmt = $conn->query("SHOW TABLES");
    $allTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $results['all_tables'] = $allTables;
    
    echo json_encode([
        'success' => true,
        'message' => 'Database check completed',
        'results' => $results,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database check failed: ' . $e->getMessage(),
        'database' => DB_NAME
    ]);
}
?>
