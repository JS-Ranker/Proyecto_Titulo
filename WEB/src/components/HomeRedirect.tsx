import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import Home from '../pages/Home/Home';

const HomeRedirect = () => {
  const { isLoggedIn, isVeterinario, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Esperar a que termine de cargar la sesión
    if (isLoading) return;

    // Si está logueado como veterinario, redirigir al dashboard
    if (isLoggedIn && isVeterinario()) {
      navigate('/veterinario/dashboard', { replace: true });
    }
  }, [isLoggedIn, isVeterinario, isLoading, navigate]);

  // Si está cargando, mostrar una pantalla de carga
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Verificando sesión...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si es veterinario logueado, no mostrar la página Home (se redirige arriba)
  if (isLoggedIn && isVeterinario()) {
    return null;
  }

  // Mostrar la página Home normal para usuarios no veterinarios
  return <Home />;
};

export default HomeRedirect;
