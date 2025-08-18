<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        handleContactForm();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleContactForm() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if(empty($input['name']) || empty($input['email']) || empty($input['message'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, email, and message are required']);
            return;
        }
        
        // Insert into contact table
        $sql = "INSERT INTO contact (name, email, subject, message) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([
            $input['name'],
            $input['email'],
            $input['subject'] ?? 'General Inquiry',
            $input['message']
        ]);
        
        if($result) {
            echo json_encode(['success' => true, 'message' => 'Thank you for your message. We will get back to you soon!']);
        } else {
            throw new Exception('Failed to save contact form');
        }
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error processing contact form: ' . $e->getMessage()]);
    }
}
?>