// WEB/src/utils/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  rut?: string;
  // Propiedades para dueños
}

interface Veterinario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  especialidad_id?: number;
  numero_licencia?: string;
  fecha_registro?: string;
  activo?: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  veterinario: Veterinario | null;
  userType: 'dueno' | 'veterinario' | null;
  isLoading: boolean;
  login: (userData: User) => void;
  loginVeterinario: (veterinarioData: Veterinario) => void;
  logout: () => void;
  getCurrentUserRut: () => string | null;
  getCurrentVeterinarioId: () => number | null;
  isVeterinario: () => boolean;
  isDueno: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [userType, setUserType] = useState<'dueno' | 'veterinario' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    const checkStoredSession = () => {
      try {
        // Verificar sesión de veterinario primero
        const savedVeterinario = localStorage.getItem('happypet_veterinario');
        
        if (savedVeterinario && savedVeterinario !== 'undefined' && savedVeterinario !== 'null') {
          const veterinarioData = JSON.parse(savedVeterinario);
          
          // Validar que tenga las propiedades necesarias
          if (veterinarioData && veterinarioData.id && veterinarioData.nombre && veterinarioData.email) {
            setVeterinario(veterinarioData);
            setUser(null);
            setUserType('veterinario');
            setIsLoggedIn(true);
            setIsLoading(false);
            return;
          } else {
            localStorage.removeItem('happypet_veterinario');
          }
        }

        // Verificar sesión de dueño
        const savedUser = localStorage.getItem('happypet_user');
        
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          const userData = JSON.parse(savedUser);
          
          // Validar que tenga las propiedades necesarias
          if (userData && userData.rut) {
            setUser(userData);
            setVeterinario(null);
            setUserType('dueno');
            setIsLoggedIn(true);
            setIsLoading(false);
            return;
          } else {
            localStorage.removeItem('happypet_user');
          }
        }
        
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error al verificar sesión guardada:', error);
        localStorage.removeItem('happypet_user');
        localStorage.removeItem('happypet_veterinario');
        setIsLoading(false);
      }
    };

    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(checkStoredSession, 100);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setVeterinario(null);
    setUserType('dueno');
    setIsLoggedIn(true);
    // Guardar en localStorage
    localStorage.setItem('happypet_user', JSON.stringify(userData));
    localStorage.removeItem('happypet_veterinario');
  };

  const loginVeterinario = (veterinarioData: Veterinario) => {
    setVeterinario(veterinarioData);
    setUser(null);
    setUserType('veterinario');
    setIsLoggedIn(true);
    
    // Guardar en localStorage
    localStorage.setItem('happypet_veterinario', JSON.stringify(veterinarioData));
    localStorage.removeItem('happypet_user');
    localStorage.removeItem('currentUser');
  };

  const logout = () => {
    setUser(null);
    setVeterinario(null);
    setUserType(null);
    setIsLoggedIn(false);
    // Limpiar localStorage
    localStorage.removeItem('happypet_user');
    localStorage.removeItem('happypet_veterinario');
    localStorage.removeItem('currentUser');
  };

  const getCurrentUserRut = (): string | null => {
    return user?.rut || null;
  };

  const getCurrentVeterinarioId = (): number | null => {
    return veterinario?.id || null;
  };

  const isVeterinario = (): boolean => {
    return userType === 'veterinario';
  };

  const isDueno = (): boolean => {
    return userType === 'dueno';
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    veterinario,
    userType,
    isLoading,
    login,
    loginVeterinario,
    logout,
    getCurrentUserRut,
    getCurrentVeterinarioId,
    isVeterinario,
    isDueno
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};