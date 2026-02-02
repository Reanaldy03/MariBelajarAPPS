<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 3600');

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Include config
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDBConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// GET /api-pendaftaran.php - Get all pendaftaran or filter by user_id
if ($method === 'GET' && !isset($_GET['id'])) {
    try {
        $sql = "SELECT * FROM pendaftaran";
        $params = [];
        
        if (isset($_GET['user_id'])) {
            $sql .= " WHERE user_id = ?";
            $params[] = $_GET['user_id'];
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $data = $stmt->fetchAll();
        
        // Format data untuk response
        $formattedData = array_map(function($row) {
            $result = [
                'id' => (int)$row['id'],
                'namaSiswa' => $row['nama_siswa'],
                'nomorTelepon' => $row['nomor_telepon'],
                'mataPelajaran' => $row['mata_pelajaran'],
                'tingkatPendidikan' => $row['tingkat_pendidikan'],
                'jadwalPilihan' => $row['jadwal_pilihan'],
                'metodePembelajaran' => $row['metode_pembelajaran'],
                'createdAt' => $row['created_at'],
                'status' => isset($row['status']) ? $row['status'] : 'pending_payment'
            ];
            // Add optional fields if they exist
            if (isset($row['paket'])) {
                $result['paket'] = $row['paket'];
            }
            if (isset($row['program_khusus']) && !empty($row['program_khusus'])) {
                $result['programKhusus'] = $row['program_khusus'];
            }
            if (isset($row['payment_proof']) && !empty($row['payment_proof'])) {
                // Convert relative path to full URL
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
                $host = $_SERVER['HTTP_HOST'];
                $scriptDir = dirname($_SERVER['PHP_SELF']);
                $result['paymentProof'] = "$protocol://$host$scriptDir/{$row['payment_proof']}";
            }
            if (isset($row['rejection_reason'])) {
                $result['rejectionReason'] = $row['rejection_reason'];
            }
            return $result;
        }, $data);
        
        echo json_encode([
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => $formattedData
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

// GET /api-pendaftaran.php?id=1 - Get single pendaftaran
else if ($method === 'GET' && isset($_GET['id'])) {
    try {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("SELECT * FROM pendaftaran WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        
        if (!$row) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $formattedData = [
            'id' => (int)$row['id'],
            'namaSiswa' => $row['nama_siswa'],
            'nomorTelepon' => $row['nomor_telepon'],
            'mataPelajaran' => $row['mata_pelajaran'],
            'tingkatPendidikan' => $row['tingkat_pendidikan'],
            'jadwalPilihan' => $row['jadwal_pilihan'],
            'metodePembelajaran' => $row['metode_pembelajaran'],
            'createdAt' => $row['created_at'],
            'status' => isset($row['status']) ? $row['status'] : 'pending_payment'
        ];
        
        // Add optional fields if they exist
        if (isset($row['paket'])) {
            $formattedData['paket'] = $row['paket'];
        }
        if (isset($row['program_khusus']) && !empty($row['program_khusus'])) {
            $formattedData['programKhusus'] = $row['program_khusus'];
        }
        if (isset($row['payment_proof']) && !empty($row['payment_proof'])) {
            // Convert relative path to full URL
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $scriptDir = dirname($_SERVER['PHP_SELF']);
            $formattedData['paymentProof'] = "$protocol://$host$scriptDir/{$row['payment_proof']}";
        }
        if (isset($row['rejection_reason'])) {
            $formattedData['rejectionReason'] = $row['rejection_reason'];
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => $formattedData
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

// POST /api-pendaftaran.php - Create new pendaftaran
else if ($method === 'POST' && !isset($_GET['action'])) {
    try {
        // Get JSON input
        $json = file_get_contents('php://input');
        
        if (empty($json)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Tidak ada data yang diterima. Pastikan Content-Type: application/json'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $data = json_decode($json, true);
        
        // Check JSON decode error
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Format JSON tidak valid: ' . json_last_error_msg()
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if ($data === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Data tidak valid atau kosong'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Validation
        $requiredFields = ['namaSiswa', 'nomorTelepon', 'mataPelajaran', 'tingkatPendidikan', 'jadwalPilihan', 'metodePembelajaran', 'paket'];
        $errors = [];
        
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $errors[$field] = ucfirst($field) . ' wajib diisi';
            }
        }
        
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $errors
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Validate phone number format
        if (!preg_match('/^08[0-9]{9,12}$/', $data['nomorTelepon'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Format nomor telepon tidak valid (contoh: 081234567890)'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // Prepare optional fields
        $programKhusus = isset($data['programKhusus']) && !empty($data['programKhusus']) ? $data['programKhusus'] : null;
        $userId = isset($data['userId']) ? $data['userId'] : null;
        $packageId = isset($data['packageId']) ? $data['packageId'] : null;
        $status = 'pending_payment'; // Default status
        
        // Check if new columns exist, if not use old format
        try {
            // Try to insert with new columns
            $stmt = $pdo->prepare(
                "INSERT INTO pendaftaran (user_id, package_id, nama_siswa, nomor_telepon, mata_pelajaran, tingkat_pendidikan, jadwal_pilihan, metode_pembelajaran, paket, program_khusus, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            );
            
            $stmt->execute([
                $userId,
                $packageId,
                $data['namaSiswa'],
                $data['nomorTelepon'],
                $data['mataPelajaran'],
                $data['tingkatPendidikan'],
                $data['jadwalPilihan'],
                $data['metodePembelajaran'],
                $data['paket'],
                $programKhusus,
                $status
            ]);
        } catch (PDOException $e) {
            // If columns don't exist, try with old format (backward compatibility)
            if (strpos($e->getMessage(), 'Unknown column') !== false) {
                 $stmt = $pdo->prepare(
                    "INSERT INTO pendaftaran (nama_siswa, nomor_telepon, mata_pelajaran, tingkat_pendidikan, jadwal_pilihan, metode_pembelajaran, paket, program_khusus) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
                );
                
                $stmt->execute([
                    $data['namaSiswa'],
                    $data['nomorTelepon'],
                    $data['mataPelajaran'],
                    $data['tingkatPendidikan'],
                    $data['jadwalPilihan'],
                    $data['metodePembelajaran'],
                    $data['paket'],
                    $programKhusus
                ]);
            } else {
                throw $e;
            }
        }
        
        $id = $pdo->lastInsertId();
        
        // Get inserted data
        $stmt = $pdo->prepare("SELECT * FROM pendaftaran WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        
        $formattedData = [
            'id' => (int)$row['id'],
            'namaSiswa' => $row['nama_siswa'],
            'nomorTelepon' => $row['nomor_telepon'],
            'mataPelajaran' => $row['mata_pelajaran'],
            'tingkatPendidikan' => $row['tingkat_pendidikan'],
            'jadwalPilihan' => $row['jadwal_pilihan'],
            'metodePembelajaran' => $row['metode_pembelajaran'],
            'createdAt' => $row['created_at']
        ];
        // Add optional fields if they exist
        if (isset($row['paket'])) {
            $formattedData['paket'] = $row['paket'];
        }
        if (isset($row['program_khusus']) && !empty($row['program_khusus'])) {
            $formattedData['programKhusus'] = $row['program_khusus'];
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Pendaftaran berhasil disimpan',
            'data' => $formattedData
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Terjadi kesalahan pada server. Pastikan database berjalan dan tabel sudah dibuat.'
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Terjadi kesalahan pada server'
        ], JSON_UNESCAPED_UNICODE);
    }
}

// PUT /api-pendaftaran.php?id=1 - Update pendaftaran status
else if ($method === 'PUT' && isset($_GET['id'])) {
    try {
        $id = (int)$_GET['id'];
        
        // Get JSON input
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        if (empty($data['status'])) {
             http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Status wajib diisi'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $status = $data['status'];
        $rejectionReason = isset($data['rejectionReason']) ? $data['rejectionReason'] : null;
        
        // Validasi status
        $allowedStatus = ['pending_payment', 'verification', 'active', 'rejected'];
        if (!in_array($status, $allowedStatus)) {
             http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Status tidak valid'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $sql = "UPDATE pendaftaran SET status = ?";
        $params = [$status];
        
        if ($rejectionReason !== null) {
            $sql .= ", rejection_reason = ?";
            $params[] = $rejectionReason;
        }
        
        $sql .= " WHERE id = ?";
        $params[] = $id;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Status berhasil diperbarui'
            ], JSON_UNESCAPED_UNICODE);
        } else {
             echo json_encode(['success' => true, 'message' => 'Tidak ada perubahan data']);
        }
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

// POST Action: Upload Payment Proof
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'upload_payment') {
    if (!isset($_FILES['payment_proof'])) {
        echo json_encode(['success' => false, 'message' => 'File bukti pembayaran tidak ditemukan. Pastikan field name adalah payment_proof']);
        exit();
    }
    
    if (!isset($_POST['id'])) {
        echo json_encode(['success' => false, 'message' => 'ID pendaftaran tidak ditemukan']);
        exit();
    }

    $id = intval($_POST['id']);
    $file = $_FILES['payment_proof'];
    
    // Validate file upload error
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'File terlalu besar (melebihi upload_max_filesize)',
            UPLOAD_ERR_FORM_SIZE => 'File terlalu besar (melebihi MAX_FILE_SIZE)',
            UPLOAD_ERR_PARTIAL => 'File hanya terupload sebagian',
            UPLOAD_ERR_NO_FILE => 'Tidak ada file yang diupload',
            UPLOAD_ERR_NO_TMP_DIR => 'Folder temporary tidak ditemukan',
            UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk',
            UPLOAD_ERR_EXTENSION => 'Upload dihentikan oleh extension'
        ];
        
        $errorMsg = isset($errorMessages[$file['error']]) ? $errorMessages[$file['error']] : 'Unknown error: ' . $file['error'];
        echo json_encode(['success' => false, 'message' => 'Upload error: ' . $errorMsg]);
        exit();
    }
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(['success' => false, 'message' => 'Tipe file tidak didukung. Gunakan JPG, PNG, atau GIF']);
        exit();
    }
    
    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        echo json_encode(['success' => false, 'message' => 'File terlalu besar. Maksimal 5MB']);
        exit();
    }

    $targetDir = "uploads/payments/";
    if (!file_exists($targetDir)) {
        if (!mkdir($targetDir, 0777, true)) {
            echo json_encode(['success' => false, 'message' => 'Gagal membuat folder uploads']);
            exit();
        }
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = "payment_" . $id . "_" . time() . "." . $extension;
    $targetFilePath = $targetDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        try {
            // Update payment_proof and status only (removed tanggal_pembayaran as column doesn't exist)
            $stmt = $pdo->prepare("UPDATE pendaftaran SET payment_proof = ?, status = 'verification' WHERE id = ?");
            
            // Construct full URL
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $scriptDir = dirname($_SERVER['PHP_SELF']);
            $fullUrl = "$protocol://$host$scriptDir/$targetFilePath";
            
            if ($stmt->execute([$targetFilePath, $id])) { // Use relative path in DB
                echo json_encode([
                    'success' => true, 
                    'message' => 'Bukti pembayaran berhasil diupload. Mohon tunggu verifikasi admin.',
                    'payment_url' => $fullUrl
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Gagal update database']);
            }
        } catch (PDOException $e) {
             echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
        }
    } else {
        $uploadError = error_get_last();
        echo json_encode(['success' => false, 'message' => 'Gagal upload file. Error: ' . ($uploadError['message'] ?? 'Unknown')]);
    }
}
 

// DELETE /api-pendaftaran.php?id=1 - Delete pendaftaran
else if ($method === 'DELETE' && isset($_GET['id'])) {
    try {
        $id = (int)$_GET['id'];
        
        $stmt = $pdo->prepare("DELETE FROM pendaftaran WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Data pendaftaran berhasil dihapus'
            ], JSON_UNESCAPED_UNICODE);
        } else {
             http_response_code(404);
             echo json_encode([
                'success' => false, 
                'message' => 'Data tidak ditemukan atau sudah dihapus'
             ], JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}

// Method not allowed
else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed: ' . $method
    ], JSON_UNESCAPED_UNICODE);
}
?>
