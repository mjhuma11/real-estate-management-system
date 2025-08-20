<?php
// Simple test script to debug upload issues
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing upload functionality...\n";

// Test 1: Check if config.php loads
try {
    require_once 'config.php';
    echo "✓ Config loaded successfully\n";
    echo "✓ Database connection: " . (isset($conn) ? "OK" : "FAILED") . "\n";
} catch (Exception $e) {
    echo "✗ Config error: " . $e->getMessage() . "\n";
    exit;
}

// Test 2: Check upload directory
$uploadDir = __DIR__ . '/../uploads/';
echo "✓ Upload directory: " . $uploadDir . "\n";
echo "✓ Directory exists: " . (file_exists($uploadDir) ? "YES" : "NO") . "\n";
echo "✓ Directory writable: " . (is_writable($uploadDir) ? "YES" : "NO") . "\n";

// Test 3: Check constants
echo "✓ MAX_FILE_SIZE: " . (defined('MAX_FILE_SIZE') ? MAX_FILE_SIZE : "NOT DEFINED") . "\n";
echo "✓ ALLOWED_EXTENSIONS: " . (defined('ALLOWED_EXTENSIONS') ? implode(', ', ALLOWED_EXTENSIONS) : "NOT DEFINED") . "\n";

echo "\nTest completed.\n";
?>
