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

require_once 'config.php';

// Disable HTML error output to prevent JSON corruption
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Helper function for sanitizing input
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Helper function for formatting price
function formatPrice($price) {
    return '৳ ' . number_format($price);
}

// Helper function for logging errors
function logError($message, $data = []) {
    error_log($message . ' - ' . json_encode($data));
}

try {
    // Get pagination parameters
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 12;
    $offset = ($page - 1) * $limit;
    
    // Get filter parameters
    $filters = [];
    $params = [];
    
    if (!empty($_GET['type'])) {
        $filters[] = "p.type = ?";
        $params[] = sanitizeInput($_GET['type']);
    }
    
    if (!empty($_GET['property_type'])) {
        $filters[] = "p.property_type LIKE ?";
        $params[] = '%' . sanitizeInput($_GET['property_type']) . '%';
    }
    
    if (!empty($_GET['location'])) {
        $filters[] = "l.name LIKE ?";
        $params[] = '%' . sanitizeInput($_GET['location']) . '%';
    }
    
    if (!empty($_GET['min_price'])) {
        $filters[] = "(p.price >= ? OR p.monthly_rent >= ?)";
        $minPrice = floatval($_GET['min_price']);
        $params[] = $minPrice;
        $params[] = $minPrice;
    }
    
    if (!empty($_GET['max_price'])) {
        $filters[] = "(p.price <= ? OR p.monthly_rent <= ?)";
        $maxPrice = floatval($_GET['max_price']);
        $params[] = $maxPrice;
        $params[] = $maxPrice;
    }
    
    if (!empty($_GET['bedrooms'])) {
        $filters[] = "p.bedrooms = ?";
        $params[] = intval($_GET['bedrooms']);
    }
    
    if (!empty($_GET['status'])) {
        $filters[] = "p.status = ?";
        $params[] = sanitizeInput($_GET['status']);
    } else {
        $filters[] = "p.status = 'available'";
    }
    
    if (isset($_GET['featured']) && $_GET['featured'] == '1') {
        $filters[] = "p.featured = 1";
    }
    
    // Build WHERE clause
    $whereClause = !empty($filters) ? 'WHERE ' . implode(' AND ', $filters) : '';
    
    // Get properties with enhanced query
    $sql = "SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.monthly_rent,
                p.type,
                p.property_type,
                p.bedrooms,
                p.bathrooms,
                p.area,
                p.area_unit,
                p.floor,
                p.total_floors,
                p.facing,
                p.parking,
                p.balcony,
                p.status,
                p.featured,
                p.views,
                p.address,
                p.created_at,
                p.updated_at,
                c.name as category_name,
                l.name as location_name,
                l.type as location_type,
                u.username as agent_name,
                u.email as agent_email,
                u.phone as agent_phone,
                GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.sort_order) as images,
                GROUP_CONCAT(DISTINCT a.name) as amenities
            FROM properties p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN locations l ON p.location_id = l.id
            LEFT JOIN users u ON p.agent_id = u.id
            LEFT JOIN property_images pi ON p.id = pi.property_id
            LEFT JOIN property_amenities pa ON p.id = pa.property_id
            LEFT JOIN amenities a ON pa.amenity_id = a.id
            $whereClause
            GROUP BY p.id
            ORDER BY p.featured DESC, p.created_at DESC
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $properties = $stmt->fetchAll();
    
    // Format the data for each property
    foreach($properties as &$property) {
        // Format images
        if ($property['images']) {
            $property['images'] = explode(',', $property['images']);
        } else {
            $property['images'] = [];
        }
        
        // Format amenities
        if ($property['amenities']) {
            $property['amenities'] = explode(',', $property['amenities']);
        } else {
            $property['amenities'] = [];
        }
        
        // Format price
        if ($property['price']) {
            $property['price_formatted'] = formatPrice($property['price']);
        } elseif ($property['monthly_rent']) {
            $property['price_formatted'] = formatPrice($property['monthly_rent']) . '/month';
        } else {
            $property['price_formatted'] = 'Price on request';
        }
        
        // Format area
        if ($property['area']) {
            $unitMap = [
                'sq_ft' => 'sq ft',
                'sq_m' => 'sq m',
                'katha' => 'katha',
                'bigha' => 'bigha'
            ];
            $unit = $unitMap[$property['area_unit']] ?? 'sq ft';
            $property['area_formatted'] = number_format($property['area']) . ' ' . $unit;
        }
        
        // Add property URL
        $property['url'] = '/property/' . $property['slug'];
        
        // Format dates
        $property['created_at_formatted'] = date('M d, Y', strtotime($property['created_at']));
        if ($property['updated_at']) {
            $property['updated_at_formatted'] = date('M d, Y', strtotime($property['updated_at']));
        }
    }
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(DISTINCT p.id) as total 
                 FROM properties p
                 LEFT JOIN categories c ON p.category_id = c.id
                 LEFT JOIN locations l ON p.location_id = l.id
                 LEFT JOIN users u ON p.agent_id = u.id
                 $whereClause";
    
    $countParams = array_slice($params, 0, -2); // Remove limit and offset
    $countStmt = $conn->prepare($countSql);
    $countStmt->execute($countParams);
    $totalCount = $countStmt->fetch()['total'];
    
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
        'filters_applied' => !empty($filters),
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    logError('Error in list-properties.php', [
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'params' => $_GET
    ]);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to fetch properties',
        'message' => 'An error occurred while retrieving properties. Please try again later.',
        'debug' => $e->getMessage() // Remove in production
    ]);
}
?>
