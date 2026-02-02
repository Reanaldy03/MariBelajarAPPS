<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With'); // Removed Content-Type here because multipart/form-data boundary is handled by browser
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID Pendaftaran tidak valid']);
    exit();
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File tidak ditemukan']);
    exit();
}

$file = $_FILES['file'];
$uploadDir = __DIR__ . '/uploads/';

// Create uploads dir if not exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tipe file tidak valid. Hanya JPG, PNG, atau PDF diperbolehkan.']);
    exit();
}

// Validate size (max 5MB)
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ukuran file terlalu besar (Maks 5MB)']);
    exit();
}

$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'proof_' . $id . '_' . time() . '.' . $extension;
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("UPDATE pendaftaran SET payment_proof = ?, status = 'verification' WHERE id = ?");
        // We store relative URL or filename
        $fileUrl = 'uploads/' . $filename; // Simple relative path for now
        $stmt->execute([$fileUrl, $id]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Bukti pembayaran berhasil diupload. Mohon tunggu verifikasi admin.',
            'data' => ['url' => $fileUrl]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan file']);
}
?>
