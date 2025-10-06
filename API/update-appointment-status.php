<?php
require_once 'config.php';

// Only process POST requests (OPTIONS is handled in config.php)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['appointment_id']) || !isset($input['status'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Appointment ID and status are required'
    ]);
    exit;
}

$appointmentId = $input['appointment_id'];
$status = $input['status'];

// Validate status
$validStatuses = ['waiting', 'accepted', 'rejected'];
if (!in_array($status, $validStatuses)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid status. Must be one of: ' . implode(', ', $validStatuses)
    ]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Update appointment status
    $query = "UPDATE appointments SET admin_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([$status, $appointmentId]);

    if ($result && $stmt->rowCount() > 0) {
        // Get updated appointment details
        $getQuery = "SELECT * FROM appointments WHERE id = ?";
        $getStmt = $pdo->prepare($getQuery);
        $getStmt->execute([$appointmentId]);
        $appointment = $getStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'message' => 'Appointment status updated successfully',
            'data' => $appointment
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Appointment not found or no changes made'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
