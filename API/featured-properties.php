<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get featured properties with basic information
    $sql = "SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.monthly_rent,
                p.type,
                p.property_type_id,
                p.bedrooms,
                p.bathrooms,
                p.area,
                p.area_unit,
                p.address,
                p.image,
                p.created_at,
                pt.name as property_type
            FROM properties p
            LEFT JOIN property_types pt ON p.property_type_id = pt.id
            WHERE p.featured = 1 AND p.status = 'available'
            ORDER BY p.created_at DESC
            LIMIT 15";
    
    $stmt = $conn->query($sql);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data for each property
    foreach($properties as &$property) {
        // Format images
        if (!empty($property['image'])) {
            // Build absolute URL safely based on stored value
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $basePath = '/WDPF/React-project/real-estate-management-system/';

            $img = trim($property['image']);
            if (preg_match('#^https?://#i', $img)) {
                // Already an absolute URL
                $imageUrl = $img;
            } elseif (strpos($img, 'uploads/') === 0) {
                // Stored as relative uploads path e.g., uploads/properties/filename.jpg
                $imageUrl = $protocol . $host . $basePath . $img;
            } else {
                // Stored as bare filename in properties table; assume properties folder
                $imageUrl = $protocol . $host . $basePath . 'uploads/properties/' . $img;
            }

            $property['images'] = [$imageUrl];
        } else {
            $property['images'] = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'];
        }
        
        // Format price
        if ($property['price']) {
            $property['price_formatted'] = '৳ ' . number_format($property['price']);
        } elseif ($property['monthly_rent']) {
            $property['price_formatted'] = '৳ ' . number_format($property['monthly_rent']) . '/month';
        } else {
            $property['price_formatted'] = 'Price on request';
        }
    }
    
    echo json_encode([
        'success' => true,
        'properties' => $properties
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
