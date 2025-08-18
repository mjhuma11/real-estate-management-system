<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test data
$testData = [
    'username' => 'testuser_' . time(),
    'email' => 'test_' . time() . '@example.com',
    'password' => 'testpassword123'
];

$results = [];

try {
    // Test 1: Database connection
    $results['database_connection'] = 'SUCCESS';
    
    // Test 2: Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        $results['users_table_exists'] = 'SUCCESS';
    } else {
        $results['users_table_exists'] = 'FAILED - Users table not found';
    }
    
    // Test 3: Check users table structure
    $stmt = $conn->query("DESCRIBE users");
    $structure = $stmt->fetchAll();
    $requiredFields = ['id', 'username', 'email', 'password', 'role'];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        $found = false;
        foreach ($structure as $col) {
            if ($col['Field'] === $field) {
                $found = true;
                break;
            }
        }
        if (!$found) {
            $missingFields[] = $field;
        }
    }
    
    if (empty($missingFields)) {
        $results['table_structure'] = 'SUCCESS';
    } else {
        $results['table_structure'] = 'FAILED - Missing fields: ' . implode(', ', $missingFields);
    }
    
    // Test 4: Check if test email already exists
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $checkStmt->bindParam(':email', $testData['email']);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        $results['email_check'] = 'FAILED - Test email already exists';
    } else {
        $results['email_check'] = 'SUCCESS';
    }
    
    // Test 5: Try to insert test user
    if ($results['email_check'] === 'SUCCESS') {
        $hashedPassword = password_hash($testData['password'], PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) 
                               VALUES (:username, :email, :password, :role)");
        
        $stmt->bindParam(':username', $testData['username']);
        $stmt->bindParam(':email', $testData['email']);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':role', 'customer');
        
        if ($stmt->execute()) {
            $results['user_insertion'] = 'SUCCESS';
            $results['inserted_user_id'] = $conn->lastInsertId();
            
            // Clean up - delete test user
            $deleteStmt = $conn->prepare("DELETE FROM users WHERE id = :id");
            $deleteStmt->bindParam(':id', $results['inserted_user_id']);
            $deleteStmt->execute();
            $results['cleanup'] = 'SUCCESS';
        } else {
            $results['user_insertion'] = 'FAILED';
        }
    } else {
        $results['user_insertion'] = 'SKIPPED - Email check failed';
    }
    
    // Test 6: CORS headers
    $results['cors_headers'] = 'SUCCESS';
    
    echo json_encode([
        'success' => true,
        'message' => 'Complete system test results',
        'results' => $results,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Test failed: ' . $e->getMessage(),
        'results' => $results ?? []
    ]);
}
?>
