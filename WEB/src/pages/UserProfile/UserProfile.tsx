import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiService } from '../../services/duenos';
import styles from './UserProfile.module.css';

// Tipos más específicos y mejor organizados
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

// Coincidir exactamente con UpdateDuenoData del backend
interface EditableUserData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  password: string;
}

// Constantes
const SUCCESS_MESSAGE_DURATION = 3000;
const ERROR_MESSAGES = {
  NO_USER: 'No se encontró información del usuario',
  LOAD_ERROR: 'Error al cargar los datos del usuario',
  UPDATE_ERROR: 'Error al actualizar los datos',
} as const;

// Custom hooks para separar lógica
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
      setError(err.response?.data?.error || ERROR_MESSAGES.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserRut]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return { userData, setUserData, loading, error, loadUserData };
};

const useEditMode = (userData: UserData | null) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditableUserData | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Inicializar formulario cuando userData cambie
  useEffect(() => {
    if (userData) {
      const { rut, pets, ...editableData } = userData;
      setEditForm(editableData);
    }
  }, [userData]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setUpdateSuccess(false);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    if (userData) {
      const { rut, pets, ...editableData } = userData;
      setEditForm(editableData);
    }
  }, [userData]);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => prev ? { ...prev, [name]: value } : null);
  }, []);

  return {
    isEditing,
    editForm,
    updating,
    updateSuccess,
    setUpdating,
    setUpdateSuccess,
    startEditing,
    cancelEditing,
    stopEditing,
    handleInputChange,
  };
};

// Componentes separados para mejor organización
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

const SuccessMessage: React.FC = () => (
  <div className={styles.successMessage}>
    ¡Perfil actualizado exitosamente!
  </div>
);

const ProfileHeader: React.FC<{ 
  isEditing: boolean; 
  onEdit: () => void; 
  userName: string;
}> = ({ isEditing, onEdit, userName }) => (
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
    {!isEditing && (
      <button onClick={onEdit} className={styles.editButton}>
        <FaEdit /> Editar
      </button>
    )}
  </div>
);

interface ProfileFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  isEditing: boolean;
  name?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editValue?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon: Icon,
  label,
  value,
  isEditing,
  name,
  type = 'text',
  onChange,
  editValue,
}) => (
  <div className={styles.field}>
    <div className={styles.fieldHeader}>
      <Icon className={styles.fieldIcon} />
      <label>{label}</label>
    </div>
    {isEditing && name && onChange ? (
      <input
        type={type}
        name={name}
        value={editValue || ''}
        onChange={onChange}
        className={styles.editInput}
        placeholder={`Ingresa tu ${label.toLowerCase()}`}
      />
    ) : (
      <div className={styles.fieldValue}>
        {value}
      </div>
    )}
  </div>
);

const EditActions: React.FC<{
  onSave: () => void;
  onCancel: () => void;
  updating: boolean;
}> = ({ onSave, onCancel, updating }) => (
  <div className={styles.editActions}>
    <button 
      onClick={onSave} 
      className={styles.saveButton}
      disabled={updating}
    >
      {updating ? (
        <>
          <div className={styles.buttonSpinner}></div>
          Guardando...
        </>
      ) : (
        <>
          <FaSave /> Guardar Cambios
        </>
      )}
    </button>
    <button 
      onClick={onCancel} 
      className={styles.cancelButton}
      disabled={updating}
    >
      <FaTimes /> Cancelar
    </button>
  </div>
);

const PetsSection: React.FC<{ pets: Pet[] }> = ({ pets }) => (
  <div className={styles.petsSection}>
    <h2>🐾 Mis Mascotas</h2>
    <div className={styles.petsGrid}>
      {pets.map((pet) => (
        <div key={pet.id} className={styles.petCard}>
          <h3>🐕 {pet.name}</h3>
          <p><strong>Tipo:</strong> {pet.type}</p>
          <p><strong>Edad:</strong> {pet.age} años</p>
        </div>
      ))}
    </div>
  </div>
);

// Componente principal
const UserProfile: React.FC = () => {
  const { userData, setUserData, loading, error } = useUserData();
  const {
    isEditing,
    editForm,
    updating,
    updateSuccess,
    setUpdating,
    setUpdateSuccess,
    startEditing,
    cancelEditing,
    stopEditing,
    handleInputChange,
  } = useEditMode(userData);

  const handleSave = useCallback(async () => {
    if (!editForm || !userData) return;

    setUpdating(true);
    try {
      await apiService.actualizarDueno(userData.rut, editForm);

      // Actualizar userData manteniendo pets
      setUserData({ ...userData, ...editForm });
      stopEditing();
      setUpdateSuccess(true);
      
      // Ocultar mensaje de éxito después de tiempo especificado
      setTimeout(() => {
        setUpdateSuccess(false);
      }, SUCCESS_MESSAGE_DURATION);
    } catch (err: any) {
      console.error('Error updating user data:', err);
      // En lugar de setError, podrías mostrar un toast o notificación
      alert(err.response?.data?.error || ERROR_MESSAGES.UPDATE_ERROR);
    } finally {
      setUpdating(false);
    }
  }, [editForm, userData, setUserData, stopEditing, setUpdating, setUpdateSuccess]);

  // Memoizar datos computados
  const displayPhone = useMemo(() => 
    userData?.telefono || 'No especificado', 
    [userData?.telefono]
  );

  const hasPets = useMemo(() => 
    userData?.pets && userData.pets.length > 0, 
    [userData?.pets]
  );

  const userName = useMemo(() => 
    userData ? `${userData.nombre} ${userData.apellido}` : 'Usuario',
    [userData?.nombre, userData?.apellido]
  );

  // Estados de carga y error
  if (loading) return <LoadingSpinner />;
  if (error && !userData) return <ErrorDisplay error={error} />;
  if (!userData) return <ErrorDisplay error="No se encontraron datos del usuario" />;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <ProfileHeader 
          isEditing={isEditing} 
          onEdit={startEditing} 
          userName={userName}
        />

        {updateSuccess && <SuccessMessage />}

        <div className={styles.profileCard}>
          <div className={styles.userInfo}>
            <ProfileField
              icon={FaIdCard}
              label="RUT"
              value={userData.rut}
              isEditing={false}
            />

            <ProfileField
              icon={FaUser}
              label="Nombre"
              value={userData.nombre}
              isEditing={isEditing}
              name="nombre"
              onChange={handleInputChange}
              editValue={editForm?.nombre}
            />

            <ProfileField
              icon={FaUser}
              label="Apellido"
              value={userData.apellido}
              isEditing={isEditing}
              name="apellido"
              onChange={handleInputChange}
              editValue={editForm?.apellido}
            />

            <ProfileField
              icon={FaEnvelope}
              label="Email"
              value={userData.email}
              isEditing={isEditing}
              name="email"
              type="email"
              onChange={handleInputChange}
              editValue={editForm?.email}
            />

            <ProfileField
              icon={FaPhone}
              label="Teléfono"
              value={displayPhone}
              isEditing={isEditing}
              name="telefono"
              type="tel"
              onChange={handleInputChange}
              editValue={editForm?.telefono || ''}
            />

            <ProfileField
              icon={FaLock}
              label="Contraseña"
              value="••••••••"
              isEditing={isEditing}
              name="password"
              type="password"
              onChange={handleInputChange}
              editValue={editForm?.password}
            />
          </div>

          {isEditing && (
            <EditActions
              onSave={handleSave}
              onCancel={cancelEditing}
              updating={updating}
            />
          )}
        </div>

        {hasPets && <PetsSection pets={userData.pets!} />}
      </div>
    </div>
  );
};

export default UserProfile;