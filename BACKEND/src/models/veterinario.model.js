import db from '../config/db.js';

const Veterinario = {
  traerPorEspecialidad: (especialidad_id, callback) => {
    const sql = `
      SELECT id, nombre, email, telefono, especialidad_id, numero_licencia
      FROM veterinarios
      WHERE especialidad_id = ? AND activo = 1
    `;
    db.query(sql, [especialidad_id], callback);
  }
};

export default Veterinario;