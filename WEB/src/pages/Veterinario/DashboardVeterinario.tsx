import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaPrescriptionBottle, FaSignOutAlt, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
import { citasVeterinarioService, EstadisticasVeterinario } from '../../services/citasVeterinario';
import styles from './DashboardVeterinario.module.css';

const DashboardVeterinario = () => {
  const { veterinario, logout, isVeterinario, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [estadisticas, setEstadisticas] = useState<EstadisticasVeterinario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esperar a que termine de cargar antes de verificar autenticación
    if (isLoading) {
      return;
    }
    
    if (!isVeterinario()) {
      navigate('/login/veterinario');
      return;
    }

    // Actualizar la hora cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cargar estadísticas
    if (veterinario) {
      cargarEstadisticas();
    }

    return () => clearInterval(timer);
  }, [isLoading, isVeterinario, navigate, veterinario]);

  const cargarEstadisticas = async () => {
    try {
      const response = await citasVeterinarioService.obtenerEstadisticas(veterinario!.id);
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Mostrar confirmación antes de cerrar sesión
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      logout();
      navigate('/');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || !veterinario) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{isLoading ? 'Verificando sesión...' : 'Cargando panel veterinario...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <FaUserMd className={styles.headerIcon} />
            <div>
              <h1>¡Bienvenido, Dr(a). {veterinario.nombre}!</h1>
              <p>Panel de Control Veterinario</p>
            </div>
          </div>
          <div className={styles.timeSection}>
            <div className={styles.time}>{formatTime(currentTime)}</div>
            <div className={styles.date}>{formatDate(currentTime)}</div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <FaUserMd className={styles.profileIcon} />
            <h2>Información Profesional</h2>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.infoItem}>
              <FaIdCard className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Nombre:</span>
                <span className={styles.infoValue}>{veterinario.nombre}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FaEnvelope className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{veterinario.email}</span>
              </div>
            </div>
            {veterinario.telefono && (
              <div className={styles.infoItem}>
                <FaPhone className={styles.infoIcon} />
                <div>
                  <span className={styles.infoLabel}>Teléfono:</span>
                  <span className={styles.infoValue}>{veterinario.telefono}</span>
                </div>
              </div>
            )}
            {veterinario.numero_licencia && (
              <div className={styles.infoItem}>
                <FaIdCard className={styles.infoIcon} />
                <div>
                  <span className={styles.infoLabel}>N° Licencia:</span>
                  <span className={styles.infoValue}>{veterinario.numero_licencia}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2>Acciones Rápidas</h2>
          <div className={styles.actionsGrid}>
            <div className={styles.actionCard}>
              <FaCalendarAlt className={styles.actionIcon} />
              <h3>Citas del Día</h3>
              <p>Ver y gestionar citas programadas</p>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/veterinario/citas')}
              >
                Ver Citas
              </button>
            </div>
            <div className={styles.actionCard}>
              <FaPrescriptionBottle className={styles.actionIcon} />
              <h3>Historial Médico</h3>
              <p>Consultar historiales de pacientes</p>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/veterinario/historial')}
              >
                Ver Historiales
              </button>
            </div>
            <div className={styles.actionCard}>
              <FaUserMd className={styles.actionIcon} />
              <h3>Mi Perfil</h3>
              <p>Actualizar información profesional</p>
              <button className={styles.actionButton}>Editar Perfil</button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className={styles.statsSection}>
          <h2>Estadísticas</h2>
          {loading ? (
            <div className={styles.statsLoading}>Cargando estadísticas...</div>
          ) : (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{estadisticas?.citas_hoy || 0}</div>
                <div className={styles.statLabel}>Citas Hoy</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{estadisticas?.citas_pendientes || 0}</div>
                <div className={styles.statLabel}>Citas Pendientes</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{estadisticas?.citas_completadas || 0}</div>
                <div className={styles.statLabel}>Citas Completadas</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardVeterinario;
