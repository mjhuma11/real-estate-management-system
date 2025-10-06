<?php
// Test config.php directly
require_once 'config.php';

echo json_encode([
    'message' => 'Config loaded successfully',
    'database_connected' => isset($conn) ? 'Yes' : 'No',
    'headers_sent' => headers_sent(),
    'headers_list' => headers_list(),
    'timestamp' => date('Y-m-d H:i:s')
]);
?>