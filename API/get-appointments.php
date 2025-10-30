<?php
require_once 'config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all appointments with property information
    $query = "
        SELECT 
            a.*,
            p.title as property_title_from_db,
            COALESCE(a.property_title, p.title) as property_title
        FROM appointments a
        LEFT JOIN properties p ON a.property_id = p.id
        ORDER BY a.created_at DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $appointments,
        'count' => count($appointments)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>