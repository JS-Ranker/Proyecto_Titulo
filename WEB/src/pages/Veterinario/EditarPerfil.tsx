import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaLock, FaStethoscope, FaIdCard, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { veterinariosService, VeterinarioPerfil, ActualizarPerfilData, ActualizarPasswordData } from '../../services/veterinario';
import styles from './EditarPerfil.module.css';

const EditarPerfil: React.FC = () => {
  const { veterinario, isVeterinario, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [perfil, setPerfil] = useState<VeterinarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarNuevaPassword, setMostrarNuevaPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  
  // Estados para formulario de perfil
  const [datosProfile, setDatosProfile] = useState({
    email: '',
    telefono: ''
  });

  // Estados para formulario de contraseña
  const [datosPassword, setDatosPassword] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });

  const [errores, setErrores] = useState<{[key: string]: string}>({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (isLoading) return;
    
    if (!isVeterinario()) {
      navigate('/login/veterinario');
      return;
    }

    if (veterinario) {
      cargarPerfil();
    }
  }, [isLoading, isVeterinario, navigate, veterinario]);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const response = await veterinariosService.obtenerPerfilCompleto(veterinario!.id);
      const perfilData = response.data;
      setPerfil(perfilData);
      setDatosProfile({
        email: perfilData.email,
        telefono: perfilData.telefono || ''
      });
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setErrores({ general: 'Error al cargar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const validarFormularioPerfil = () => {
    const nuevosErrores: {[key: string]: string} = {};

    if (!datosProfile.email) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(datosProfile.email)) {
      nuevosErrores.email = 'El email no es válido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const validarFormularioPassword = () => {
    const nuevosErrores: {[key: string]: string} = {};

    if (!datosPassword.passwordActual) {
      nuevosErrores.passwordActual = 'La contraseña actual es requerida';
    }

    if (!datosPassword.nuevaPassword) {
      nuevosErrores.nuevaPassword = 'La nueva contraseña es requerida';
    } else if (datosPassword.nuevaPassword.length < 6) {
      nuevosErrores.nuevaPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (datosPassword.nuevaPassword !== datosPassword.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const actualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormularioPerfil()) return;

    setGuardando(true);
    setErrores({});
    setMensaje('');

    try {
      const datosActualizar: ActualizarPerfilData = {
        email: datosProfile.email,
        telefono: datosProfile.telefono
      };

      await veterinariosService.actualizarPerfil(veterinario!.id, datosActualizar);
      setMensaje('Perfil actualizado correctamente');
      
      // Recargar el perfil
      setTimeout(() => {
        cargarPerfil();
        setMensaje('');
      }, 2000);
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      if (error.response?.data?.error) {
        setErrores({ general: error.response.data.error });
      } else {
        setErrores({ general: 'Error al actualizar el perfil' });
      }
    } finally {
      setGuardando(false);
    }
  };

  const actualizarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormularioPassword()) return;

    setGuardando(true);
    setErrores({});
    setMensaje('');

    try {
      const datosActualizar: ActualizarPasswordData = {
        passwordActual: datosPassword.passwordActual,
        nuevaPassword: datosPassword.nuevaPassword
      };

      await veterinariosService.actualizarPassword(veterinario!.id, datosActualizar);
      setMensaje('Contraseña actualizada correctamente');
      
      // Limpiar formulario
      setDatosPassword({
        passwordActual: '',
        nuevaPassword: '',
        confirmarPassword: ''
      });

      setTimeout(() => {
        setMensaje('');
      }, 3000);
    } catch (error: any) {
      console.error('Error al actualizar contraseña:', error);
      if (error.response?.data?.error) {
        setErrores({ password: error.response.data.error });
      } else {
        setErrores({ password: 'Error al actualizar la contraseña' });
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleInputChange = (field: string, value: string, tipo: 'perfil' | 'password') => {
    if (tipo === 'perfil') {
      setDatosProfile(prev => ({ ...prev, [field]: value }));
    } else {
      setDatosPassword(prev => ({ ...prev, [field]: value }));
    }
    
    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (errores[field]) {
      setErrores(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className={styles.error}>
        <p>Error al cargar el perfil</p>
        <button onClick={() => navigate('/veterinario/dashboard')}>Volver</button>
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
          <FaUser className={styles.headerIcon} />
          <div>
            <h1>Mi Perfil</h1>
            <p>Actualizar información profesional</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {mensaje && (
        <div className={styles.mensaje}>
          {mensaje}
        </div>
      )}

      {errores.general && (
        <div className={styles.error}>
          {errores.general}
        </div>
      )}

      <div className={styles.content}>
        {/* Información Personal (Solo lectura) */}
        <div className={styles.section}>
          <h2><FaUser /> Información Personal</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <FaUser />
              <div>
                <label>Nombre:</label>
                <span>{perfil.nombre}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FaStethoscope />
              <div>
                <label>Especialidad:</label>
                <span>{perfil.nombre_especialidad || 'No especificada'}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FaIdCard />
              <div>
                <label>Número de Licencia:</label>
                <span>{perfil.numero_licencia || 'No registrado'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Contacto (Editable) */}
        <div className={styles.section}>
          <h2><FaEnvelope /> Información de Contacto</h2>
          <form onSubmit={actualizarPerfil} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                <FaEnvelope /> Email:
              </label>
              <input
                type="email"
                id="email"
                value={datosProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value, 'perfil')}
                className={errores.email ? styles.inputError : ''}
                required
              />
              {errores.email && <span className={styles.errorText}>{errores.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono">
                <FaPhone /> Teléfono:
              </label>
              <input
                type="tel"
                id="telefono"
                value={datosProfile.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value, 'perfil')}
                placeholder="Ej: +56912345678"
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={guardando}
            >
              <FaSave /> {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* Cambiar Contraseña */}
        <div className={styles.section}>
          <h2><FaLock /> Cambiar Contraseña</h2>
          <form onSubmit={actualizarPassword} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="passwordActual">
                <FaLock /> Contraseña Actual:
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  id="passwordActual"
                  value={datosPassword.passwordActual}
                  onChange={(e) => handleInputChange('passwordActual', e.target.value, 'password')}
                  className={errores.passwordActual ? styles.inputError : ''}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                >
                  {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errores.passwordActual && <span className={styles.errorText}>{errores.passwordActual}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nuevaPassword">
                <FaLock /> Nueva Contraseña:
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={mostrarNuevaPassword ? "text" : "password"}
                  id="nuevaPassword"
                  value={datosPassword.nuevaPassword}
                  onChange={(e) => handleInputChange('nuevaPassword', e.target.value, 'password')}
                  className={errores.nuevaPassword ? styles.inputError : ''}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setMostrarNuevaPassword(!mostrarNuevaPassword)}
                >
                  {mostrarNuevaPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errores.nuevaPassword && <span className={styles.errorText}>{errores.nuevaPassword}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmarPassword">
                <FaLock /> Confirmar Nueva Contraseña:
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={mostrarConfirmarPassword ? "text" : "password"}
                  id="confirmarPassword"
                  value={datosPassword.confirmarPassword}
                  onChange={(e) => handleInputChange('confirmarPassword', e.target.value, 'password')}
                  className={errores.confirmarPassword ? styles.inputError : ''}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                >
                  {mostrarConfirmarPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errores.confirmarPassword && <span className={styles.errorText}>{errores.confirmarPassword}</span>}
            </div>

            {errores.password && (
              <div className={styles.error}>
                {errores.password}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={guardando}
            >
              <FaLock /> {guardando ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfil;
