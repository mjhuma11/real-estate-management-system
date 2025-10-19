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
    // Get properties statistics
    $propertiesStats = [];
    
    // Total properties
    $stmt = $conn->query("SELECT COUNT(*) as total FROM properties");
    $propertiesStats['total'] = (int)$stmt->fetch()['total'];
    
    // Available properties
    $stmt = $conn->query("SELECT COUNT(*) as count FROM properties WHERE status = 'available'");
    $propertiesStats['available'] = (int)$stmt->fetch()['count'];
    
    // Sold properties
    $stmt = $conn->query("SELECT COUNT(*) as count FROM properties WHERE status = 'sold'");
    $propertiesStats['sold'] = (int)$stmt->fetch()['count'];
    
    // Featured properties
    $stmt = $conn->query("SELECT COUNT(*) as count FROM properties WHERE featured = 1");
    $propertiesStats['featured'] = (int)$stmt->fetch()['count'];
    
    // Properties added this month
    $stmt = $conn->query("SELECT COUNT(*) as count FROM properties WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $propertiesStats['thisMonth'] = (int)$stmt->fetch()['count'];
    
    // Get projects statistics
    $projectsStats = [];
    
    // Total projects
    $stmt = $conn->query("SELECT COUNT(*) as total FROM projects");
    $projectsStats['total'] = (int)$stmt->fetch()['total'];
    
    // Projects by status
    $stmt = $conn->query("SELECT status, COUNT(*) as count FROM projects GROUP BY status");
    $projectStatusData = $stmt->fetchAll();
    
    $projectsStats['ongoing'] = 0;
    $projectsStats['completed'] = 0;
    $projectsStats['upcoming'] = 0;
    
    foreach ($projectStatusData as $status) {
        $projectsStats[$status['status']] = (int)$status['count'];
    }
    
    // Get users statistics
    $usersStats = [];
    
    // Total users
    $stmt = $conn->query("SELECT COUNT(*) as total FROM users");
    $usersStats['total'] = (int)$stmt->fetch()['total'];
    
    // Active users
    $stmt = $conn->query("SELECT COUNT(*) as count FROM users WHERE status = 'active'");
    $usersStats['active'] = (int)$stmt->fetch()['count'];
    
    // Users by role
    $stmt = $conn->query("SELECT role, COUNT(*) as count FROM users GROUP BY role");
    $roleData = $stmt->fetchAll();
    
    $usersStats['agents'] = 0;
    $usersStats['customers'] = 0;
    
    foreach ($roleData as $role) {
        if ($role['role'] === 'agent') {
            $usersStats['agents'] = (int)$role['count'];
        } elseif ($role['role'] === 'customer') {
            $usersStats['customers'] = (int)$role['count'];
        }
    }
    
    // Users registered this month
    $stmt = $conn->query("SELECT COUNT(*) as count FROM users WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $usersStats['thisMonth'] = (int)$stmt->fetch()['count'];
    
    // Get bookings statistics (if bookings table exists)
    $bookingsStats = [
        'total' => 0,
        'pending' => 0,
        'confirmed' => 0,
        'thisMonth' => 0,
        'revenue' => 0
    ];
    
    // Check if bookings table exists
    try {
        $stmt = $conn->query("SHOW TABLES LIKE 'bookings'");
        if ($stmt->rowCount() > 0) {
            // Total bookings
            $stmt = $conn->query("SELECT COUNT(*) as total FROM bookings");
            $bookingsStats['total'] = (int)$stmt->fetch()['total'];
            
            // Bookings by status
            $stmt = $conn->query("SELECT status, COUNT(*) as count FROM bookings GROUP BY status");
            $bookingStatusData = $stmt->fetchAll();
            
            foreach ($bookingStatusData as $status) {
                if (isset($bookingsStats[$status['status']])) {
                    $bookingsStats[$status['status']] = (int)$status['count'];
                }
            }
            
            // Bookings this month
            $stmt = $conn->query("SELECT COUNT(*) as count FROM bookings WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
            $bookingsStats['thisMonth'] = (int)$stmt->fetch()['count'];
            
            // Revenue calculation (if amount field exists)
            try {
                $stmt = $conn->query("SELECT SUM(COALESCE(booking_money_amount, 0) + COALESCE(advance_deposit_amount, 0)) as revenue FROM bookings WHERE status IN ('confirmed', 'completed')");
                $revenue = $stmt->fetch()['revenue'];
                $bookingsStats['revenue'] = (float)($revenue ?: 0);
            } catch (Exception $e) {
                // Revenue calculation failed, keep default 0
            }
        }
    } catch (Exception $e) {
        // Bookings table doesn't exist, keep default values
    }
    
    // Alternative: Use appointments table for booking stats if bookings table doesn't exist
    if ($bookingsStats['total'] === 0) {
        try {
            $stmt = $conn->query("SELECT COUNT(*) as total FROM appointments");
            $appointmentsTotal = (int)$stmt->fetch()['total'];
            
            if ($appointmentsTotal > 0) {
                $bookingsStats['total'] = $appointmentsTotal;
                
                // Appointments by status
                $stmt = $conn->query("SELECT status, COUNT(*) as count FROM appointments GROUP BY status");
                $appointmentStatusData = $stmt->fetchAll();
                
                foreach ($appointmentStatusData as $status) {
                    if ($status['status'] === 'pending') {
                        $bookingsStats['pending'] = (int)$status['count'];
                    } elseif ($status['status'] === 'confirmed') {
                        $bookingsStats['confirmed'] = (int)$status['count'];
                    }
                }
                
                // Appointments this month
                $stmt = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
                $bookingsStats['thisMonth'] = (int)$stmt->fetch()['count'];
            }
        } catch (Exception $e) {
            // Keep default values
        }
    }
    
    echo json_encode([
        'success' => true,
        'stats' => [
            'properties' => $propertiesStats,
            'projects' => $projectsStats,
            'users' => $usersStats,
            'bookings' => $bookingsStats
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    error_log("Error in dashboard-stats.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch dashboard statistics: ' . $e->getMessage()
    ]);
}
?>