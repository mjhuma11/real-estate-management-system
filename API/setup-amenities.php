<?php
require_once 'config.php';

try {
    $sql = file_get_contents(__DIR__ . '/create-amenities-tables.sql');
    $statements = explode(';', $sql);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $conn->exec($statement);
                echo "Executed: " . substr($statement, 0, 50) . "...\n";
            } catch (Exception $e) {
                echo "Error: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "Database setup completed!\n";
} catch (Exception $e) {
    echo "Setup failed: " . $e->getMessage() . "\n";
}
?>