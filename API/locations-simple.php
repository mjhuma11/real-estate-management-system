<?php
// Set JSON header first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Disable HTML error output to prevent JSON corruption
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get type filter if provided
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    
    // Simple query to get locations
    $sql = "SELECT id, name, type FROM locations";
    $params = [];
    
    if (!empty($type)) {
        $sql .= " WHERE type = ?";
        $params[] = $type;
    }
    
    $sql .= " ORDER BY name ASC";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $locations,
        'total' => count($locations)
    ]);
    
} catch (Exception $e) {
    error_log('Error in locations-simple.php: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to fetch locations',
        'message' => 'An error occurred while retrieving locations. Please try again later.',
        'debug' => $e->getMessage()
    ]);
}
?>