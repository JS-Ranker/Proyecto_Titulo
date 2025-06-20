import db from '../config/db.js';

const Cita = {
  crear: (datos, callback) => {
    const sql = `
      INSERT INTO citas
        (mascota_id, veterinario_id, tipo_consulta_id, fecha_hora, duracion_minutos, motivo, estado, notas_previas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      datos.mascota_id,
      datos.veterinario_id || null,
      datos.tipo_consulta_id || null,
      datos.fecha_hora,
      datos.duracion_minutos || 30,
      datos.motivo || null,
      datos.estado || 'pendiente',
      datos.notas_previas || null
    ];
    db.query(sql, params, callback);
  }
};

export default Cita;