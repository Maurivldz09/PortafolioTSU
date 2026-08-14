/**
 * EJEMPLO DE CONEXIÓN Y CONSULTA CON NODE.JS Y MYSQL2
 * Este archivo demuestra cómo se interactúa con MySQL en Node.js usando Promesas / async await.
 */

const mysql = require('mysql2/promise');

async function ejecutarEjemplo() {
  try {
    // 1. Crear pool de conexiones
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'control_fraccionamiento',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('✅ Conectado a la base de datos MySQL.');

    // 2. Consulta SELECT con JOIN
    const [filas] = await pool.query(`
      SELECT 
        a.id,
        v.nombre AS visitante,
        r.numero_casa,
        r.nombre AS residente,
        a.motivo,
        a.fecha_entrada,
        a.estado
      FROM accesos a
      INNER JOIN visitantes v ON a.visitante_id = v.id
      INNER JOIN residentes r ON a.residente_id = r.id
      ORDER BY a.fecha_entrada DESC
    `);

    console.log('\n--- REGISTROS ENCONTRADOS ---');
    console.table(filas);

    // 3. Ejemplo INSERT preparado (Evita Inyección SQL)
    const [resultadoInsert] = await pool.execute(
      `INSERT INTO accesos (residente_id, visitante_id, motivo, fecha_entrada, estado) VALUES (?, ?, ?, NOW(), ?)`,
      [1, 2, 'Visita de trabajo rápido', 'EN FRACCIONAMIENTO']
    );

    console.log(`\n✅ Nuevo acceso insertado con ID: ${resultadoInsert.insertId}`);

    await pool.end();
  } catch (error) {
    console.error('❌ Error en MySQL:', error.message);
  }
}

// Para ejecutar: node database/db_connection_sample.js
// ejecutarEjemplo();
