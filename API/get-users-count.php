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
    // Get total users count
    $totalSql = "SELECT COUNT(*) as total FROM users";
    $totalStmt = $conn->prepare($totalSql);
    $totalStmt->execute();
    $total = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get counts by role
    $roleSql = "SELECT role, COUNT(*) as count FROM users GROUP BY role";
    $roleStmt = $conn->prepare($roleSql);
    $roleStmt->execute();
    $roleData = $roleStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $roleStats = [
        'admin' => 0,
        'agent' => 0,
        'customer' => 0
    ];
    
    foreach ($roleData as $role) {
        $roleStats[$role['role']] = (int)$role['count'];
    }
    
    // Get counts by status
    $statusSql = "SELECT status, COUNT(*) as count FROM users GROUP BY status";
    $statusStmt = $conn->prepare($statusSql);
    $statusStmt->execute();
    $statusData = $statusStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $statusStats = [
        'active' => 0,
        'inactive' => 0,
        'suspended' => 0
    ];
    
    foreach ($statusData as $status) {
        $statusStats[$status['status']] = (int)$status['count'];
    }
    
    // Get new users this month
    $thisMonthSql = "SELECT COUNT(*) as count FROM users WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())";
    $thisMonthStmt = $conn->prepare($thisMonthSql);
    $thisMonthStmt->execute();
    $thisMonth = $thisMonthStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo json_encode([
        'success' => true,
        'count' => (int)$total,
        'stats' => [
            'total' => (int)$total,
            'roles' => $roleStats,
            'status' => $statusStats,
            'thisMonth' => (int)$thisMonth
        ]
    ]);

} catch (Exception $e) {
    error_log("Error in get-users-count.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to get user count: ' . $e->getMessage(),
        'count' => 0
    ]);
}
?>