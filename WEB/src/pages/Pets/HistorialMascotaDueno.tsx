import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaStethoscope, FaFileAlt, FaDownload } from 'react-icons/fa';
import { historialClinicoService, RegistroHistorial } from '../../services/historialClinico';
import { mascotasService } from '../../services/mascotas';
import styles from './HistorialMascotaDueno.module.css';

interface Mascota {
  id_mascota: number;
  nombre_mascota: string;
  url_imagen_mascota?: string;
}

const HistorialMascotaDueno: React.FC = () => {
  const { mascota_id } = useParams<{ mascota_id: string }>();
  const navigate = useNavigate();
  
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mascota_id) {
      cargarDatos();
    }
  }, [mascota_id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar historial y datos de la mascota
      const [historialResponse, mascotaResponse] = await Promise.all([
        historialClinicoService.obtenerHistorialPorMascota(Number(mascota_id)),
        mascotasService.obtenerMascotaPorId(Number(mascota_id))
      ]);

      setHistorial(historialResponse.data);
      setMascota({
        id_mascota: mascotaResponse.data.id_mascota,
        nombre_mascota: mascotaResponse.data.nombre_mascota,
        url_imagen_mascota: mascotaResponse.data.url_imagen_mascota
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoIcon = (tipo: string) => {
    const iconos = {
      'consulta': '🩺',
      'vacuna': '💉',
      'cirugía': '⚕️',
      'tratamiento': '💊',
      'examen': '🔬',
      'otro': '📋'
    };
    return iconos[tipo as keyof typeof iconos] || '📋';
  };

  const getTipoColor = (tipo: string) => {
    const colores = {
      'consulta': '#4CAF50',
      'vacuna': '#2196F3',
      'cirugía': '#F44336',
      'tratamiento': '#FF9800',
      'examen': '#9C27B0',
      'otro': '#607D8B'
    };
    return colores[tipo as keyof typeof colores] || '#607D8B';
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando historial médico...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          onClick={() => navigate('/pets')}
          className={styles.backButton}
        >
          <FaArrowLeft /> Volver a Mis Mascotas
        </button>
        
        {mascota && (
          <div className={styles.mascotaInfo}>
            <div className={styles.mascotaImage}>
              {mascota.url_imagen_mascota ? (
                <img
                  src={`http://localhost:3000/${mascota.url_imagen_mascota}`}
                  alt={mascota.nombre_mascota}
                />
              ) : (
                <div className={styles.imagePlaceholder}>🐾</div>
              )}
            </div>
            <div className={styles.mascotaDetails}>
              <h1>Historial Médico de {mascota.nombre_mascota}</h1>
              <p className={styles.totalRegistros}>
                {historial.length} registro{historial.length !== 1 ? 's' : ''} médico{historial.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {historial.length > 0 ? (
          <div className={styles.timeline}>
            {historial.map((registro) => (
              <div key={registro.id} className={styles.timelineItem}>
                <div 
                  className={styles.timelineMarker}
                  style={{ backgroundColor: getTipoColor(registro.tipo) }}
                >
                  {getTipoIcon(registro.tipo)}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.registroCard}>
                    <div className={styles.registroHeader}>
                      <div className={styles.registroInfo}>
                        <h3>
                          <FaStethoscope /> 
                          {registro.tipo.charAt(0).toUpperCase() + registro.tipo.slice(1)}
                        </h3>
                        <div className={styles.fechaVeterinario}>
                          <span className={styles.fecha}>
                            <FaCalendarAlt /> {formatearFecha(registro.fecha)}
                          </span>
                          <span className={styles.veterinario}>
                            Atendido por: Dr(a). {registro.veterinario_nombre}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.registroBody}>
                      <div className={styles.descripcion}>
                        <FaFileAlt />
                        <p>{registro.descripcion}</p>
                      </div>
                      
                      {registro.archivos_adjuntos && (
                        <div className={styles.archivo}>
                          <FaDownload />
                          <a 
                            href={`http://localhost:3000/${registro.archivos_adjuntos}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.archivoLink}
                          >
                            Ver archivo adjunto
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FaStethoscope className={styles.emptyIcon} />
            <h3>No hay registros médicos</h3>
            <p>
              {mascota?.nombre_mascota} aún no tiene registros en su historial médico.
              Los registros aparecerán aquí cuando el veterinario los complete después de las consultas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialMascotaDueno;
