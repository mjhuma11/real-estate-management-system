<?php
require_once 'config.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method allowed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    if (empty($input['id']) || empty($input['status'])) {
        throw new Exception('Missing required fields: id and status');
    }

    $booking_id = intval($input['id']);
    $new_status = $input['status'];

    // Validate status
    $valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!in_array($new_status, $valid_statuses)) {
        throw new Exception('Invalid status. Must be one of: ' . implode(', ', $valid_statuses));
    }

    // Update the booking status
    $sql = "UPDATE appointments 
            SET status = :status, 
                updated_at = NOW() 
            WHERE id = :id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':status', $new_status, PDO::PARAM_STR);
    $stmt->bindParam(':id', $booking_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        // Check if any row was actually updated
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => "Booking status updated to {$new_status} successfully",
                'data' => [
                    'id' => $booking_id,
                    'status' => $new_status,
                    'updated_at' => date('Y-m-d H:i:s')
                ]
            ]);
        } else {
            throw new Exception('Booking not found or status unchanged');
        }
    } else {
        throw new Exception('Failed to update booking status');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
?>