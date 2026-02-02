<?php
/**
 * API Endpoint for User Profile Management
 * 
 * Supports:
 * - GET: Fetch profile details
 * - POST update_profile: Update name, phone, email
 * - POST change_password: Change user password
 * - POST upload_avatar: Upload profile picture
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to get input
function getInput() {
    return json_decode(file_get_contents("php://input"), true) ?: $_POST;
}

// GET: Fetch User Profile
if ($method === 'GET') {
    $userId = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($userId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid User ID']);
        exit();
    }

    try {
        $stmt = $conn->prepare("SELECT id, full_name, email, role, phone, avatar, created_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        
        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Construct full avatar URL if exists
            if (!empty($row['avatar'])) {
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
                $host = $_SERVER['HTTP_HOST'];
                $scriptDir = dirname($_SERVER['PHP_SELF']);
                $baseUrl = "$protocol://$host$scriptDir";
                
                if (strpos($row['avatar'], 'http') !== 0) {
                    $row['avatar_url'] = "$baseUrl/" . $row['avatar'];
                } else {
                    $row['avatar_url'] = $row['avatar'];
                }
            }
            
            echo json_encode(['success' => true, 'data' => $row]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit();
}

// POST Actions
if ($method === 'POST') {
    $input = getInput();
    $action = isset($_GET['action']) ? $_GET['action'] : (isset($input['action']) ? $input['action'] : '');
    
    // Action: Update Profile Info
    if ($action === 'update_profile') {
        $userId = isset($input['id']) ? intval($input['id']) : 0;
        $name = isset($input['name']) ? trim($input['name']) : '';
        $phone = isset($input['phone']) ? trim($input['phone']) : '';

        if ($userId <= 0 || empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE users SET full_name = ?, phone = ? WHERE id = ?");
            if ($stmt->execute([$name, $phone, $userId])) {
                echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    // Action: Change Password
    elseif ($action === 'change_password') {
        $userId = isset($input['id']) ? intval($input['id']) : 0;
        $oldPassword = isset($input['old_password']) ? $input['old_password'] : '';
        $newPassword = isset($input['new_password']) ? $input['new_password'] : '';

        if ($userId <= 0 || empty($oldPassword) || empty($newPassword)) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit();
        }

        try {
            $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            
            if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if (password_verify($oldPassword, $row['password'])) {
                    $hashedNew = password_hash($newPassword, PASSWORD_DEFAULT);
                    $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
                    
                    if ($updateStmt->execute([$hashedNew, $userId])) {
                        echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'Password lama salah']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    // Action: Upload Avatar
    elseif ($action === 'upload_avatar') {
        if (!isset($_FILES['avatar']) || !isset($_POST['id'])) {
            echo json_encode(['success' => false, 'message' => 'No file uploaded or user ID missing']);
            exit();
        }

        $userId = intval($_POST['id']);
        $file = $_FILES['avatar'];
        
        $targetDir = "uploads/avatars/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = "avatar_" . $userId . "_" . time() . "." . $extension;
        $targetFilePath = $targetDir . $filename;
        
        $allowedTypes = array('jpg', 'jpeg', 'png', 'gif');
        if (!in_array(strtolower($extension), $allowedTypes)) {
            echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, JPEG, PNG, GIF files are allowed.']);
            exit();
        }

        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            try {
                $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
                if ($stmt->execute([$targetFilePath, $userId])) {
                    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
                    $host = $_SERVER['HTTP_HOST'];
                    $scriptDir = dirname($_SERVER['PHP_SELF']);
                    $fullUrl = "$protocol://$host$scriptDir/$targetFilePath";
                    
                    echo json_encode(['success' => true, 'message' => 'Avatar uploaded successfully', 'avatar_url' => $fullUrl]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Database update failed']);
                }
            } catch (PDOException $e) {
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'File upload failed']);
        }
    }
    
    else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
}

// $conn = null; // PDO connection closes automatically
?>
