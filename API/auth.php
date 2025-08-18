<?php
// Prevent direct access to this file
if (!defined('DB_HOST')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access not permitted');
}

// Database connection class
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $conn;

    public function connect() {
        try {
            $this->conn = null;
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $this->conn;
        } catch(PDOException $e) {
            echo json_encode(
                array("message" => "Connection Error: " . $e->getMessage())
            );
            die();
        }
    }
}

// Authentication class
class Auth {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function login($username, $password) {
        try {
            $query = "SELECT * FROM users WHERE username = :username";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            
            if ($user = $stmt->fetch()) {
                if (password_verify($password, $user['password'])) {
                    return true;
                }
            }
            return false;
        } catch(PDOException $e) {
            return false;
        }
    }
    
    public function register($username, $password, $email, $fullName) {
        try {
            // Check if email already exists
            $checkQuery = "SELECT id FROM users WHERE email = :email LIMIT 1";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':email', $email);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() > 0) {
                throw new Exception('Email already exists');
            }
            
            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            $query = "INSERT INTO users (username, password, email, full_name) VALUES (:username, :password, :email, :full_name)";
            $stmt = $this->db->prepare($query);
            
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':full_name', $fullName);
            
            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch(PDOException $e) {
            return false;
        }
    }
}
?>
