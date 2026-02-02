<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->fullName) && !empty($data->email) && !empty($data->password)) {
        
        $fullName = htmlspecialchars(strip_tags($data->fullName));
        $email = htmlspecialchars(strip_tags($data->email));
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $role = $data->role ?? 'siswa';
        $phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : null;

        try {
            // Check if email already exists
            $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $check_stmt->execute([$email]);
            
            if ($check_stmt->rowCount() > 0) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Email already registered"]);
                exit();
            }

            // Insert new user
            $query = "INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            
            if ($stmt->execute([$fullName, $email, $password, $role, $phone])) {
                http_response_code(201);
                echo json_encode(["status" => "success", "message" => "User registered successfully"]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Unable to register user"]);
            }
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Incomplete data"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
