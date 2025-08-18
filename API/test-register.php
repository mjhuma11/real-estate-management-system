<?php
require_once 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test registration data
$testData = [
    'username' => 'testuser_' . time(),
    'email' => 'test_' . time() . '@example.com',
    'password' => 'testpassword123'
];

try {
    // Check if email already exists
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $checkStmt->bindParam(':email', $testData['email']);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'error' => 'Test email already exists'
        ]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($testData['password'], PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) 
                           VALUES (:username, :email, :password, :role)");
    
    $stmt->bindParam(':username', $testData['username']);
    $stmt->bindParam(':email', $testData['email']);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':role', 'customer');

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Test registration successful',
            'user' => [
                'id' => $conn->lastInsertId(),
                'username' => $testData['username'],
                'email' => $testData['email'],
                'role' => 'customer'
            ]
        ]);
    } else {
        throw new Exception('Failed to create test user');
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
