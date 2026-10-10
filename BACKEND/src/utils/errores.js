// Responde un 500 sin exponer detalles internos (SQL, rutas, stack) y deja el detalle en el log.
export const errorServidor = (res, mensaje, err) => {
  console.error(`${mensaje}:`, err?.code || err?.message || err);
  return res.status(500).json({ error: mensaje });
};
