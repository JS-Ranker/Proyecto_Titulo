import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaArrowLeft, FaEye, FaEyeSlash, FaPaw } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiService } from '../../services/duenos';
import { mascotasService } from '../../services/mascotas'; // Asegúrate de importar el servicio
import styles from './UserProfile.module.css';

// Tipos
interface Pet {
  id: number;
  name: string;
  type: string;
  age: number;
}

interface UserData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  password: string;
  pets?: Pet[];
}

// Tipos para campos editables individualmente
type EditableField = 'email' | 'telefono' | 'password';

interface FieldState {
  isEditing: boolean;
  value: string;
  isUpdating: boolean;
  showSuccess: boolean;
}

interface PasswordState extends FieldState {
  showPassword: boolean;
  showConfirmPassword: boolean;
  confirmPassword: string;
  currentPassword: string;
  showCurrentPassword: boolean;
}

// Constantes
const SUCCESS_MESSAGE_DURATION = 3000;
const ERROR_MESSAGES = {
  NO_USER: 'No se encontró información del usuario',
  LOAD_ERROR: 'Error al cargar los datos del usuario',
  UPDATE_ERROR: 'Error al actualizar los datos',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  PASSWORD_REQUIRED: 'La contraseña actual es requerida',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
} as const;

// Custom hook para manejar datos de usuario
const useUserData = () => {
  const { getCurrentUserRut } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadUserData = useCallback(async () => {
    const userRut = getCurrentUserRut();
    if (!userRut) {
      setError(ERROR_MESSAGES.NO_USER);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.obtenerDuenoPorRut(userRut);
      setUserData(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error loading user data:', err);
      setError(err?.response?.data?.error || ERROR_MESSAGES.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserRut]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return { userData, setUserData, loading, error };
};

// Custom hook para manejar campos editables
const useEditableFields = (userData: UserData | null) => {
  const [emailState, setEmailState] = useState<FieldState>({
    isEditing: false,
    value: '',
    isUpdating: false,
    showSuccess: false,
  });

  const [telefonoState, setTelefonoState] = useState<FieldState>({
    isEditing: false,
    value: '',
    isUpdating: false,
    showSuccess: false,
  });

  const [passwordState, setPasswordState] = useState<PasswordState>({
    isEditing: false,
    value: '',
    isUpdating: false,
    showSuccess: false,
    showPassword: false,
    showConfirmPassword: false,
    confirmPassword: '',
    currentPassword: '',
    showCurrentPassword: false,
  });

  // Inicializar valores cuando userData cambie
  useEffect(() => {
    if (userData) {
      setEmailState(prev => ({ ...prev, value: userData.email || '' }));
      setTelefonoState(prev => ({ ...prev, value: userData.telefono || '' }));
    }
  }, [userData]);

  const startEditing = useCallback((field: EditableField) => {
    switch (field) {
      case 'email':
        setEmailState(prev => ({ ...prev, isEditing: true, showSuccess: false }));
        break;
      case 'telefono':
        setTelefonoState(prev => ({ ...prev, isEditing: true, showSuccess: false }));
        break;
      case 'password':
        setPasswordState(prev => ({
          ...prev,
          isEditing: true,
          showSuccess: false,
          value: '',
          confirmPassword: '',
          currentPassword: '',
        }));
        break;
    }
  }, []);

  const cancelEditing = useCallback((field: EditableField) => {
    switch (field) {
      case 'email':
        setEmailState(prev => ({
          ...prev,
          isEditing: false,
          value: userData?.email || '',
        }));
        break;
      case 'telefono':
        setTelefonoState(prev => ({
          ...prev,
          isEditing: false,
          value: userData?.telefono || '',
        }));
        break;
      case 'password':
        setPasswordState(prev => ({
          ...prev,
          isEditing: false,
          value: '',
          confirmPassword: '',
          currentPassword: '',
          showPassword: false,
          showConfirmPassword: false,
          showCurrentPassword: false,
        }));
        break;
    }
  }, [userData]);

  const updateFieldValue = useCallback((field: EditableField, value: string, extraField?: string) => {
    switch (field) {
      case 'email':
        setEmailState(prev => ({ ...prev, value }));
        break;
      case 'telefono':
        setTelefonoState(prev => ({ ...prev, value }));
        break;
      case 'password':
        if (extraField === 'confirm') {
          setPasswordState(prev => ({ ...prev, confirmPassword: value }));
        } else if (extraField === 'current') {
          setPasswordState(prev => ({ ...prev, currentPassword: value }));
        } else {
          setPasswordState(prev => ({ ...prev, value }));
        }
        break;
    }
  }, []);

  const togglePasswordVisibility = useCallback((type: 'new' | 'confirm' | 'current') => {
    setPasswordState(prev => ({
      ...prev,
      ...(type === 'new' && { showPassword: !prev.showPassword }),
      ...(type === 'confirm' && { showConfirmPassword: !prev.showConfirmPassword }),
      ...(type === 'current' && { showCurrentPassword: !prev.showCurrentPassword }),
    }));
  }, []);

  return {
    emailState,
    telefonoState,
    passwordState,
    setEmailState,
    setTelefonoState,
    setPasswordState,
    startEditing,
    cancelEditing,
    updateFieldValue,
    togglePasswordVisibility,
  };
};

// Componentes
const LoadingSpinner: React.FC = () => (
  <div className={styles.pageContainer}>
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando perfil...</p>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
  <div className={styles.pageContainer}>
    <div className={styles.errorContainer}>
      <h2>Error</h2>
      <p>{error}</p>
      <Link to="/" className={styles.backButton}>
        <FaArrowLeft /> Volver al inicio
      </Link>
    </div>
  </div>
);

const ProfileHeader: React.FC<{ userName: string }> = ({ userName }) => (
  <div className={styles.header}>
    <Link to="/" className={styles.backLink}>
      <FaArrowLeft /> Volver al inicio
    </Link>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <h1 className={styles.welcomeMessage}>
        ¡Bienvenido, {userName}!
      </h1>
      <p className={styles.profileTitle}>
        Gestiona tu información personal
      </p>
    </div>
  </div>
);

// Componente para campos no editables
const ReadOnlyField: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className={styles.field}>
    <div className={styles.fieldHeader}>
      <Icon className={styles.fieldIcon} />
      <label>{label}</label>
    </div>
    <div className={styles.fieldValue}>
      {value}
    </div>
  </div>
);

// Componente para campos editables individualmente
const EditableField: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  fieldState: FieldState;
  fieldType: EditableField;
  inputType?: string;
  onEdit: (field: EditableField) => void;
  onCancel: (field: EditableField) => void;
  onSave: (field: EditableField) => Promise<void>;
  onChange: (field: EditableField, value: string) => void;
}> = ({
  icon: Icon,
  label,
  value,
  fieldState,
  fieldType,
  inputType = 'text',
  onEdit,
  onCancel,
  onSave,
  onChange,
}) => {
  const handleSave = () => onSave(fieldType);
  const handleCancel = () => onCancel(fieldType);
  const handleEdit = () => onEdit(fieldType);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    onChange(fieldType, e.target.value);

  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <Icon className={styles.fieldIcon} />
        <label>{label}</label>
        {!fieldState.isEditing && (
          <button
            onClick={handleEdit}
            className={styles.editFieldButton}
            title={`Editar ${label.toLowerCase()}`}
            type="button"
          >
            <FaEdit />
          </button>
        )}
      </div>

      {fieldState.showSuccess && (
        <div className={styles.fieldSuccess}>
          ✓ {label} actualizado correctamente
        </div>
      )}

      {fieldState.isEditing ? (
        <div className={styles.editFieldContainer}>
          <input
            type={inputType}
            value={fieldState.value}
            onChange={handleChange}
            className={styles.editInput}
            placeholder={`Nuevo ${label.toLowerCase()}`}
            autoFocus
          />
          <div className={styles.fieldActions}>
            <button
              onClick={handleSave}
              className={styles.saveFieldButton}
              disabled={fieldState.isUpdating}
              type="button"
            >
              {fieldState.isUpdating ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <FaSave />
              )}
            </button>
            <button
              onClick={handleCancel}
              className={styles.cancelFieldButton}
              disabled={fieldState.isUpdating}
              type="button"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.fieldValue}>
          {inputType === 'password' ? '••••••••' : (value || 'No especificado')}
        </div>
      )}
    </div>
  );
};

// Componente especializado para contraseña
const PasswordField: React.FC<{
  passwordState: PasswordState;
  onEdit: (field: EditableField) => void;
  onCancel: (field: EditableField) => void;
  onSave: (field: EditableField) => Promise<void>;
  onChange: (field: EditableField, value: string, extra?: string) => void;
  onToggleVisibility: (type: 'new' | 'confirm' | 'current') => void;
}> = ({
  passwordState,
  onEdit,
  onCancel,
  onSave,
  onChange,
  onToggleVisibility,
}) => {
  const handleSave = () => onSave('password');
  const handleCancel = () => onCancel('password');
  const handleEdit = () => onEdit('password');

  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <FaLock className={styles.fieldIcon} />
        <label>Contraseña</label>
        {!passwordState.isEditing && (
          <button
            onClick={handleEdit}
            className={styles.editFieldButton}
            title="Cambiar contraseña"
            type="button"
          >
            <FaEdit />
          </button>
        )}
      </div>

      {passwordState.showSuccess && (
        <div className={styles.fieldSuccess}>
          ✓ Contraseña actualizada correctamente
        </div>
      )}

      {passwordState.isEditing ? (
        <div className={styles.passwordEditContainer}>
          {/* Contraseña actual */}
          <div className={styles.passwordInputGroup}>
            <input
              type={passwordState.showCurrentPassword ? 'text' : 'password'}
              value={passwordState.currentPassword}
              onChange={(e) => onChange('password', e.target.value, 'current')}
              className={styles.editInput}
              placeholder="Contraseña actual"
            />
            <button
              type="button"
              onClick={() => onToggleVisibility('current')}
              className={styles.passwordToggle}
            >
              {passwordState.showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Nueva contraseña */}
          <div className={styles.passwordInputGroup}>
            <input
              type={passwordState.showPassword ? 'text' : 'password'}
              value={passwordState.value}
              onChange={(e) => onChange('password', e.target.value)}
              className={styles.editInput}
              placeholder="Nueva contraseña"
            />
            <button
              type="button"
              onClick={() => onToggleVisibility('new')}
              className={styles.passwordToggle}
            >
              {passwordState.showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className={styles.passwordInputGroup}>
            <input
              type={passwordState.showConfirmPassword ? 'text' : 'password'}
              value={passwordState.confirmPassword}
              onChange={(e) => onChange('password', e.target.value, 'confirm')}
              className={styles.editInput}
              placeholder="Confirmar nueva contraseña"
            />
            <button
              type="button"
              onClick={() => onToggleVisibility('confirm')}
              className={styles.passwordToggle}
            >
              {passwordState.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className={styles.fieldActions}>
            <button
              onClick={handleSave}
              className={styles.saveFieldButton}
              disabled={passwordState.isUpdating}
              type="button"
            >
              {passwordState.isUpdating ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <FaSave />
              )}
            </button>
            <button
              onClick={handleCancel}
              className={styles.cancelFieldButton}
              disabled={passwordState.isUpdating}
              type="button"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.fieldValue}>
          ••••••••
        </div>
      )}
    </div>
  );
};

// Componente de sección de mascotas con botón
const PetsSection: React.FC<{ pets: any[] }> = ({ pets }) => (
  <div className={styles.petsSection}>
    <div className={styles.petsSectionHeader}>
      <h2>🐾 Mis Mascotas</h2>
      <Link to="/mascotas" className={styles.viewAllPetsButton}>
        <FaPaw /> Ver y gestionar mascotas
      </Link>
    </div>
    <div className={styles.petsGrid}>
      {pets.map(pet => (
        <div key={pet.id} className={styles.petCard}>
          {pet.url_imagen_mascota && (
            <img
              src={pet.url_imagen_mascota}
              alt={pet.nombre}
              className={styles.petImage}
              style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }}
            />
          )}
          <h3>{pet.nombre}</h3>
        </div>
      ))}
    </div>
  </div>
);

// Componente principal
const UserProfile: React.FC = () => {
  const { userData, setUserData, loading, error } = useUserData();
  // Nuevo estado para las mascotas
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loadingMascotas, setLoadingMascotas] = useState(false);

  const {
    emailState,
    telefonoState,
    passwordState,
    setEmailState,
    setTelefonoState,
    setPasswordState,
    startEditing,
    cancelEditing,
    updateFieldValue,
    togglePasswordVisibility,
  } = useEditableFields(userData);

  // Función corregida para guardar campos
  const handleSaveField = useCallback(async (field: EditableField) => {
    if (!userData) return;

    const setUpdating = (isUpdating: boolean) => {
      switch (field) {
        case 'email':
          setEmailState(prev => ({ ...prev, isUpdating }));
          break;
        case 'telefono':
          setTelefonoState(prev => ({ ...prev, isUpdating }));
          break;
        case 'password':
          setPasswordState(prev => ({ ...prev, isUpdating }));
          break;
      }
    };

    const showSuccess = () => {
      switch (field) {
        case 'email':
          setEmailState(prev => ({ ...prev, showSuccess: true, isEditing: false }));
          setTimeout(() => setEmailState(prev => ({ ...prev, showSuccess: false })), SUCCESS_MESSAGE_DURATION);
          break;
        case 'telefono':
          setTelefonoState(prev => ({ ...prev, showSuccess: true, isEditing: false }));
          setTimeout(() => setTelefonoState(prev => ({ ...prev, showSuccess: false })), SUCCESS_MESSAGE_DURATION);
          break;
        case 'password':
          setPasswordState(prev => ({ 
            ...prev, 
            showSuccess: true, 
            isEditing: false,
            value: '',
            confirmPassword: '',
            currentPassword: '',
          }));
          setTimeout(() => setPasswordState(prev => ({ ...prev, showSuccess: false })), SUCCESS_MESSAGE_DURATION);
          break;
      }
    };

    // Validaciones específicas
    if (field === 'password') {
      if (!passwordState.currentPassword) {
        alert(ERROR_MESSAGES.PASSWORD_REQUIRED);
        return;
      }
      if (passwordState.value.length < 6) {
        alert(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
        return;
      }
      if (passwordState.value !== passwordState.confirmPassword) {
        alert(ERROR_MESSAGES.PASSWORD_MISMATCH);
        return;
      }
    }

    setUpdating(true);
    try {
      // CORRECCIÓN: Usar la contraseña actual del estado o una por defecto
      const currentPassword = passwordState.currentPassword || userData.password || '';
      
      const updateData = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        password: currentPassword, // Usar contraseña actual por defecto
      };

      // Actualizar solo el campo específico
      switch (field) {
        case 'email':
          updateData.email = emailState.value;
          break;
        case 'telefono':
          updateData.telefono = telefonoState.value || '';
          break;
        case 'password':
          // Para contraseña, usar la nueva contraseña
          updateData.password = passwordState.value;
          break;
      }

      console.log('Enviando datos:', updateData); // Para debug

      await apiService.actualizarDueno(userData.rut, updateData);

      // Actualizar userData local
      setUserData({ ...userData, ...updateData });
      showSuccess();
    } catch (err: any) {
      console.error(`Error updating ${field}:`, err);
      alert(err?.response?.data?.error || ERROR_MESSAGES.UPDATE_ERROR);
    } finally {
      setUpdating(false);
    }
  }, [userData, setUserData, emailState, telefonoState, passwordState, setEmailState, setTelefonoState, setPasswordState]);
  
  // Cargar mascotas del usuario logueado
  useEffect(() => {
    const fetchMascotas = async () => {
      if (!userData?.rut) return;
      setLoadingMascotas(true);
      try {
        const response = await mascotasService.obtenerMascotasPorDueno(userData.rut);
        setMascotas(response.data);
      } catch (err) {
        setMascotas([]);
      } finally {
        setLoadingMascotas(false);
      }
    };
    fetchMascotas();
  }, [userData?.rut]);

  // Memoizar datos computados
  const userName = useMemo(() => 
    userData ? `${userData.nombre} ${userData.apellido}` : 'Usuario',
    [userData?.nombre, userData?.apellido]
  );

  const hasPets = useMemo(() => 
    userData?.pets && userData.pets.length > 0, 
    [userData?.pets]
  );

  // Estados de carga y error
  if (loading) return <LoadingSpinner />;
  if (error && !userData) return <ErrorDisplay error={error} />;
  if (!userData) return <ErrorDisplay error="No se encontraron datos del usuario" />;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <ProfileHeader userName={userName} />

        <div className={styles.profileCard}>
          <div className={styles.userInfo}>
            <ReadOnlyField
              icon={FaIdCard}
              label="RUT"
              value={userData.rut}
            />

            <ReadOnlyField
              icon={FaUser}
              label="Nombre"
              value={userData.nombre}
            />

            <ReadOnlyField
              icon={FaUser}
              label="Apellido"
              value={userData.apellido}
            />

            <EditableField
              icon={FaEnvelope}
              label="Email"
              value={userData.email}
              fieldState={emailState}
              fieldType="email"
              inputType="email"
              onEdit={startEditing}
              onCancel={cancelEditing}
              onSave={handleSaveField}
              onChange={updateFieldValue}
            />

            <EditableField
              icon={FaPhone}
              label="Teléfono"
              value={userData.telefono || ''}
              fieldState={telefonoState}
              fieldType="telefono"
              inputType="tel"
              onEdit={startEditing}
              onCancel={cancelEditing}
              onSave={handleSaveField}
              onChange={updateFieldValue}
            />

            <PasswordField
              passwordState={passwordState}
              onEdit={startEditing}
              onCancel={cancelEditing}
              onSave={handleSaveField}
              onChange={updateFieldValue}
              onToggleVisibility={togglePasswordVisibility}
            />
          </div>
        </div>

        {/* Sección de mascotas con botón siempre visible */}
        {loadingMascotas ? (
          <div style={{ textAlign: 'center', margin: '2rem' }}>Cargando mascotas...</div>
        ) : mascotas.length > 0 ? (
          <PetsSection pets={mascotas.map(m => ({
  id: m.id_mascota,
  nombre: m.nombre_mascota,
  url_imagen_mascota: m.url_imagen_mascota,
}))} />
        ) : (
          <div className={styles.petsSection}>
            <div className={styles.petsSectionHeader}>
              <h2>🐾 Mis Mascotas</h2>
            </div>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
              No tienes mascotas registradas aún
            </p>
            <div style={{ textAlign: 'center' }}>
              <Link to="/mascotas" className={styles.viewAllPetsButton}>
                <FaPaw /> Ver y gestionar mascotas
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Función auxiliar para calcular la edad desde la fecha de nacimiento
function calcularEdad(fechaNac: string) {
  const nacimiento = new Date(fechaNac);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export default UserProfile;