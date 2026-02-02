<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db_name = 'rplbccom_latihan';
$username = 'rplbccom_ulatihan';
$password = 'gvM$BJVrLxt&n6D';

function getDBConnection() {
    global $host, $db_name, $username, $password;
    try {
        $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $conn;
    } catch(PDOException $e) {
        throw $e;
    }
}

// For backward compatibility with existing scripts that expect $conn
try {
    $conn = getDBConnection();
} catch(Exception $e) {
    // Suppress error here as specific files handle it, or just let it be
}
?>
