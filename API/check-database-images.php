<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check what images are actually stored in the database
    $sql = "SELECT id, title, image FROM properties WHERE image IS NOT NULL AND image != '' ORDER BY id DESC LIMIT 10";
    $stmt = $conn->query($sql);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $results = [];
    foreach($properties as $property) {
        $imagePath = __DIR__ . '/../uploads/properties/' . $property['image'];
        $imageUrl = 'http://localhost/WDPF/React-project/real-estate-management-system/uploads/properties/' . $property['image'];
        
        $results[] = [
            'id' => $property['id'],
            'title' => $property['title'],
            'image_filename' => $property['image'],
            'image_url' => $imageUrl,
            'file_exists' => file_exists($imagePath),
            'file_size' => file_exists($imagePath) ? filesize($imagePath) : 0
        ];
    }
    
    echo json_encode([
        'success' => true,
        'properties_with_images' => $results,
        'total_count' => count($results)
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
