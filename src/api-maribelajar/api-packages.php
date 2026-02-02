<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDBConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// GET - List Packages
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $admin = isset($_GET['admin']) && $_GET['admin'] === 'true'; // If true, show inactive too

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM packages WHERE id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch();
        
        if ($data) {
             echo json_encode(['success' => true, 'data' => formatPackage($data)]);
        } else {
             http_response_code(404);
             echo json_encode(['success' => false, 'message' => 'Paket tidak ditemukan']);
        }
    } else {
        $sql = "SELECT * FROM packages";
        if (!$admin) {
            $sql .= " WHERE is_active = 1";
        }
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->query($sql);
        $data = $stmt->fetchAll();
        
        $formatted = array_map('formatPackage', $data);
        echo json_encode(['success' => true, 'data' => $formatted]);
    }
}

// POST - Create Package
else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['name']) || !isset($input['price'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nama dan Harga wajib diisi']);
        exit();
    }

    $sql = "INSERT INTO packages (name, description, price, subjects, level, duration, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $isActive = isset($input['isActive']) ? $input['isActive'] : 1;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['name'],
        $input['description'] ?? '',
        $input['price'],
        $input['subjects'] ?? '',
        $input['level'] ?? '',
        $input['duration'] ?? '',
        $isActive
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Paket berhasil ditambahkan', 'id' => $pdo->lastInsertId()]);
}

// PUT - Update Package
else if ($method === 'PUT') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit();
    }
    
    $id = (int)$_GET['id'];
    $input = json_decode(file_get_contents('php://input'), true);
    
    $updates = [];
    $params = [];
    
    // Whitelist fields
    $fields = ['name', 'description', 'price', 'subjects', 'level', 'duration', 'is_active'];
    
    foreach ($fields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = $input[$field];
        }
    }
    
    // Handle camelCase mapping for is_active if sent from frontend
    if (isset($input['isActive'])) {
        $updates[] = "is_active = ?";
        $params[] = $input['isActive'];
    }

    if (empty($updates)) {
        echo json_encode(['success' => true, 'message' => 'No changes']);
        exit();
    }
    
    $sql = "UPDATE packages SET " . implode(', ', $updates) . " WHERE id = ?";
    $params[] = $id;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(['success' => true, 'message' => 'Paket berhasil diupdate']);
}

// DELETE - Soft Delete (Set is_active = 0) or Hard Delete
else if ($method === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit();
    }
    
    $id = (int)$_GET['id'];
    
    // We'll prioritize Soft Delete
    $stmt = $pdo->prepare("UPDATE packages SET is_active = 0 WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Paket dinonaktifkan']);
}

function formatPackage($row) {
    return [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'price' => (float)$row['price'],
        'subjects' => $row['subjects'],
        'level' => $row['level'],
        'duration' => $row['duration'],
        'isActive' => (bool)$row['is_active'],
        'createdAt' => $row['created_at']
    ];
}
?>
