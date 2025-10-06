<?php
// Start output buffering to prevent any unwanted output
ob_start();

// Set CORS headers first - moved to a function for consistency
function setCORSHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
}

// Set CORS headers immediately
setCORSHeaders();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean(); // Clear buffer
    exit(0);
}

// Disable HTML error output to prevent JSON corruption
ini_set('display_errors', 0);
error_reporting(0); // Turn off all error reporting

// Database connection
try {
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    ob_end_flush(); // Send output
    exit;
}

try {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or missing id']);
        ob_end_flush(); // Send output
        exit;
    }

    $sql = "SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.monthly_rent,
                p.type,
                p.property_type_id,
                pt.name AS property_type,
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
                p.created_at,
                p.updated_at
            FROM properties p
            LEFT JOIN property_types pt ON p.property_type_id = pt.id
            WHERE p.id = :id
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $property = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$property) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Property not found']);
        ob_end_flush(); // Send output
        exit;
    }

    // Build image URL(s)
    $images = [];
    if (!empty($property['image'])) {
        $img = $property['image'];
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'];
        $basePath = '/WDPF/React-project/real-estate-management-system/';

        if (preg_match('#^https?://#i', $img)) {
            $images[] = $img;
        } elseif (strpos($img, 'uploads/') === 0) {
            $images[] = $protocol . $host . $basePath . $img;
        } else {
            $images[] = $protocol . $host . $basePath . 'uploads/properties/' . basename($img);
        }
    }

    $property['images'] = $images;

    // Price formatted
    if (!empty($property['price'])) {
        $property['price_formatted'] = '৳ ' . number_format($property['price']);
    } elseif (!empty($property['monthly_rent'])) {
        $property['price_formatted'] = '৳ ' . number_format($property['monthly_rent']) . '/month';
    } else {
        $property['price_formatted'] = 'Price on request';
    }

    // Area formatted
    if (!empty($property['area'])) {
        $unitMap = [
            'sq_ft' => 'sq ft',
            'sq_m' => 'sq m',
            'katha' => 'katha',
            'bigha' => 'bigha'
        ];
        $unit = $unitMap[$property['area_unit']] ?? 'sq ft';
        $property['area_formatted'] = number_format($property['area']) . ' ' . $unit;
    }

    // Get property amenities
    $amenitiesStmt = $conn->prepare("
        SELECT a.id, a.name 
        FROM amenities a 
        INNER JOIN property_amenities pa ON a.id = pa.amenity_id 
        WHERE pa.property_id = ?
    ");
    $amenitiesStmt->execute([$id]);
    $propertyAmenities = $amenitiesStmt->fetchAll(PDO::FETCH_ASSOC);
    $property['amenities'] = array_column($propertyAmenities, 'id'); // For form editing
    $property['amenities_list'] = $propertyAmenities; // For display

    // Normalize booleans and location name
    $property['featured'] = (bool)$property['featured'];
    $property['location_name'] = $property['address'];

    echo json_encode([
        'success' => true,
        'data' => $property
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
} finally {
    // Close connection
    $conn = null;
    ob_end_flush(); // Send output
}
?>