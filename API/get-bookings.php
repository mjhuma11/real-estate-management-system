<?php
require_once 'config.php';

try {
    // Get filter parameters
    $booking_type = $_GET['booking_type'] ?? '';
    $status = $_GET['status'] ?? '';
    $user_id = $_GET['user_id'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    // Build WHERE clause
    $where_conditions = [];
    $params = [];

    if (!empty($booking_type)) {
        $where_conditions[] = "a.booking_type = ?";
        $params[] = $booking_type;
    }

    if (!empty($status)) {
        $where_conditions[] = "a.status = ?";
        $params[] = $status;
    }

    if (!empty($user_id)) {
        $where_conditions[] = "a.user_id = ?";
        $params[] = $user_id;
    }

    $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

    // Main query to get bookings with related data
    // Removed u.phone as customer_phone since the users table doesn't have a phone column
    $sql = "SELECT 
                a.*,
                u.username as customer_name,
                u.email as customer_email,
                agent.username as agent_name,
                agent.email as agent_email,
                p.title as property_title,
                p.address as property_address,
                p.price as property_price,
                p.monthly_rent as property_monthly_rent,
                p.type as property_type
            FROM appointments a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN users agent ON a.agent_id = agent.id
            LEFT JOIN properties p ON a.property_id = p.id
            $where_clause
            ORDER BY a.created_at DESC
            LIMIT $limit OFFSET $offset";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get total count for pagination
    $count_sql = "SELECT COUNT(*) as total 
                  FROM appointments a
                  LEFT JOIN users u ON a.user_id = u.id
                  LEFT JOIN properties p ON a.property_id = p.id
                  $where_clause";
    
    $count_stmt = $conn->prepare($count_sql);
    $count_stmt->execute($params);
    $total_count = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Format the data
    foreach ($bookings as &$booking) {
        // Format dates
        if ($booking['booking_date']) {
            $booking['booking_date_formatted'] = date('M d, Y', strtotime($booking['booking_date']));
        }
        if ($booking['handover_date']) {
            $booking['handover_date_formatted'] = date('M d, Y', strtotime($booking['handover_date']));
        }
        if ($booking['created_at']) {
            $booking['created_at_formatted'] = date('M d, Y H:i', strtotime($booking['created_at']));
        }

        // Format amounts
        if ($booking['total_property_price']) {
            $booking['total_property_price_formatted'] = '৳ ' . number_format($booking['total_property_price']);
        }
        if ($booking['booking_money_amount']) {
            $booking['booking_money_amount_formatted'] = '৳ ' . number_format($booking['booking_money_amount']);
        }
        if ($booking['monthly_rent_amount']) {
            $booking['monthly_rent_amount_formatted'] = '৳ ' . number_format($booking['monthly_rent_amount']);
        }
        if ($booking['advance_deposit_amount']) {
            $booking['advance_deposit_amount_formatted'] = '৳ ' . number_format($booking['advance_deposit_amount']);
        }
        if ($booking['down_payment_details']) {
            $booking['down_payment_details_formatted'] = '৳ ' . number_format($booking['down_payment_details']);
        }

        // Status badge class
        switch ($booking['status']) {
            case 'pending':
                $booking['status_class'] = 'bg-warning';
                break;
            case 'confirmed':
                $booking['status_class'] = 'bg-success';
                break;
            case 'cancelled':
                $booking['status_class'] = 'bg-danger';
                break;
            case 'completed':
                $booking['status_class'] = 'bg-info';
                break;
            default:
                $booking['status_class'] = 'bg-secondary';
        }

        // Booking type badge class
        $booking['booking_type_class'] = $booking['booking_type'] === 'sale' ? 'bg-primary' : 'bg-info';
    }

    // Calculate pagination
    $total_pages = ceil($total_count / $limit);

    echo json_encode([
        'success' => true,
        'data' => $bookings,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $total_pages,
            'total_items' => intval($total_count),
            'items_per_page' => $limit,
            'has_next' => $page < $total_pages,
            'has_prev' => $page > 1
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch bookings',
        'error' => $e->getMessage()
    ]);
}
?>