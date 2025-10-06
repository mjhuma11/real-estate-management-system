<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['appointment_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Appointment ID is required'
    ]);
    exit;
}

$appointmentId = $input['appointment_id'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Delete appointment
    $query = "DELETE FROM appointments WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([$appointmentId]);

    if ($result && $stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Appointment not found'
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
