<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['property_id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: property_id and status']);
    exit;
}

$property_id = intval($input['property_id']);
$status = $input['status'];

// Validate status
$allowed_statuses = ['available', 'sold', 'rented', 'pending'];
if (!in_array($status, $allowed_statuses)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid status. Allowed values: ' . implode(', ', $allowed_statuses)]);
    exit;
}

try {
    // Update property status
    $sql = "UPDATE properties SET status = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([$status, $property_id]);
    
    if ($result && $stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Property status updated successfully',
            'property_id' => $property_id,
            'status' => $status
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Property not found or no changes made']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update property status: ' . $e->getMessage()]);
}
?>