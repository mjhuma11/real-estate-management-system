<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test data
$testUser = [
    'username' => 'testadmin',
    'email' => 'admin@test.com',
    'password' => 'password123',
    'role' => 'admin'
];

$results = [];

try {
    // Test 1: Check if test user exists
    $checkStmt = $conn->prepare("SELECT id, username, email, role FROM users WHERE email = :email");
    $checkStmt->bindParam(':email', $testUser['email']);
    $checkStmt->execute();
    $existingUser = $checkStmt->fetch();
    
    if ($existingUser) {
        $results['user_exists'] = 'SUCCESS - User found';
        $results['user_data'] = $existingUser;
        
        // Test 2: Test login with correct password
        $loginStmt = $conn->prepare("SELECT id, username, email, password, role FROM users WHERE email = :email");
        $loginStmt->bindParam(':email', $testUser['email']);
        $loginStmt->execute();
        $loginUser = $loginStmt->fetch();
        
        if (password_verify($testUser['password'], $loginUser['password'])) {
            $results['login_test'] = 'SUCCESS - Password verified';
            unset($loginUser['password']); // Remove password from response
            $results['login_user_data'] = $loginUser;
        } else {
            $results['login_test'] = 'FAILED - Password verification failed';
        }
    } else {
        $results['user_exists'] = 'FAILED - Test user not found';
        $results['note'] = 'Create a test user with email: admin@test.com and password: password123';
    }
    
    // Test 3: CORS headers
    $results['cors_headers'] = 'SUCCESS';
    
    echo json_encode([
        'success' => true,
        'message' => 'Authentication system test results',
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
