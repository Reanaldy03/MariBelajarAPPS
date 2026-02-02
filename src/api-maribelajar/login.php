<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->email) && !empty($data->password)) {
        
        $email = htmlspecialchars(strip_tags($data->email));
        
        try {
            $query = "SELECT id, full_name, email, password, role, phone FROM users WHERE email = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch();
                
                if (password_verify($data->password, $user['password'])) {
                    
                    // Remove password from response
                    unset($user['password']);
                    
                    http_response_code(200);
                    echo json_encode([
                        "status" => "success",
                        "message" => "Login successful",
                        "user" => $user
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(["status" => "error", "message" => "Invalid password"]);
                }
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "User not found"]);
            }
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Incomplete login data"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
