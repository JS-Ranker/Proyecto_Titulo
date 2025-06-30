import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import UserProfile from './pages/UserProfile/UserProfile';
import AddPet from "./pages/AddPet/AddPet";
import Shop from "./pages/Shop/Shop";
import EspecialidadesPage from "./pages/EspecialidadesPage/EspecialidadesPage";
import Cardiologia from "./pages/EspecialidadesPage/Cardiologia/Cardiologia";
import Endocrinologia from "./pages/EspecialidadesPage/Endocrinologia/Endocrinologia";
import Gastroenterologia from "./pages/EspecialidadesPage/Gastroenterologia/Gastroenterologia";
import Oncologia from "./pages/EspecialidadesPage/Oncologia/Oncologia";
import PetsPage from "./pages/Pets/PetsPage";
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

// Componente interno que usa el contexto
const AppContent = () => {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/especialidadespage" element={<EspecialidadesPage />} />
        <Route path="/cardiologia" element={<Cardiologia />} />
        <Route path="/endocrinologia" element={<Endocrinologia />} />
        <Route path="/gastroenterologia" element={<Gastroenterologia />} />
        <Route path="/oncologia" element={<Oncologia />} />
        <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
        <Route path="/mascotas" element={<PetsPage />} />
        <Route path="/agendamientoCitas" element={<AgendamientoCitas />} />
        <Route path ="/citas" element={<Citas />} />
        <Route path="/videoConsulta" element={<VideoConsulta />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/adoptame" element={<Adoptame />} />
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