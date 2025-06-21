import React, { useEffect, useState } from "react";
import { citasService } from "../../services/citas";
import styles from "./citas.module.css";

const Citas: React.FC = () => {
  const [citas, setCitas] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [citaCancelar, setCitaCancelar] = useState<any>(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    if (currentUser?.rut) {
      citasService.obtenerCitasPorDueno(currentUser.rut).then(setCitas);
    }
  }, [currentUser?.rut]);

  const getEstadoClass = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) return 'estado-pendiente';
    if (estadoLower.includes('confirmada')) return 'estado-confirmada';
    if (estadoLower.includes('completada')) return 'estado-completada';
    if (estadoLower.includes('cancelada')) return 'estado-cancelada';
    return 'estado-pendiente';
  };

  const handleCancelarClick = (cita: any) => {
    setCitaCancelar(cita);
    setModalOpen(true);
  };

  const handleConfirmarCancelacion = async () => {
    if (citaCancelar) {
      await citasService.cancelarCita(citaCancelar.id);
      setCitas((prev) =>
        prev.map((c) =>
          c.id === citaCancelar.id ? { ...c, estado: "cancelada" } : c
        )
      );
      setModalOpen(false);
      setCitaCancelar(null);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setCitaCancelar(null);
  };

  return (
    <div className={styles["citas-container"]}>
      <h1 className={styles["citas-title"]}>Mis Citas</h1>
      {citas.length === 0 ? (
        <div className={styles["no-citas-message"]}>
          <span className={styles["no-citas-icon"]}>🐾</span>
          <p>No tienes citas agendadas.</p>
        </div>
      ) : (
        <div className={styles["table-container"]}>
          <table className={styles["citas-table"]}>
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Veterinario</th>
                <th>Especialidad</th>
                <th>Fecha y Hora</th>
                <th>Estado</th>
              </tr> 
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td className={styles["mascota-cell"]}>{cita.nombre_mascota}</td>
                  <td className={styles["veterinario-cell"]}>
                    {cita.veterinario || "Por asignar"}
                  </td>
                  <td>
                    <span className={styles["especialidad-cell"]}>
                      {cita.tipo_consulta}
                    </span>
                  </td> 
                  <td className={styles["fecha-cell"]}>
                    {new Date(cita.fecha_hora).toLocaleString("es-CL")}
                  </td>
                  <td className={styles["estado-cell"]}>
                    <span className={`estado-badge ${getEstadoClass(cita.estado)}`}>
                      {cita.estado}
                    </span>
                    {(cita.estado === "pendiente" || cita.estado === "confirmada") && (
                      <button
                        style={{
                          marginLeft: 8,
                          padding: "0.3rem 0.7rem",
                          borderRadius: 8,
                          border: "none",
                          background: "#FF8C70",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                        onClick={() => handleCancelarClick(cita)}
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(47,184,198,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(47,184,198,0.15)",
            padding: "2rem 2.5rem",
            minWidth: 320,
            maxWidth: "90vw",
            textAlign: "center",
            border: "2px solid #2FB8C6",
            animation: "fadeIn 0.4s"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>❓</div>
            <h2 style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#2FB8C6",
              marginBottom: 8
            }}>
              ¿Seguro que deseas cancelar esta cita?
            </h2>
            <p style={{
              color: "#666",
              marginBottom: 24,
              fontSize: "1rem"
            }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <button
                onClick={handleConfirmarCancelacion}
                style={{
                  background: "#FF8C70",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.6rem 1.5rem",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255,140,112,0.08)",
                  transition: "background 0.2s"
                }}
              >
                Sí, cancelar
              </button>
              <button
                onClick={handleCerrarModal}
                style={{
                  background: "#A9E5BB",
                  color: "#2FB8C6",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.6rem 1.5rem",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(169,229,187,0.08)",
                  transition: "background 0.2s"
                }}
              >
                No, volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Citas;