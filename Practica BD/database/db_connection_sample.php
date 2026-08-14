<?php
/**
 * EJEMPLO DE CONEXIÓN Y CONSULTA CON PHP Y MYSQL (PDO)
 * Este archivo demuestra cómo se conectaría la aplicación web a MySQL en un entorno real (ej. XAMPP).
 */

$host = 'localhost';
$dbname = 'control_fraccionamiento';
$username = 'root';
$password = '';

try {
    // 1. Crear conexión PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    echo "✅ Conexión exitosa a la base de datos MySQL.\n\n";

    // 2. EJEMPLO SELECT CON INNER JOIN
    $sql = "SELECT 
                a.id,
                v.nombre AS visitante,
                r.numero_casa,
                r.nombre AS residente,
                a.motivo,
                a.fecha_entrada,
                a.fecha_salida,
                a.estado
            FROM accesos a
            INNER JOIN visitantes v ON a.visitante_id = v.id
            INNER JOIN residentes r ON a.residente_id = r.id
            ORDER BY a.fecha_entrada DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $accesos = $stmt->fetchAll();

    echo "--- REGISTROS DE ACCESO (SELECT + JOIN) ---\n";
    foreach ($accesos as $registro) {
        echo "ID: {$registro['id']} | Visitante: {$registro['visitante']} | Destino: {$registro['numero_casa']} ({$registro['residente']}) | Estado: {$registro['estado']}\n";
    }

} catch (PDOException $e) {
    die("❌ Error de conexión o consulta: " . $e->getMessage());
}
?>
