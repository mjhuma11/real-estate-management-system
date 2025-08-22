<?php
// Test script to verify image URL generation and API response
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
    
    // Test 1: Check if properties table exists and has data
    $sql = "SELECT COUNT(*) as total FROM properties";
    $stmt = $conn->query($sql);
    $totalProperties = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Test 2: Check properties with images
    $sql = "SELECT COUNT(*) as total FROM properties WHERE image IS NOT NULL AND image != ''";
    $stmt = $conn->query($sql);
    $propertiesWithImages = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Test 3: Get sample properties (same query as list-properties-simple.php)
    $sql = "SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.monthly_rent,
                p.type,
                p.property_type_id,
                pt.name as property_type,
                p.bedrooms,
                p.bathrooms,
                p.area,
                p.area_unit,
                p.address,
                p.status,
                p.featured,
                p.agent_id,
                p.views,
                p.image,
                p.floor,
                p.total_floors,
                p.facing,
                p.parking,
                p.balcony,
                p.created_by,
                p.created_at,
                p.updated_at
            FROM properties p
            LEFT JOIN property_types pt ON p.property_type_id = pt.id
            ORDER BY p.featured DESC, p.created_at DESC
            LIMIT 3";
    
    $stmt = $conn->query($sql);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data for each property (same logic as API)
    foreach($properties as &$property) {
        if (!empty($property['image'])) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            
            $imageUrl = $protocol . $host . '/WDPF/React-project/real-estate-management-system/uploads/properties/' . $property['image'];
            $property['images'] = [$imageUrl];
            
            // Check if file exists
            $filePath = __DIR__ . '/../uploads/properties/' . $property['image'];
            $property['file_exists'] = file_exists($filePath);
            $property['file_path'] = $filePath;
        } else {
            $property['images'] = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'];
            $property['file_exists'] = false;
        }
        
        // Format price
        if ($property['price']) {
            $property['price_formatted'] = '৳ ' . number_format($property['price']);
        } elseif ($property['monthly_rent']) {
            $property['price_formatted'] = '৳ ' . number_format($property['monthly_rent']) . '/month';
        } else {
            $property['price_formatted'] = 'Price on request';
        }
        
        $property['featured'] = (bool)$property['featured'];
        $property['location_name'] = $property['address'];
    }
    
    echo json_encode([
        'success' => true,
        'statistics' => [
            'total_properties' => $totalProperties,
            'properties_with_images' => $propertiesWithImages
        ],
        'sample_properties' => $properties,
        'server_info' => [
            'HTTP_HOST' => $_SERVER['HTTP_HOST'],
            'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'],
            'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT']
        ]
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>
