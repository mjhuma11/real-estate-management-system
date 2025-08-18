<?php
require_once 'config.php';

// Get the request data
$requestData = json_decode(file_get_contents('php://input'), true);

if (!$requestData || !isset($requestData['email']) || !isset($requestData['password'])) {
    echo json_encode([
        'status' => false,
        'message' => 'Email and password are required',
        'user' => null
    ]);
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
}
?>