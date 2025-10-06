<?php
require_once 'config.php';

// Simple test endpoint to verify CORS headers
echo json_encode([
    'success' => true,
    'message' => 'CORS headers test',
    'timestamp' => date('Y-m-d H:i:s'),
    'headers_sent' => headers_list()
]);
?>