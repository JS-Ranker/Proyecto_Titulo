import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import HomeRedirect from "./components/HomeRedirect";
import Login from "./pages/Login/Login";
import LoginVeterinario from "./pages/Login/LoginVeterinario";
import Register from "./pages/Register/Register";
import UserProfile from './pages/UserProfile/UserProfile';
import AddPet from "./pages/AddPet/AddPet";
import Shop from "./pages/Shop/Shop";
import EspecialidadesPage from "./pages/EspecialidadesPage/EspecialidadesPage";
import Cardiologia from "./pages/EspecialidadesPage/Cardiologia/Cardiologia";
import Endocrinologia from "./pages/EspecialidadesPage/Endocrinologia/Endocrinologia";
import Gastroenterologia from "./pages/EspecialidadesPage/Gastroenterologia/Gastroenterologia";
import Oncologia from "./pages/EspecialidadesPage/Oncologia/Oncologia";
import Dermatologia from "./pages/EspecialidadesPage/Dermatologia/Dermatologia";
import Oftalmologia from "./pages/EspecialidadesPage/Oftalmologia/Oftalmologia";
import MedicinaGeneral from "./pages/EspecialidadesPage/MedicinaGeneral/MedicinaGeneral";
import PetsPage from "./pages/Pets/PetsPage";
import DashboardVeterinario from "./pages/Veterinario/DashboardVeterinario";
import CitasVeterinario from "./pages/Veterinario/CitasVeterinario";
import "./App.css";
import 'animate.css';
import { AuthProvider, useAuth } from "./utils/AuthContext";
import AgendamientoCitas from "./pages/AgendamientoCitas/AgendamientoCitas";
import VideoConsulta from "./pages/VideoConsulta/VideoConsulta";
import Citas from "./pages/citas/citas"
import Navbar from "./components/common/Navbar/Navbar";
import QuienesSomos from "./pages/quienesSomos/QuienesSomos";
import Adoptame from "./pages/adoptame/adoptame";

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Componente para proteger rutas de veterinarios
const ProtectedVeterinarioRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isVeterinario, isLoading } = useAuth();
  
  // Mostrar loading mientras se verifica la sesión
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
        <p>Verificando sesión de veterinario...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login/veterinario" replace />;
  }
  
  if (!isVeterinario()) {
    return <Navigate to="/login/veterinario" replace />;
  }
  
  return children;
};

// Componente interno que usa el contexto
const AppContent = () => {
  const { isVeterinario } = useAuth();
  
  return (
    <Router>
      <Header />
      {/* Solo mostrar Navbar si no es veterinario */}
      {!isVeterinario() && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/veterinario" element={<LoginVeterinario />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/veterinario/dashboard" element={
          <ProtectedVeterinarioRoute>
            <DashboardVeterinario />
          </ProtectedVeterinarioRoute>
        } />
        <Route path="/veterinario/citas" element={
          <ProtectedVeterinarioRoute>
            <CitasVeterinario />
          </ProtectedVeterinarioRoute>
        } />
        <Route path="/especialidadespage" element={<EspecialidadesPage />} />
        <Route path="/cardiologia" element={<Cardiologia />} />
        <Route path="/endocrinologia" element={<Endocrinologia />} />
        <Route path="/gastroenterologia" element={<Gastroenterologia />} />
        <Route path="/oncologia" element={<Oncologia />} />
        <Route path="/dermatologia" element={<Dermatologia />} />
        <Route path="/oftalmologia" element={<Oftalmologia />} />
        <Route path="/medicinaGeneral" element={<MedicinaGeneral />} />
        <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
        <Route path="/mascotas" element={<PetsPage />} />
        <Route path="/agendamientoCitas" element={<AgendamientoCitas />} />
        <Route path ="/citas" element={<Citas />} />
        <Route path="/videoConsulta" element={<VideoConsulta />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/adoptame" element={<Adoptame />} />
        <Route path="/cardiologia" element={<Cardiologia />} />
        <Route path="/endocrinologia" element={<Endocrinologia />} />
        <Route path="/gastroenterologia" element={<Gastroenterologia />} />
        <Route path="/oncologia" element={<Oncologia />} />
        <Route path="/dermatologia" element={<Dermatologia />} />
        <Route path="/oftalmologia" element={<Oftalmologia />} />
        <Route path="/medicina-general" element={<MedicinaGeneral />} />
      </Routes>
      <Footer />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;