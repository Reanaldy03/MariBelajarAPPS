<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $pdo = getDBConnection();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch messages
if ($method === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    // Admin: Get all chats with student info
    if ($action === 'get_all_chats') {
        try {
            $stmt = $pdo->prepare("
                SELECT 
                    cm.*,
                    u.id as student_id,
                    u.full_name as student_name
                FROM chat_messages cm
                JOIN users u ON cm.user_id = u.id
                ORDER BY cm.created_at DESC
            ");
            $stmt->execute();
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'data' => $messages]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }
    // Student/Admin: Get messages for specific user
    else {
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
        
        if ($userId <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
            exit();
        }

        try {
            $stmt = $pdo->prepare("
                SELECT 
                    cm.*,
                    u.full_name as student_name
                FROM chat_messages cm
                LEFT JOIN users u ON cm.user_id = u.id
                WHERE cm.user_id = ? 
                ORDER BY cm.created_at ASC
            ");
            $stmt->execute([$userId]);
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'data' => $messages]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }
}

// POST: Send message
else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $userId = isset($input['user_id']) ? intval($input['user_id']) : 0;
    $senderRole = isset($input['sender_role']) ? $input['sender_role'] : '';
    $message = isset($input['message']) ? trim($input['message']) : '';

    if ($userId <= 0 || empty($message) || !in_array($senderRole, ['user', 'admin'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO chat_messages (user_id, sender_role, message) VALUES (?, ?, ?)");
        if ($stmt->execute([$userId, $senderRole, $message])) {
            echo json_encode(['success' => true, 'message' => 'Message sent']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to send message']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
