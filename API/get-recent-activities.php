<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    // Get query parameters
    $filter = isset($_GET['filter']) ? trim($_GET['filter']) : 'all';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $limit = min($limit, 50); // Max 50 activities
    
    // Check if activities table exists, if not create it
    $stmt = $conn->query("SHOW TABLES LIKE 'activities'");
    if ($stmt->rowCount() === 0) {
        // Activities table doesn't exist, create it and populate with sample data
        include 'create-activities-table.php';
        return;
    }
    
    // Build WHERE clause based on filter
    $whereClause = '';
    $params = [];
    
    if ($filter !== 'all') {
        $whereClause = 'WHERE type LIKE :filter';
        $params[':filter'] = "%$filter%";
    }
    
    // Get activities with user information
    $sql = "SELECT 
                a.id,
                a.type,
                a.user_id,
                a.user_name,
                a.title,
                a.message,
                a.icon,
                a.color,
                a.entity_type,
                a.entity_id,
                a.details,
                a.created_at,
                u.email as user_email,
                u.role as user_role
            FROM activities a
            LEFT JOIN users u ON a.user_id = u.id
            $whereClause
            ORDER BY a.created_at DESC
            LIMIT :limit";
    
    $stmt = $conn->prepare($sql);
    
    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    
    $stmt->execute();
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format activities
    $formattedActivities = [];
    foreach ($activities as $activity) {
        $details = null;
        if ($activity['details']) {
            $details = json_decode($activity['details'], true);
        }
        
        // Add additional context based on entity type
        $additionalInfo = [];
        if ($activity['entity_type'] && $activity['entity_id']) {
            switch ($activity['entity_type']) {
                case 'property':
                    try {
                        $propStmt = $conn->prepare("SELECT title, type, price FROM properties WHERE id = ?");
                        $propStmt->execute([$activity['entity_id']]);
                        $property = $propStmt->fetch();
                        if ($property) {
                            $additionalInfo['property_title'] = $property['title'];
                            $additionalInfo['property_type'] = $property['type'];
                            $additionalInfo['property_price'] = $property['price'];
                        }
                    } catch (Exception $e) {
                        // Ignore errors
                    }
                    break;
                    
                case 'project':
                    try {
                        $projStmt = $conn->prepare("SELECT name, status FROM projects WHERE id = ?");
                        $projStmt->execute([$activity['entity_id']]);
                        $project = $projStmt->fetch();
                        if ($project) {
                            $additionalInfo['project_name'] = $project['name'];
                            $additionalInfo['project_status'] = $project['status'];
                        }
                    } catch (Exception $e) {
                        // Ignore errors
                    }
                    break;
                    
                case 'user':
                    if ($activity['user_email']) {
                        $additionalInfo['email'] = $activity['user_email'];
                        $additionalInfo['role'] = $activity['user_role'];
                    }
                    break;
            }
        }
        
        $formattedActivities[] = [
            'id' => (int)$activity['id'],
            'type' => $activity['type'],
            'user_id' => $activity['user_id'] ? (int)$activity['user_id'] : null,
            'user_name' => $activity['user_name'] ?: 'System',
            'title' => $activity['title'],
            'message' => $activity['message'],
            'icon' => $activity['icon'] ?: 'fa-info-circle',
            'color' => $activity['color'] ?: 'text-primary',
            'entity_type' => $activity['entity_type'],
            'entity_id' => $activity['entity_id'] ? (int)$activity['entity_id'] : null,
            'details' => array_merge($details ?: [], $additionalInfo),
            'created_at' => $activity['created_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'activities' => $formattedActivities,
        'total' => count($formattedActivities),
        'filter' => $filter,
        'limit' => $limit
    ]);

} catch (Exception $e) {
    error_log("Error in get-recent-activities.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch activities: ' . $e->getMessage(),
        'activities' => []
    ]);
}
?>