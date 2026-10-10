// Convierte a bcrypt las contraseñas guardadas en texto plano (bases creadas antes del login seguro).
// Es irreversible: respalda la base antes de ejecutarlo.
//
//   npm run db:hashear-passwords              → solo muestra cuántas cuentas se convertirían
//   npm run db:hashear-passwords -- --confirmar → las convierte
import db from '../src/config/db.js';
import { hashearPassword } from '../src/auth/tokens.js';

const confirmar = process.argv.includes('--confirmar');
const esHash = (valor) => /^\$2[aby]\$\d{2}\$/.test(valor ?? '');

const TABLAS = [
  { tabla: 'duenos', id: 'rut' },
  { tabla: 'veterinarios', id: 'id' },
];

try {
  for (const { tabla, id } of TABLAS) {
    const [filas] = await db.promise().query(`SELECT ${id} AS id, password FROM ${tabla}`);
    const pendientes = filas.filter((fila) => !esHash(fila.password));
    console.log(`${tabla}: ${pendientes.length} de ${filas.length} contraseñas en texto plano`);

    if (!confirmar) continue;
    for (const fila of pendientes) {
      const hash = await hashearPassword(fila.password);
      await db.promise().query(`UPDATE ${tabla} SET password = ? WHERE ${id} = ?`, [hash, fila.id]);
    }
    console.log(`${tabla}: ${pendientes.length} convertidas`);
  }
  if (!confirmar) console.log('\nNo se modificó nada. Ejecuta con --confirmar para convertirlas.');
} finally {
  await db.promise().end();
}
