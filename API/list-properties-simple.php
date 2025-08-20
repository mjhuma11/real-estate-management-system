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
    
    // Get pagination parameters
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 12;
    $offset = ($page - 1) * $limit;
    
    // Get filter parameters
    $filters = [];
    $params = [];
    
    if (!empty($_GET['search'])) {
        $filters[] = "(p.title LIKE ? OR p.address LIKE ?)";
        $searchTerm = '%' . $_GET['search'] . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    if (!empty($_GET['status']) && $_GET['status'] !== 'all') {
        $filters[] = "p.type = ?";
        $params[] = $_GET['status'];
    }
    
    if (!empty($_GET['property_type'])) {
        $filters[] = "pt.name LIKE ?";
        $params[] = '%' . $_GET['property_type'] . '%';
    }
    
    if (!empty($_GET['location'])) {
        $filters[] = "p.address LIKE ?";
        $params[] = '%' . $_GET['location'] . '%';
    }
    
    // Build WHERE clause
    $whereClause = !empty($filters) ? 'WHERE ' . implode(' AND ', $filters) : '';
    
    // Simple query to get properties with proper field names
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
            $whereClause
            ORDER BY p.featured DESC, p.created_at DESC
            LIMIT $limit OFFSET $offset";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data for each property
    foreach($properties as &$property) {
        // Add default image if none exists
        if (!empty($property['image'])) {
            // Dynamically determine the base URL
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $baseURL = $protocol . $host;

            // Get the path of the current script
            $scriptPath = dirname($_SERVER['SCRIPT_NAME']);

            // Construct the relative path to the project root from the API directory
            // Assuming the API directory is a direct child of the project root
            $projectRoot = realpath($scriptPath . '/..');

            // Construct the full image URL
            $imageUrl = $baseURL . str_replace(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']), '', str_replace('\\', '/', $projectRoot)) . '/uploads/properties/' . $property['image'];
            
            $property['images'] = [$imageUrl];
        } else {
            $property['images'] = ['https://via.placeholder.com/300x200?text=No+Image'];
        }
        
        // Format price
        if ($property['price']) {
            $property['price_formatted'] = '৳ ' . number_format($property['price']);
        } elseif ($property['monthly_rent']) {
            $property['price_formatted'] = '৳ ' . number_format($property['monthly_rent']) . '/month';
        } else {
            $property['price_formatted'] = 'Price on request';
        }
        
        // Format area with proper units
        if ($property['area']) {
            $unitMap = [
                'sq_ft' => 'sq ft',
                'sq_m' => 'sq m', 
                'katha' => 'katha',
                'bigha' => 'bigha'
            ];
            $unit = $unitMap[$property['area_unit']] ?? 'sq ft';
            $property['area_formatted'] = number_format($property['area']) . ' ' . $unit;
        } else {
            $property['area_formatted'] = null;
        }
        
        // Format dates
        if ($property['created_at']) {
            $property['created_at_formatted'] = date('M d, Y', strtotime($property['created_at']));
        }
        
        // Convert featured to boolean
        $property['featured'] = (bool)$property['featured'];
        
        // Use address as location name since no locations_id field exists
        $property['location_name'] = $property['address'];
    }
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM properties p $whereClause";
    $countParams = array_slice($params, 0, -2); // Remove limit and offset
    $countStmt = $conn->prepare($countSql);
    $countStmt->execute($countParams);
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Calculate pagination info
    $totalPages = ceil($totalCount / $limit);
    
    echo json_encode([
        'success' => true,
        'data' => $properties,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_items' => intval($totalCount),
            'items_per_page' => $limit,
            'has_next' => $page < $totalPages,
            'has_prev' => $page > 1
        ],
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    error_log('Error in list-properties-simple.php: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to fetch properties',
        'message' => 'An error occurred while retrieving properties. Please try again later.',
        'debug' => $e->getMessage()
    ]);
}
?>