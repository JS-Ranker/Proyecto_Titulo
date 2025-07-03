import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaClock, 
  FaTimes, 
  FaEye, 
  FaPaw, 
  FaUser, 
  FaPhone,
  FaFilter,
  FaSearch,
  FaFileAlt
} from 'react-icons/fa';
import { citasVeterinarioService, CitaVeterinario, EstadisticasVeterinario } from '../../services/citasVeterinario';
import styles from './CitasVeterinario.module.css';

const CitasVeterinario = () => {
  const { veterinario, isVeterinario } = useAuth();
  const navigate = useNavigate();
  const [citas, setCitas] = useState<CitaVeterinario[]>([]);
  const [citasFiltradas, setCitasFiltradas] = useState<CitaVeterinario[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasVeterinario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaVeterinario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [notasAtencion, setNotasAtencion] = useState('');

  useEffect(() => {
    if (!isVeterinario()) {
      navigate('/login/veterinario');
      return;
    }

    if (veterinario) {
      cargarDatos();
    }
  }, [veterinario, isVeterinario, navigate]);

  const cargarDatos = async () => {
    if (!veterinario || !veterinario.id) {
      setError('No se pudo obtener la información del veterinario');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const [citasResponse, estadisticasResponse] = await Promise.all([
        citasVeterinarioService.obtenerCitasPorVeterinario(veterinario.id),
        citasVeterinarioService.obtenerEstadisticas(veterinario.id)
      ]);

      setCitas(citasResponse.data);
      setCitasFiltradas(citasResponse.data);
      setEstadisticas(estadisticasResponse.data);
    } catch (err) {
      console.error('Error al cargar las citas:', err);
      setError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar citas
  useEffect(() => {
    let citasTemp = [...citas];

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      citasTemp = citasTemp.filter(cita => cita.estado === filtroEstado);
    }

    // Filtro por fecha
    if (filtroFecha) {
      citasTemp = citasTemp.filter(cita => 
        new Date(cita.fecha_hora).toDateString() === new Date(filtroFecha).toDateString()
      );
    }

    // Filtro por búsqueda
    if (busqueda) {
      citasTemp = citasTemp.filter(cita => 
        cita.nombre_mascota.toLowerCase().includes(busqueda.toLowerCase()) ||
        cita.dueno_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cita.dueno_apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        cita.motivo?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setCitasFiltradas(citasTemp);
  }, [citas, filtroEstado, filtroFecha, busqueda]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return styles.estadoPendiente;
      case 'completada': return styles.estadoCompletada;
      case 'cancelada': return styles.estadoCancelada;
      default: return '';
    }
  };

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <FaClock />;
      case 'completada': return <FaCheckCircle />;
      case 'cancelada': return <FaTimes />;
      default: return <FaClock />;
    }
  };

  const construirUrlImagen = (rutaImagen: string | undefined): string | null => {
    if (!rutaImagen) return null;
    // Si ya es una URL completa, la devolvemos tal como está
    if (rutaImagen.startsWith('http')) return rutaImagen;
    // Si es una ruta relativa, construimos la URL completa
    return `http://localhost:3000/${rutaImagen}`;
  };

  const abrirModalDetalle = (cita: CitaVeterinario) => {
    setCitaSeleccionada(cita);
    setNotasAtencion(cita.notas_atencion || '');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCitaSeleccionada(null);
    setNotasAtencion('');
  };

  const completarCita = async () => {
    if (!citaSeleccionada) return;

    try {
      await citasVeterinarioService.completarCita(citaSeleccionada.id, notasAtencion);
      
      // Redirigir al formulario de historial clínico con los datos de la cita
      navigate(`/veterinario/historial/nuevo/${citaSeleccionada.mascota_id}`, {
        state: {
          citaInfo: {
            fecha: citaSeleccionada.fecha_hora,
            tipo: 'consulta',
            descripcionInicial: notasAtencion,
            mascotaNombre: citaSeleccionada.nombre_mascota
          }
        }
      });
    } catch (err) {
      setError('Error al completar la cita');
      console.error('Error:', err);
    }
  };

  const irAHistorialClinico = () => {
    if (!citaSeleccionada) return;
    
    navigate(`/veterinario/historial/nuevo/${citaSeleccionada.mascota_id}`, {
      state: {
        citaInfo: {
          fecha: citaSeleccionada.fecha_hora,
          tipo: 'consulta',
          descripcionInicial: notasAtencion,
          mascotaNombre: citaSeleccionada.nombre_mascota
        }
      }
    });
  };

  const actualizarEstadoCita = async (citaId: number, nuevoEstado: 'cancelada') => {
    try {
      await citasVeterinarioService.actualizarCita(citaId, { estado: nuevoEstado });
      await cargarDatos();
    } catch (err) {
      setError('Error al actualizar la cita');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header con estadísticas */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Mis Citas</h1>
          {estadisticas && (
            <div className={styles.estadisticas}>
              <div className={styles.estadistica}>
                <span className={styles.numero}>{estadisticas.citas_hoy}</span>
                <span className={styles.label}>Hoy</span>
              </div>
              <div className={styles.estadistica}>
                <span className={styles.numero}>{estadisticas.citas_pendientes}</span>
                <span className={styles.label}>Pendientes</span>
              </div>
              <div className={styles.estadistica}>
                <span className={styles.numero}>{estadisticas.citas_completadas}</span>
                <span className={styles.label}>Completadas</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        <div className={styles.filtroItem}>
          <FaFilter />
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        <div className={styles.filtroItem}>
          <FaCalendarAlt />
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filtroItem}>
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por mascota, dueño o motivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Lista de citas */}
      <div className={styles.citasContainer}>
        {citasFiltradas.length === 0 ? (
          <div className={styles.noCitas}>
            <FaCalendarAlt className={styles.iconoVacio} />
            <p>No hay citas que coincidan con los filtros seleccionados</p>
          </div>
        ) : (
          <div className={styles.citasGrid}>
            {citasFiltradas.map((cita) => (
              <div key={cita.id} className={styles.citaCard}>
                <div className={styles.citaHeader}>
                  <div className={styles.fechaHora}>
                    <div className={styles.fecha}>{formatearFecha(cita.fecha_hora)}</div>
                    <div className={styles.hora}>{formatearHora(cita.fecha_hora)}</div>
                  </div>
                  <div className={`${styles.estado} ${obtenerColorEstado(cita.estado)}`}>
                    {obtenerIconoEstado(cita.estado)}
                    <span>{cita.estado}</span>
                  </div>
                </div>

                <div className={styles.citaInfo}>
                  <div className={styles.infoItem}>
                    <FaPaw className={styles.infoIcon} />
                    <div>
                      <strong>{cita.nombre_mascota}</strong>
                      <span className={styles.detalle}>
                        {cita.especie_nombre} - {cita.raza_nombre}
                        {cita.sexo_mascota && ` • ${cita.sexo_mascota}`}
                        {cita.peso_kg && ` • ${cita.peso_kg} kg`}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <FaUser className={styles.infoIcon} />
                    <div>
                      <strong>{cita.dueno_nombre} {cita.dueno_apellido}</strong>
                      {cita.dueno_telefono && (
                        <span className={styles.detalle}>
                          <FaPhone className={styles.iconoTelefono} />
                          {cita.dueno_telefono}
                        </span>
                      )}
                    </div>
                  </div>

                  {cita.motivo && (
                    <div className={styles.motivo}>
                      <strong>Motivo:</strong> {cita.motivo}
                    </div>
                  )}

                  {cita.tipo_consulta && (
                    <div className={styles.tipoConsulta}>
                      <strong>Tipo:</strong> {cita.tipo_consulta}
                    </div>
                  )}
                </div>

                <div className={styles.citaAcciones}>
                  <button 
                    className={styles.botonVer}
                    onClick={() => abrirModalDetalle(cita)}
                  >
                    <FaEye /> Ver Detalle
                  </button>
                  
                  {cita.estado === 'pendiente' && (
                    <>
                      <button 
                        className={styles.botonCompletar}
                        onClick={() => abrirModalDetalle(cita)}
                      >
                        <FaCheckCircle /> Completar
                      </button>
                      <button 
                        className={styles.botonCancelar}
                        onClick={() => actualizarEstadoCita(cita.id, 'cancelada')}
                      >
                        <FaTimes /> Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {modalAbierto && citaSeleccionada && (
        <div className={styles.modalOverlay} onClick={cerrarModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detalle de la Cita</h2>
              <button className={styles.cerrarModal} onClick={cerrarModal}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalContent}>
              {/* Información de la mascota con imagen */}
              <div className={styles.mascotaHeader}>
                {construirUrlImagen(citaSeleccionada.url_imagen_mascota) && (
                  <div className={styles.imagenMascota}>
                    <img 
                      src={construirUrlImagen(citaSeleccionada.url_imagen_mascota)!} 
                      alt={citaSeleccionada.nombre_mascota}
                      className={styles.imagenMascotaImg}
                      onError={(e) => {
                        console.log('Error cargando imagen:', citaSeleccionada.url_imagen_mascota);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className={styles.infoMascotaPrincipal}>
                  <h3>{citaSeleccionada.nombre_mascota}</h3>
                  <p>{citaSeleccionada.especie_nombre} - {citaSeleccionada.raza_nombre}</p>
                </div>
              </div>

              <div className={styles.detalleGrid}>
                {/* Información básica de la mascota */}
                <div className={styles.seccionDetalle}>
                  <h4>Información de la Mascota</h4>
                  <div className={styles.detalleItem}>
                    <strong>Nombre:</strong>
                    <span>{citaSeleccionada.nombre_mascota}</span>
                  </div>
                  <div className={styles.detalleItem}>
                    <strong>Especie/Raza:</strong>
                    <span>{citaSeleccionada.especie_nombre} - {citaSeleccionada.raza_nombre}</span>
                  </div>
                  {citaSeleccionada.fecha_nac_mascota && (
                    <div className={styles.detalleItem}>
                      <strong>Fecha de Nacimiento:</strong>
                      <span>{new Date(citaSeleccionada.fecha_nac_mascota).toLocaleDateString()}</span>
                    </div>
                  )}
                  {citaSeleccionada.peso_kg && (
                    <div className={styles.detalleItem}>
                      <strong>Peso:</strong>
                      <span>{citaSeleccionada.peso_kg} kg</span>
                    </div>
                  )}
                  {citaSeleccionada.sexo_mascota && (
                    <div className={styles.detalleItem}>
                      <strong>Sexo:</strong>
                      <span>{citaSeleccionada.sexo_mascota}</span>
                    </div>
                  )}
                  {citaSeleccionada.esta_esterilizado !== undefined && (
                    <div className={styles.detalleItem}>
                      <strong>Esterilizado:</strong>
                      <span>{citaSeleccionada.esta_esterilizado ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {citaSeleccionada.color_mascota && (
                    <div className={styles.detalleItem}>
                      <strong>Color:</strong>
                      <span>{citaSeleccionada.color_mascota}</span>
                    </div>
                  )}
                  {citaSeleccionada.codigo_microchip && (
                    <div className={styles.detalleItem}>
                      <strong>Microchip:</strong>
                      <span>{citaSeleccionada.codigo_microchip}</span>
                    </div>
                  )}
                </div>

                {/* Información del dueño */}
                <div className={styles.seccionDetalle}>
                  <h4>Información del Dueño</h4>
                  <div className={styles.detalleItem}>
                    <strong>Nombre:</strong>
                    <span>{citaSeleccionada.dueno_nombre} {citaSeleccionada.dueno_apellido}</span>
                  </div>
                  <div className={styles.detalleItem}>
                    <strong>RUT:</strong>
                    <span>{citaSeleccionada.dueno_rut}</span>
                  </div>
                  <div className={styles.detalleItem}>
                    <strong>Email:</strong>
                    <span>{citaSeleccionada.dueno_email}</span>
                  </div>
                  {citaSeleccionada.dueno_telefono && (
                    <div className={styles.detalleItem}>
                      <strong>Teléfono:</strong>
                      <span>{citaSeleccionada.dueno_telefono}</span>
                    </div>
                  )}
                </div>

                {/* Información de la cita */}
                <div className={styles.seccionDetalle}>
                  <h4>Información de la Cita</h4>
                  <div className={styles.detalleItem}>
                    <strong>Fecha y Hora:</strong>
                    <span>{new Date(citaSeleccionada.fecha_hora).toLocaleString()}</span>
                  </div>
                  <div className={styles.detalleItem}>
                    <strong>Estado:</strong>
                    <span className={`${styles.estadoDetalle} ${obtenerColorEstado(citaSeleccionada.estado)}`}>
                      {citaSeleccionada.estado}
                    </span>
                  </div>
                  {citaSeleccionada.tipo_consulta && (
                    <div className={styles.detalleItem}>
                      <strong>Tipo de Consulta:</strong>
                      <span>{citaSeleccionada.tipo_consulta}</span>
                    </div>
                  )}
                  <div className={styles.detalleItem}>
                    <strong>Duración:</strong>
                    <span>{citaSeleccionada.duracion_minutos} minutos</span>
                  </div>
                </div>
              </div>

              {citaSeleccionada.motivo && (
                <div className={styles.motivoCompleto}>
                  <strong>Motivo de la consulta:</strong>
                  <p>{citaSeleccionada.motivo}</p>
                </div>
              )}

              {citaSeleccionada.notas_previas && (
                <div className={styles.motivoCompleto}>
                  <strong>Notas previas:</strong>
                  <p>{citaSeleccionada.notas_previas}</p>
                </div>
              )}

              <div className={styles.notasAtencion}>
                <strong>Notas de atención:</strong>
                <textarea
                  value={notasAtencion}
                  onChange={(e) => setNotasAtencion(e.target.value)}
                  placeholder="Agregue notas sobre la atención brindada..."
                  className={styles.textarea}
                  rows={4}
                />
              </div>
              
              <div className={styles.infoAyuda}>
                <p><strong>💡 Opciones disponibles:</strong></p>
                <ul>
                  <li><strong>Historial Médico:</strong> Crear registro médico detallado con las notas</li>
                  <li><strong>Completar Cita:</strong> Marcar como completada y crear registro médico</li>
                </ul>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.botonCancelarModal} onClick={cerrarModal}>
                Cancelar
              </button>
              <button 
                className={styles.botonHistorialModal} 
                onClick={irAHistorialClinico}
                title="Agregar al historial clínico"
              >
                <FaFileAlt /> Historial Médico
              </button>
              {citaSeleccionada.estado === 'pendiente' && (
                <button className={styles.botonCompletarModal} onClick={completarCita}>
                  <FaCheckCircle /> Completar Cita
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitasVeterinario;
