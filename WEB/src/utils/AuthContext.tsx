import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { rut: string } | null;
  login: (userData: { rut: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ rut: string } | null>(null);

  // Verificar estado de autenticación al cargar la aplicación
  useEffect(() => {
    const storedRut = localStorage.getItem("rut");
    if (storedRut) {
      setIsLoggedIn(true);
      setUser({ rut: storedRut });
    }
  }, []);

  const login = (userData: { rut: string }) => {
    localStorage.setItem("rut", userData.rut);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("rut");
    localStorage.removeItem("token"); 
    localStorage.removeItem("currentUser"); 
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};