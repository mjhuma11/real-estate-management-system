<?php
// Check for PHP errors in the API files
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get PHP error log location
$errorLog = ini_get('error_log');
if (empty($errorLog)) {
    $errorLog = '/var/log/php_errors.log'; // Default location on some systems
}

$response = [
    'success' => true,
    'php_version' => phpversion(),
    'error_log_location' => $errorLog,
    'display_errors' => ini_get('display_errors'),
    'log_errors' => ini_get('log_errors')
];

// Try to read recent errors
if (file_exists($errorLog)) {
    $lines = file($errorLog, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $recentErrors = array_slice($lines, -20); // Last 20 lines
    $response['recent_errors'] = $recentErrors;
} else {
    $response['error_log_exists'] = false;
    $response['message'] = 'Error log file not found';
}

echo json_encode($response);
?>