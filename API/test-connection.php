<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$response = [
    'timestamp' => date('Y-m-d H:i:s'),
    'server_status' => 'PHP is working',
    'database_status' => 'Not tested',
    'database_connection' => false,
    'tables_exist' => false,
    'sample_data' => false
];

// Test database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $response['database_status'] = 'Connected successfully';
    $response['database_connection'] = true;
    
    // Check if properties table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'properties'");
    if ($stmt->rowCount() > 0) {
        $response['tables_exist'] = true;
        
        // Check if there's any data
        $stmt = $conn->query("SELECT COUNT(*) as count FROM properties");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        if ($count > 0) {
            $response['sample_data'] = true;
            $response['properties_count'] = $count;
        } else {
            $response['properties_count'] = 0;
            $response['message'] = 'Database connected but no properties found. You may need to add some sample data.';
        }
    } else {
        $response['message'] = 'Properties table does not exist. Please import the SQL file.';
    }
    
} catch (PDOException $e) {
    $response['database_status'] = 'Connection failed: ' . $e->getMessage();
    $response['database_connection'] = false;
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>