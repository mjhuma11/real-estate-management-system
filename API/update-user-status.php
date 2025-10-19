<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'log-activity.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'Only POST method allowed'
    ]);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || !isset($input['status'])) {
        echo json_encode([
            'success' => false,
            'error' => 'User ID and status are required'
        ]);
        exit;
    }
    
    $userId = (int)$input['id'];
    $status = trim($input['status']);
    
    // Validate status
    $validStatuses = ['active', 'inactive', 'suspended'];
    if (!in_array($status, $validStatuses)) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid status. Must be: ' . implode(', ', $validStatuses)
        ]);
        exit;
    }
    
    // Check if user exists
    $checkSql = "SELECT id, username, email, role FROM users WHERE id = :id";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bindValue(':id', $userId, PDO::PARAM_INT);
    $checkStmt->execute();
    $user = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode([
            'success' => false,
            'error' => 'User not found'
        ]);
        exit;
    }
    
    // Update user status
    $updateSql = "UPDATE users SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bindValue(':status', $status);
    $updateStmt->bindValue(':id', $userId, PDO::PARAM_INT);
    
    if ($updateStmt->execute()) {
        // Log the activity
        logActivityWithStyle(
            ActivityTypes::USER_STATUS_CHANGED,
            'User Status Updated',
            "changed {$user['username']}'s status to $status",
            [
                'user_id' => null, // Admin action
                'user_name' => 'Admin',
                'entity_type' => 'user',
                'entity_id' => $userId,
                'details' => [
                    'previous_status' => $user['status'] ?? 'unknown',
                    'new_status' => $status,
                    'target_user' => $user['username'],
                    'target_email' => $user['email']
                ]
            ]
        );
        
        echo json_encode([
            'success' => true,
            'message' => "User status updated to '$status' successfully",
            'user' => [
                'id' => $userId,
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'status' => $status
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to update user status'
        ]);
    }

} catch (Exception $e) {
    error_log("Error in update-user-status.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to update user status: ' . $e->getMessage()
    ]);
}
?>