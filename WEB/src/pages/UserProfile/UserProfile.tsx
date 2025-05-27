// WEB/src/pages/UserProfile/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiService } from '../../services/duenos';
import styles from './UserProfile.module.css';

interface UserData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  password: string;
  pets?: Pet[];
}

interface Pet {
  id: number;
  name: string;
  type: string;
  age: number;
}

const UserProfile: React.FC = () => {
  const { getCurrentUserRut, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<UserData | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userRut = getCurrentUserRut();
    if (!userRut) {
      setError('No se encontró información del usuario');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.obtenerDuenoPorRut(userRut);
      setUserData(response.data);
      setEditForm(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccess(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(userData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!editForm || !userData) return;

    setUpdating(true);
    try {
      await apiService.actualizarDueno(userData.rut, {
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        email: editForm.email,
        telefono: editForm.telefono,
        password: editForm.password
      });

      setUserData(editForm);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar los datos');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
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
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <Link to="/" className={styles.backLink}>
            <FaArrowLeft /> Volver al inicio
          </Link>
          <h1>Mi Perfil</h1>
          {!isEditing && (
            <button onClick={handleEdit} className={styles.editButton}>
              <FaEdit /> Editar
            </button>
          )}
        </div>

        {updateSuccess && (
          <div className={styles.successMessage}>
            ¡Perfil actualizado exitosamente!
          </div>
        )}

        <div className={styles.profileCard}>
          <div className={styles.userInfo}>
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <FaIdCard className={styles.fieldIcon} />
                <label>RUT</label>
              </div>
              <div className={styles.fieldValue}>
                {userData?.rut}
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <FaUser className={styles.fieldIcon} />
                <label>Nombre</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="nombre"
                  value={editForm?.nombre || ''}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.fieldValue}>
                  {userData?.nombre}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <FaUser className={styles.fieldIcon} />
                <label>Apellido</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="apellido"
                  value={editForm?.apellido || ''}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.fieldValue}>
                  {userData?.apellido}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <FaEnvelope className={styles.fieldIcon} />
                <label>Email</label>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editForm?.email || ''}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.fieldValue}>
                  {userData?.email}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <FaPhone className={styles.fieldIcon} />
                <label>Teléfono</label>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  name="telefono"
                  value={editForm?.telefono || ''}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.fieldValue}>
                  {userData?.telefono || 'No especificado'}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <FaLock className={styles.fieldIcon} />
                <label>Contraseña</label>
              </div>
              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={editForm?.password || ''}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.fieldValue}>
                  ••••••••
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className={styles.editActions}>
              <button 
                onClick={handleSave} 
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
                    <FaSave /> Guardar
                  </>
                )}
              </button>
              <button 
                onClick={handleCancelEdit} 
                className={styles.cancelButton}
                disabled={updating}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          )}
        </div>

        {userData?.pets && userData.pets.length > 0 && (
          <div className={styles.petsSection}>
            <h2>Mis Mascotas</h2>
            <div className={styles.petsGrid}>
              {userData.pets.map((pet) => (
                <div key={pet.id} className={styles.petCard}>
                  <h3>{pet.name}</h3>
                  <p><strong>Tipo:</strong> {pet.type}</p>
                  <p><strong>Edad:</strong> {pet.age} años</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;