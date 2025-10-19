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
    
    if (!isset($input['id'])) {
        echo json_encode([
            'success' => false,
            'error' => 'User ID is required'
        ]);
        exit;
    }
    
    $userId = (int)$input['id'];
    
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
    
    // Prevent deleting admin users (optional security measure)
    if ($user['role'] === 'admin') {
        echo json_encode([
            'success' => false,
            'error' => 'Cannot delete admin users'
        ]);
        exit;
    }
    
    // Start transaction
    $conn->beginTransaction();
    
    try {
        // Delete related records first (to maintain referential integrity)
        
        // Delete agent profile if exists
        if ($user['role'] === 'agent') {
            $deleteAgentSql = "DELETE FROM agent_profiles WHERE user_id = :user_id";
            $deleteAgentStmt = $conn->prepare($deleteAgentSql);
            $deleteAgentStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $deleteAgentStmt->execute();
        }
        
        // Delete user favorites
        $deleteFavoritesSql = "DELETE FROM user_favorites WHERE user_id = :user_id";
        $deleteFavoritesStmt = $conn->prepare($deleteFavoritesSql);
        $deleteFavoritesStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $deleteFavoritesStmt->execute();
        
        // Delete appointments
        $deleteAppointmentsSql = "DELETE FROM appointments WHERE user_id = :user_id";
        $deleteAppointmentsStmt = $conn->prepare($deleteAppointmentsSql);
        $deleteAppointmentsStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $deleteAppointmentsStmt->execute();
        
        // Delete bookings (if you have a bookings table)
        // $deleteBookingsSql = "DELETE FROM bookings WHERE user_id = :user_id";
        // $deleteBookingsStmt = $conn->prepare($deleteBookingsSql);
        // $deleteBookingsStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        // $deleteBookingsStmt->execute();
        
        // Finally delete the user
        $deleteUserSql = "DELETE FROM users WHERE id = :id";
        $deleteUserStmt = $conn->prepare($deleteUserSql);
        $deleteUserStmt->bindValue(':id', $userId, PDO::PARAM_INT);
        
        if ($deleteUserStmt->execute()) {
            // Commit transaction
            $conn->commit();
            
            // Log the activity
            logActivityWithStyle(
                ActivityTypes::USER_DELETED,
                'User Deleted',
                "deleted user '{$user['username']}'",
                [
                    'user_id' => null, // Admin action
                    'user_name' => 'Admin',
                    'entity_type' => 'user',
                    'entity_id' => $userId,
                    'details' => [
                        'deleted_user' => $user['username'],
                        'deleted_email' => $user['email'],
                        'deleted_role' => $user['role']
                    ]
                ]
            );
            
            echo json_encode([
                'success' => true,
                'message' => "User '{$user['username']}' deleted successfully",
                'deleted_user' => [
                    'id' => $userId,
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            throw new Exception('Failed to delete user');
        }
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Error in delete-user.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to delete user: ' . $e->getMessage()
    ]);
}
?>