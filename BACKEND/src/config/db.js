import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';

// Configurar dotenv para que busque el archivo .env en el directorio padre
dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Conexión a MySQL establecida correctamente');
});

export default connection;