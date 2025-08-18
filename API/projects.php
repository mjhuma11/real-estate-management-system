<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            getProjectById($_GET['id']);
        } else {
            getAllProjects();
        }
        break;
    case 'POST':
        createProject();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllProjects() {
    global $conn;
    
    try {
        $sql = "SELECT p.*, l.name as location_name, c.name as category_name,
                       GROUP_CONCAT(DISTINCT pi.image_url) as images,
                       GROUP_CONCAT(DISTINCT a.name) as amenities
                FROM projects p
                LEFT JOIN locations l ON p.location_id = l.id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN project_images pi ON p.id = pi.project_id
                LEFT JOIN project_amenities pa ON p.id = pa.project_id
                LEFT JOIN amenities a ON pa.amenity_id = a.id";
        
        $params = [];
        
        // Add filters
        if(isset($_GET['status']) && !empty($_GET['status'])) {
            $sql .= " WHERE p.status = ?";
            $params[] = $_GET['status'];
        }
        
        if(isset($_GET['featured']) && $_GET['featured'] == '1') {
            $sql .= (strpos($sql, 'WHERE') !== false) ? " AND" : " WHERE";
            $sql .= " p.featured = 1";
        }
        
        $sql .= " GROUP BY p.id ORDER BY p.featured DESC, p.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $projects = $stmt->fetchAll();
        
        // Format the data
        foreach($projects as &$project) {
            $project['images'] = $project['images'] ? explode(',', $project['images']) : [];
            $project['amenities'] = $project['amenities'] ? explode(',', $project['amenities']) : [];
            $project['min_price_formatted'] = $project['min_price'] ? '৳ ' . number_format($project['min_price']) : null;
            $project['max_price_formatted'] = $project['max_price'] ? '৳ ' . number_format($project['max_price']) : null;
        }
        
        echo json_encode(['success' => true, 'data' => $projects]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getProjectById($id) {
    global $conn;
    
    try {
        $sql = "SELECT p.*, l.name as location_name, c.name as category_name,
                       u.name as developer_name
                FROM projects p
                LEFT JOIN locations l ON p.location_id = l.id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.developer_id = u.id
                WHERE p.id = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $project = $stmt->fetch();
        
        if(!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Project not found']);
            return;
        }
        
        // Get images
        $imagesSql = "SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order";
        $imagesStmt = $conn->prepare($imagesSql);
        $imagesStmt->execute([$id]);
        $project['images'] = $imagesStmt->fetchAll();
        
        // Get amenities
        $amenitiesSql = "SELECT a.* FROM amenities a 
                        JOIN project_amenities pa ON a.id = pa.amenity_id 
                        WHERE pa.project_id = ?";
        $amenitiesStmt = $conn->prepare($amenitiesSql);
        $amenitiesStmt->execute([$id]);
        $project['amenities'] = $amenitiesStmt->fetchAll();
        
        $project['min_price_formatted'] = $project['min_price'] ? '৳ ' . number_format($project['min_price']) : null;
        $project['max_price_formatted'] = $project['max_price'] ? '৳ ' . number_format($project['max_price']) : null;
        
        echo json_encode(['success' => true, 'data' => $project]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createProject() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $sql = "INSERT INTO projects (name, slug, description, location_id, address, status, 
                category_id, start_date, end_date, completion_percentage, total_units, 
                available_units, min_price, max_price, developer_id, land_area, built_area, 
                total_floors, featured, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $slug = generateSlug($input['name']);
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([
            $input['name'],
            $slug,
            $input['description'],
            $input['location_id'],
            $input['address'],
            $input['status'],
            $input['category_id'],
            $input['start_date'],
            $input['end_date'],
            $input['completion_percentage'] ?? 0,
            $input['total_units'],
            $input['available_units'],
            $input['min_price'],
            $input['max_price'],
            $input['developer_id'],
            $input['land_area'],
            $input['built_area'],
            $input['total_floors'],
            $input['featured'] ?? 0,
            $input['created_by']
        ]);
        
        if($result) {
            $projectId = $conn->lastInsertId();
            echo json_encode(['success' => true, 'id' => $projectId, 'message' => 'Project created successfully']);
        } else {
            throw new Exception('Failed to create project');
        }
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating project: ' . $e->getMessage()]);
    }
}

function generateSlug($name) {
    $slug = strtolower(trim($name));
    $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    return trim($slug, '-');
}
?>