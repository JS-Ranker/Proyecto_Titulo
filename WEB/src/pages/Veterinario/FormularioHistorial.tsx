import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { FaArrowLeft, FaSave, FaFileUpload } from 'react-icons/fa';
import { historialClinicoService } from '../../services/historialClinico';
import { mascotasService } from '../../services/mascotas';
import styles from './FormularioHistorial.module.css';

const FormularioHistorial: React.FC = () => {
  const { mascota_id, registro_id } = useParams<{ mascota_id: string; registro_id?: string }>();
  const { veterinario, isVeterinario, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    mascota_id: Number(mascota_id),
    fecha: '',
    tipo: 'consulta' as 'consulta' | 'vacuna' | 'cirugía' | 'tratamiento' | 'examen' | 'otro',
    descripcion: '',
    veterinario_id: 0,
    archivos_adjuntos: ''
  });
  
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mascota, setMascota] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const esEdicion = !!registro_id;

  useEffect(() => {
    if (isLoading) return;
    
    if (!isVeterinario()) {
      navigate('/login/veterinario');
      return;
    }

    if (veterinario) {
      setFormData(prev => ({ ...prev, veterinario_id: veterinario.id }));
      cargarDatos();
    }
  }, [isLoading, isVeterinario, navigate, veterinario, registro_id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de la mascota
      const mascotaResponse = await mascotasService.obtenerMascotaPorId(Number(mascota_id));
      setMascota(mascotaResponse.data);

      // Si es edición, cargar datos del registro
      if (esEdicion && registro_id) {
        const registroResponse = await historialClinicoService.obtenerRegistroPorId(Number(registro_id));
        const registro = registroResponse.data;
        
        setFormData({
          mascota_id: registro.mascota_id,
          fecha: new Date(registro.fecha).toISOString().slice(0, 16),
          tipo: registro.tipo,
          descripcion: registro.descripcion,
          veterinario_id: registro.veterinario_id,
          archivos_adjuntos: registro.archivos_adjuntos || ''
        });
      } else {
        // Para nuevos registros, establecer fecha actual
        const ahora = new Date();
        let descripcionInicial = '';
        let fechaConsulta = ahora.toISOString().slice(0, 16);
        
        // Si viene desde una cita completada, usar esos datos
        const citaInfo = location.state?.citaInfo;
        if (citaInfo) {
          fechaConsulta = new Date(citaInfo.fecha).toISOString().slice(0, 16);
          descripcionInicial = citaInfo.descripcionInicial || '';
        }
        
        setFormData(prev => ({
          ...prev,
          fecha: fechaConsulta,
          descripcion: descripcionInicial
        }));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    setGuardando(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('mascota_id', formData.mascota_id.toString());
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('tipo', formData.tipo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('veterinario_id', formData.veterinario_id.toString());
      
      if (archivo) {
        formDataToSend.append('archivo', archivo);
      }

      if (esEdicion) {
        await historialClinicoService.actualizarRegistroHistorial(Number(registro_id), formDataToSend);
      } else {
        await historialClinicoService.crearRegistroHistorial(formDataToSend);
      }

      navigate(`/veterinario/historial/mascota/${mascota_id}`);
    } catch (error: any) {
      console.error('Error al guardar:', error);
      setError(error.response?.data?.error || 'Error al guardar el registro');
    } finally {
      setGuardando(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando formulario...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          onClick={() => navigate(`/veterinario/historial/mascota/${mascota_id}`)}
          className={styles.backButton}
        >
          <FaArrowLeft /> Volver
        </button>
        
        <div className={styles.headerContent}>
          <h1>
            {esEdicion ? 'Editar Registro' : 'Nuevo Registro'} - {mascota?.nombre_mascota}
            {location.state?.citaInfo && !esEdicion && (
              <span className={styles.citaIndicator}> (Desde Cita)</span>
            )}
          </h1>
          <p>Dr(a). {veterinario?.nombre}</p>
        </div>
      </div>

      {/* Form */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="fecha">Fecha y Hora</label>
            <input
              type="datetime-local"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipo">Tipo de Consulta</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              required
              className={styles.select}
            >
              <option value="consulta">Consulta</option>
              <option value="vacuna">Vacuna</option>
              <option value="cirugía">Cirugía</option>
              <option value="tratamiento">Tratamiento</option>
              <option value="examen">Examen</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Describe detalladamente el procedimiento, diagnóstico, tratamiento, observaciones..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="archivo">Archivo Adjunto (Opcional)</label>
            <div className={styles.fileInputContainer}>
              <input
                type="file"
                id="archivo"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                className={styles.fileInput}
              />
              <label htmlFor="archivo" className={styles.fileLabel}>
                <FaFileUpload />
                {archivo ? archivo.name : 'Seleccionar archivo'}
              </label>
            </div>
            <small className={styles.fileHint}>
              Formatos permitidos: JPG, PNG, PDF, DOC, DOCX (máx. 5MB)
            </small>
            {formData.archivos_adjuntos && !archivo && (
              <div className={styles.currentFile}>
                Archivo actual: 
                <a 
                  href={`http://localhost:3000/${formData.archivos_adjuntos}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.fileLink}
                >
                  Ver archivo
                </a>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate(`/veterinario/historial/mascota/${mascota_id}`)}
              className={styles.cancelButton}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={guardando}
            >
              <FaSave />
              {guardando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioHistorial;
