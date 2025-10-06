<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'Only GET method allowed'
    ]);
    exit;
}

if (!isset($_GET['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Appointment ID is required'
    ]);
    exit;
}

$appointmentId = $_GET['id'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get appointment status
    $query = "SELECT * FROM appointments WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$appointmentId]);
    $appointment = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($appointment) {
        echo json_encode([
            'success' => true,
            'data' => $appointment
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
