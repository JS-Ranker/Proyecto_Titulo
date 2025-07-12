import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { FaArrowLeft, FaCalendarAlt, FaStethoscope, FaFileAlt, FaPlus, FaEdit, FaTrash, FaDownload, FaPaw, FaUser, FaPhone, FaEnvelope, FaVenusMars, FaWeight, FaBirthdayCake, FaPalette, FaMicrochip, FaCut } from 'react-icons/fa';
import { historialClinicoService, RegistroHistorial } from '../../services/historialClinico';
import { mascotasService, MascotaData } from '../../services/mascotas';
import styles from './DetalleHistorial.module.css';

interface Mascota {
  id_mascota: number;
  nombre_mascota: string;
  nombre_especie?: string;
  nombre_raza?: string;
  fecha_nac_mascota?: string | null;
  peso_kg?: number | null;
  sexo_mascota?: string;
  esta_esterilizado?: boolean | number;
  color_mascota?: string | null;
  codigo_microchip?: string | null;
  url_imagen_mascota?: string;
  rut?: string;
  dueno_nombre: string;
  dueno_apellido: string;
  dueno_email?: string;
  dueno_telefono?: string;
}

const DetalleHistorial: React.FC = () => {
  const { mascota_id } = useParams<{ mascota_id: string }>();
  const { veterinario, isVeterinario, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isVeterinario()) {
      navigate('/login/veterinario');
      return;
    }

    if (mascota_id) {
      cargarDatos();
    }
  }, [isLoading, isVeterinario, navigate, mascota_id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar historial y datos completos de la mascota
      const [historialResponse, mascotaResponse] = await Promise.all([
        historialClinicoService.obtenerHistorialPorMascota(Number(mascota_id)),
        mascotasService.obtenerDatosCompletos(Number(mascota_id))
      ]);

      setHistorial(historialResponse.data);
      setMascota(mascotaResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarRegistro = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      try {
        await historialClinicoService.eliminarRegistroHistorial(id);
        await cargarDatos(); // Recargar datos
      } catch (error) {
        console.error('Error al eliminar registro:', error);
        alert('Error al eliminar el registro');
      }
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

  const formatearFechaNacimiento = (fecha: string | null) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularEdad = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return 'Desconocida';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edadEnMeses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
    
    if (edadEnMeses < 12) {
      return `${edadEnMeses} ${edadEnMeses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(edadEnMeses / 12);
      const mesesRestantes = edadEnMeses % 12;
      if (mesesRestantes === 0) {
        return `${años} ${años === 1 ? 'año' : 'años'}`;
      } else {
        return `${años} ${años === 1 ? 'año' : 'años'} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`;
      }
    }
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

  if (isLoading || loading) {
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
          onClick={() => navigate('/veterinario/historial')}
          className={styles.backButton}
        >
          <FaArrowLeft /> Volver
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
              <h1>{mascota.nombre_mascota}</h1>
              <p>Dueño: {mascota.dueno_nombre} {mascota.dueno_apellido}</p>
              <p className={styles.totalRegistros}>
                {historial.length} registro{historial.length !== 1 ? 's' : ''} médico{historial.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(`/veterinario/historial/nuevo/${mascota_id}`)}
          className={styles.addButton}
        >
          <FaPlus /> Nuevo Registro
        </button>
      </div>

      {/* Información Detallada de la Mascota */}
      {mascota && (
        <div className={styles.mascotaDetailsSection}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsColumn}>
              <h3><FaPaw /> Información de la Mascota</h3>
              <div className={styles.detailItem}>
                <FaPaw />
                <span className={styles.detailLabel}>Especie:</span>
                <span>{mascota.nombre_especie || 'No especificada'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaPaw />
                <span className={styles.detailLabel}>Raza:</span>
                <span>{mascota.nombre_raza || 'No especificada'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaBirthdayCake />
                <span className={styles.detailLabel}>Fecha de Nacimiento:</span>
                <span>{formatearFechaNacimiento(mascota.fecha_nac_mascota || null)}</span>
              </div>
              <div className={styles.detailItem}>
                <FaCalendarAlt />
                <span className={styles.detailLabel}>Edad:</span>
                <span>{calcularEdad(mascota.fecha_nac_mascota || null)}</span>
              </div>
              <div className={styles.detailItem}>
                <FaVenusMars />
                <span className={styles.detailLabel}>Sexo:</span>
                <span>{mascota.sexo_mascota || 'No especificado'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaWeight />
                <span className={styles.detailLabel}>Peso:</span>
                <span>{mascota.peso_kg ? `${mascota.peso_kg} kg` : 'No especificado'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaCut />
                <span className={styles.detailLabel}>Esterilizado:</span>
                <span>{mascota.esta_esterilizado ? 'Sí' : 'No'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaPalette />
                <span className={styles.detailLabel}>Color:</span>
                <span>{mascota.color_mascota || 'No especificado'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaMicrochip />
                <span className={styles.detailLabel}>Microchip:</span>
                <span>{mascota.codigo_microchip || 'No registrado'}</span>
              </div>
            </div>
            
            <div className={styles.detailsColumn}>
              <h3><FaUser /> Información del Dueño</h3>
              <div className={styles.detailItem}>
                <FaUser />
                <span className={styles.detailLabel}>RUT:</span>
                <span>{mascota.rut}</span>
              </div>
              <div className={styles.detailItem}>
                <FaUser />
                <span className={styles.detailLabel}>Nombre:</span>
                <span>{mascota.dueno_nombre} {mascota.dueno_apellido}</span>
              </div>
              <div className={styles.detailItem}>
                <FaEnvelope />
                <span className={styles.detailLabel}>Email:</span>
                <span>{mascota.dueno_email || 'No registrado'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaPhone />
                <span className={styles.detailLabel}>Teléfono:</span>
                <span>{mascota.dueno_telefono || 'No registrado'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                            Dr(a). {registro.veterinario_nombre}
                          </span>
                        </div>
                      </div>
                      <div className={styles.registroActions}>
                        <button
                          onClick={() => navigate(`/veterinario/historial/editar/${registro.id}`)}
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => eliminarRegistro(registro.id!)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          <FaTrash />
                        </button>
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
            <p>Esta mascota aún no tiene registros en su historial médico.</p>
            <button
              onClick={() => navigate(`/veterinario/historial/nuevo/${mascota_id}`)}
              className={styles.emptyAddButton}
            >
              <FaPlus /> Crear Primer Registro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleHistorial;
