<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    // Get query parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $role = isset($_GET['role']) ? trim($_GET['role']) : '';
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    
    // Calculate offset
    $offset = ($page - 1) * $limit;
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    if (!empty($search)) {
        $whereConditions[] = "(username LIKE :search OR email LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    if (!empty($role) && $role !== 'all') {
        $whereConditions[] = "role = :role";
        $params[':role'] = $role;
    }
    
    if (!empty($status) && $status !== 'all') {
        $whereConditions[] = "status = :status";
        $params[':status'] = $status;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM users $whereClause";
    $countStmt = $conn->prepare($countSql);
    foreach ($params as $key => $value) {
        $countStmt->bindValue($key, $value);
    }
    $countStmt->execute();
    $totalUsers = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get users with pagination
    $sql = "SELECT 
                u.id,
                u.username as name,
                u.email,
                u.role,
                u.status,
                u.created_at as joinDate,
                u.last_login_at as lastLogin,
                u.updated_at,
                COALESCE(ap.company_name, '') as company,
                COALESCE(ap.license_number, '') as license,
                COALESCE(ap.rating, 0) as rating,
                COALESCE(ap.properties_sold, 0) as propertiesSold,
                COALESCE(ap.properties_rented, 0) as propertiesRented
            FROM users u
            LEFT JOIN agent_profiles ap ON u.id = ap.user_id AND u.role = 'agent'
            $whereClause
            ORDER BY u.created_at DESC
            LIMIT :limit OFFSET :offset";
    
    $stmt = $conn->prepare($sql);
    
    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format users data
    $formattedUsers = [];
    foreach ($users as $user) {
        // Calculate some mock activity data (you can replace this with real data from other tables)
        $propertiesViewed = rand(5, 50); // Replace with actual query
        $inquiries = rand(0, 15); // Replace with actual query
        
        // Generate avatar URL (you can customize this)
        $avatarSeed = md5($user['email']);
        $avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=$avatarSeed";
        
        $formattedUsers[] = [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => '', // Add phone field to users table if needed
            'role' => $user['role'],
            'status' => $user['status'],
            'joinDate' => $user['joinDate'],
            'lastLogin' => $user['lastLogin'] ?: $user['joinDate'],
            'propertiesViewed' => $propertiesViewed,
            'inquiries' => $inquiries,
            'avatar' => $avatar,
            'company' => $user['company'],
            'license' => $user['license'],
            'rating' => (float)$user['rating'],
            'propertiesSold' => (int)$user['propertiesSold'],
            'propertiesRented' => (int)$user['propertiesRented']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'users' => $formattedUsers,
        'total' => (int)$totalUsers,
        'page' => $page,
        'limit' => $limit,
        'totalPages' => ceil($totalUsers / $limit)
    ]);

} catch (Exception $e) {
    error_log("Error in get-users.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch users: ' . $e->getMessage()
    ]);
}
?>