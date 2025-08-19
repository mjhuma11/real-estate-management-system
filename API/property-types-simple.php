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
    
    // Simple query to get property types
    $sql = "SELECT id, name, description FROM property_types ORDER BY name ASC";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $propertyTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $propertyTypes,
        'total' => count($propertyTypes)
    ]);
    
} catch (Exception $e) {
    error_log('Error in property-types-simple.php: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to fetch property types',
        'message' => 'An error occurred while retrieving property types. Please try again later.',
        'debug' => $e->getMessage()
    ]);
}
?>