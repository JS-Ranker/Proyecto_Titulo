import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';

const TestSession = () => {
  const { isLoggedIn, veterinario, userType, isLoading } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    const checkLocalStorage = () => {
      const data = {
        happypet_veterinario: localStorage.getItem('happypet_veterinario'),
        happypet_user: localStorage.getItem('happypet_user'),
        currentUser: localStorage.getItem('currentUser')
      };
      setLocalStorageData(data);
    };

    checkLocalStorage();
    
    // Actualizar cada segundo
    const interval = setInterval(checkLocalStorage, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  const testSave = () => {
    const testData = {
      id: 999,
      nombre: 'Test Veterinario',
      email: 'test@test.com',
      telefono: '123456789'
    };
    
    localStorage.setItem('happypet_veterinario', JSON.stringify(testData));
    console.log('Test data saved:', testData);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      backgroundColor: 'white', 
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '400px',
      fontSize: '14px',
      zIndex: 10000,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0, color: '#007bff' }}>🧪 Test de Sesión</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Estado AuthContext:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>isLoading: {isLoading ? '✅' : '❌'}</li>
          <li>isLoggedIn: {isLoggedIn ? '✅' : '❌'}</li>
          <li>userType: {userType || 'null'}</li>
          <li>veterinario: {veterinario ? veterinario.nombre : 'null'}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>localStorage:</strong>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          maxHeight: '150px',
          overflow: 'auto'
        }}>
          <pre>{JSON.stringify(localStorageData, null, 2)}</pre>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={clearAll}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Limpiar Todo
        </button>
        
        <button 
          onClick={testSave}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Save
        </button>

        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Recargar
        </button>
      </div>
    </div>
  );
};

export default TestSession;
