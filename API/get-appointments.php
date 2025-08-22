<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create appointments table if it doesn't exist
    $createTableQuery = "
        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            agent_id INT DEFAULT 1,
            property_id INT NOT NULL,
            project_id INT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
            admin_status ENUM('waiting', 'accepted', 'rejected') DEFAULT 'waiting',
            notes TEXT NULL,
            property_title VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ";
    $pdo->exec($createTableQuery);

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
