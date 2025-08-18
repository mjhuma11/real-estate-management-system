<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        addProject();
        break;
    case 'GET':
        getProjectForm();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function addProject() {
    global $conn;
    
    try {
        // Get the request data
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!$requestData || !isset($requestData['name'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Project name is required'
            ]);
            return;
        }
        
        // Prepare the data
        $name = trim($requestData['name']);
        $slug = createSlug($name);
        $description = $requestData['description'] ?? null;
        $status = $requestData['status'] ?? 'planning';
        $category_id = $requestData['category_id'] ?? null;
        $location_id = $requestData['location_id'] ?? null;
        $address = $requestData['address'] ?? null;
        $start_date = $requestData['start_date'] ?? null;
        $end_date = $requestData['end_date'] ?? null;
        $completion_percentage = $requestData['completion_percentage'] ?? 0.00;
        $total_units = $requestData['total_units'] ?? null;
        $available_units = $requestData['available_units'] ?? null;
        $min_price = $requestData['min_price'] ?? null;
        $max_price = $requestData['max_price'] ?? null;
        $developer_id = $requestData['developer_id'] ?? null;
        $land_area = $requestData['land_area'] ?? null;
        $built_area = $requestData['built_area'] ?? null;
        $total_floors = $requestData['total_floors'] ?? null;
        $featured = $requestData['featured'] ?? 0;
        $brochure_url = $requestData['brochure_url'] ?? null;
        $created_by = $requestData['created_by'] ?? null;
        
        // Validate status
        if (!in_array($status, ['planning', 'ongoing', 'completed', 'upcoming'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid status value'
            ]);
            return;
        }
        
        // Check if slug already exists
        $checkStmt = $conn->prepare("SELECT id FROM projects WHERE slug = :slug");
        $checkStmt->bindParam(':slug', $slug);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            // If slug exists, add a number to make it unique
            $counter = 1;
            $originalSlug = $slug;
            do {
                $slug = $originalSlug . '-' . $counter;
                $checkStmt->bindParam(':slug', $slug);
                $checkStmt->execute();
                $counter++;
            } while ($checkStmt->rowCount() > 0);
        }
        
        // Insert the project
        $sql = "INSERT INTO projects (
            name, slug, description, status, category_id, location_id, address,
            start_date, end_date, completion_percentage, total_units, available_units,
            min_price, max_price, developer_id, land_area, built_area, total_floors,
            featured, brochure_url, created_by
        ) VALUES (
            :name, :slug, :description, :status, :category_id, :location_id, :address,
            :start_date, :end_date, :completion_percentage, :total_units, :available_units,
            :min_price, :max_price, :developer_id, :land_area, :built_area, :total_floors,
            :featured, :brochure_url, :created_by
        )";
        
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':location_id', $location_id);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':start_date', $start_date);
        $stmt->bindParam(':end_date', $end_date);
        $stmt->bindParam(':completion_percentage', $completion_percentage);
        $stmt->bindParam(':total_units', $total_units);
        $stmt->bindParam(':available_units', $available_units);
        $stmt->bindParam(':min_price', $min_price);
        $stmt->bindParam(':max_price', $max_price);
        $stmt->bindParam(':developer_id', $developer_id);
        $stmt->bindParam(':land_area', $land_area);
        $stmt->bindParam(':built_area', $built_area);
        $stmt->bindParam(':total_floors', $total_floors);
        $stmt->bindParam(':featured', $featured);
        $stmt->bindParam(':brochure_url', $brochure_url);
        $stmt->bindParam(':created_by', $created_by);
        
        if ($stmt->execute()) {
            $projectId = $conn->lastInsertId();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Project added successfully',
                'project_id' => $projectId,
                'slug' => $slug
            ]);
        } else {
            throw new Exception('Failed to add project');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error adding project: ' . $e->getMessage()
        ]);
    }
}

function getProjectForm() {
    global $conn;
    
    try {
        // Get categories
        $categories = [];
        $stmt = $conn->query("SELECT id, name FROM categories WHERE status = 'active' ORDER BY name");
        $categories = $stmt->fetchAll();
        
        // Get locations
        $locations = [];
        $stmt = $conn->query("SELECT id, name, type FROM locations WHERE status = 'active' ORDER BY type, name");
        $locations = $stmt->fetchAll();
        
        // Get developers (users with admin role)
        $developers = [];
        $stmt = $conn->query("SELECT u.id, u.username, u.email FROM users u WHERE u.role IN ('admin', 'agent') AND u.status = 'active' ORDER BY u.username");
        $developers = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'locations' => $locations,
                'developers' => $developers,
                'status_options' => [
                    'planning' => 'Planning',
                    'ongoing' => 'Ongoing',
                    'completed' => 'Completed',
                    'upcoming' => 'Upcoming'
                ]
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error fetching form data: ' . $e->getMessage()
        ]);
    }
}

function createSlug($string) {
    // Convert to lowercase
    $string = strtolower($string);
    
    // Replace spaces with hyphens
    $string = preg_replace('/\s+/', '-', $string);
    
    // Remove special characters
    $string = preg_replace('/[^a-z0-9\-]/', '', $string);
    
    // Remove multiple hyphens
    $string = preg_replace('/-+/', '-', $string);
    
    // Remove leading and trailing hyphens
    $string = trim($string, '-');
    
    return $string;
}
?>
