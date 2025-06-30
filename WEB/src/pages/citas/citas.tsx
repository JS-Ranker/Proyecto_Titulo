import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { citasService } from "../../services/citas";
import styles from "./citas.module.css";

const Citas: React.FC = () => {
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [citaCancelar, setCitaCancelar] = useState<any>(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const fetchCitas = async () => {
      if (!currentUser?.rut) return;
      setLoading(true);
      try {
        const citasData = await citasService.obtenerCitasPorDueno(currentUser.rut);
        setCitas(citasData);
      } catch (err) {
        setCitas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
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
      <div className={styles.profileContainer}>
        <div className={styles.headerBar}>
          <button
            type="button"
            onClick={() => window.history.back()}
            className={styles.backButton}
          >
            <span>←</span>
            Volver
          </button>
          <div className={styles.titleSection}>
            <h1 className={styles["citas-title"]}>📅 Mis Citas</h1>
            <p className={styles.subtitle}>Gestiona tus citas veterinarias</p>
          </div>
          <div style={{ minWidth: '140px' }}></div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando citas...</p>
          </div>
        ) : citas.length === 0 ? (
          <div className={styles["no-citas-message"]}>
            <span className={styles["no-citas-icon"]}>�</span>
            <h3>No tienes citas agendadas</h3>
            <p>Cuando tengas citas programadas, aparecerán aquí para que puedas gestionarlas fácilmente.</p>
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
                      <span className={`${styles["estado-badge"]} ${styles[getEstadoClass(cita.estado)]}`}>
                        {cita.estado}
                      </span>
                      {(cita.estado === "pendiente" || cita.estado === "confirmada") && (
                        <button
                          className={styles.cancelButton}
                          onClick={() => handleCancelarClick(cita)}
                          title="Cancelar esta cita"
                        >
                          ✕ Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación mejorado */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>❓</div>
            <h2 className={styles.modalTitle}>
              ¿Seguro que deseas cancelar esta cita?
            </h2>
            <p className={styles.modalDescription}>
              Esta acción no se puede deshacer y deberás agendar una nueva cita si cambias de opinión.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={handleConfirmarCancelacion}
                className={`${styles.modalButton} ${styles.modalButtonConfirm}`}
              >
                Sí, cancelar
              </button>
              <button
                onClick={handleCerrarModal}
                className={`${styles.modalButton} ${styles.modalButtonCancel}`}
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