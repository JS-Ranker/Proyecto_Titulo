import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaSearch, FaPlus, FaEye, FaArrowLeft } from 'react-icons/fa';
import { historialClinicoService, MascotaAtendida } from '../../services/historialClinico';
import styles from './HistorialVeterinario.module.css';

import { urlArchivo } from '../../services/api';
const HistorialVeterinario: React.FC = () => {
  const { veterinario, isVeterinario, isLoading } = useAuth();
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState<MascotaAtendida[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isLoading) return;
    
    if (!isVeterinario()) {
      navigate('/login/veterinario');
      return;
    }

    if (veterinario) {
      cargarMascotasAtendidas();
    }
  }, [isLoading, isVeterinario, navigate, veterinario]);

  const cargarMascotasAtendidas = async () => {
    try {
      setLoading(true);
      const response = await historialClinicoService.obtenerMascotasPorVeterinario(veterinario!.id);
      setMascotas(response.data);
    } catch (error) {
      console.error('Error al cargar mascotas atendidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const mascotasFiltradas = mascotas.filter(mascota =>
    mascota.nombre_mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${mascota.dueno_nombre} ${mascota.dueno_apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading || !veterinario) {
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
          onClick={() => navigate('/veterinario/dashboard')}
          className={styles.backButton}
        >
          <FaArrowLeft /> Volver
        </button>
        <div className={styles.headerContent}>
          <div>
            <h1>📋 Historial Médico</h1>
            <p>Mascotas atendidas por Dr(a). {veterinario.nombre}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="🔍 Buscar por nombre de mascota o dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando mascotas...</p>
          </div>
        ) : mascotasFiltradas.length > 0 ? (
          <div className={styles.mascotasGrid}>
            {mascotasFiltradas.map((mascota) => (
              <div key={mascota.id_mascota} className={styles.mascotaCard}>
                <div className={styles.mascotaImage}>
                  {mascota.url_imagen_mascota ? (
                    <img
                      src={urlArchivo(mascota.url_imagen_mascota)}
                      alt={mascota.nombre_mascota}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>🐾</div>
                  )}
                </div>
                <div className={styles.mascotaInfo}>
                  <h3>{mascota.nombre_mascota}</h3>
                  <p className={styles.dueno}>
                    👤 Dueño: {mascota.dueno_nombre} {mascota.dueno_apellido}
                  </p>
                  <div className={styles.estadisticas}>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>{mascota.total_consultas}</span>
                      <span className={styles.statLabel}>📊 Consultas</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statDate}>
                        {formatearFecha(mascota.ultima_consulta)}
                      </span>
                      <span className={styles.statLabel}>📅 Última visita</span>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={() => navigate(`/veterinario/historial/mascota/${mascota.id_mascota}`)}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                    >
                      <FaEye /> Ver Historial
                    </button>
                    <button
                      onClick={() => navigate(`/veterinario/historial/nuevo/${mascota.id_mascota}`)}
                      className={`${styles.actionButton} ${styles.addButton}`}
                    >
                      <FaPlus /> Nuevo Registro
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FaHistory className={styles.emptyIcon} />
            <h3>
              {searchTerm ? '🔍 No se encontraron mascotas' : '📝 No has atendido mascotas aún'}
            </h3>
            <p>
              {searchTerm 
                ? 'Intenta con otro término de búsqueda o verifica la ortografía'
                : 'Las mascotas que atiendas aparecerán aquí para su seguimiento médico'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialVeterinario;
