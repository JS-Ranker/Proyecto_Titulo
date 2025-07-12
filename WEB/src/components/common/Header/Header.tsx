import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaPaw, FaUserCircle, FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTimes, FaCalendarAlt, FaHistory } from "react-icons/fa";
import { useAuth } from "../../../utils/AuthContext";
import { productosService } from '../../../services/productos';
import SearchBar from '../SearchBar/SearchBar';
import styles from "./header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);
  const { isLoggedIn, logout, isVeterinario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    productosService.obtenerTodos().then(setProductos);
  }, []);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    closeMenu();
    navigate("/");
  };

  const handleMenuItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.container}>
        <div className={styles.navWrapper}>
          <NavLink to="/" className={styles.brand} onClick={closeMenu}>
            <FaPaw className={styles.logo} /> Happy Pet
          </NavLink>

          {/* SearchBar centrado - Solo mostrar si no es veterinario */}
          {!isVeterinario() && (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <SearchBar productos={productos} />
            </div>
          )}
          
          {/* Espaciador cuando es veterinario */}
          {isVeterinario() && <div style={{ flex: 1 }}></div>}

          {/* Botón hamburguesa mejorado */}
          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}
            aria-label="Abrir menú"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={styles.hamburgerIcon}></span>
          </button>

          {/* Botón para toggle del sidebar en desktop */}
          <button
            className={styles.sidebarToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar menú lateral"
          >
            <FaPaw className={styles.toggleIcon} />
          </button>

          {/* Overlay para cerrar el menú solo en móvil */}
          {mobileMenuOpen && window.innerWidth < 992 && (
            <div
              className={styles.menuOverlay}
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Menú lateral (sidebar) */}
          <div className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
            {/* Header del sidebar */}
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarBrand}>
                <FaPaw className={styles.sidebarLogo} />
                <span>Happy Pet</span>
              </div>
              <button
                className={styles.closeSidebar}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <FaTimes />
              </button>
            </div>

            {/* Contenido del sidebar */}
            <div className={styles.sidebarContent}>
              <nav className={styles.sidebarNav}>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                  }
                  onClick={handleMenuItemClick}
                >
                  <FaHome className={styles.sidebarIcon} />
                  <span>Inicio</span>
                </NavLink>

                {!isLoggedIn ? (
                  <>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaSignInAlt className={styles.sidebarIcon} />
                      <span>Iniciar Sesión</span>
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaUserPlus className={styles.sidebarIcon} />
                      <span>Registro</span>
                    </NavLink>
                  </>
                ) : isVeterinario() ? (
                  // Menú específico para veterinarios
                  <>
                    <NavLink
                      to="/veterinario/citas"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaCalendarAlt className={styles.sidebarIcon} />
                      <span>Citas</span>
                    </NavLink>

                    <NavLink
                      to="/veterinario/historial"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaHistory className={styles.sidebarIcon} />
                      <span>Historial Médico</span>
                    </NavLink>

                    <NavLink
                      to="/veterinario/perfil"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaUserCircle className={styles.sidebarIcon} />
                      <span>Mi Perfil</span>
                    </NavLink>
                    
                    <div className={styles.sidebarDivider}></div>
                    
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setMobileMenuOpen(false);
                      }}
                      className={`${styles.sidebarMenuItem} ${styles.logoutMenuItem}`}
                    >
                      <FaSignOutAlt className={styles.sidebarIcon} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                ) : ( 
                  // Menú específico para dueños
                  <>
                    {/* Botón "Mis Mascotas" */}
                    <NavLink
                      to="/mascotas"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaPaw className={styles.sidebarIcon} />
                      <span>Mis Mascotas</span>
                    </NavLink>

                    {/* Botón "Agendamiento de Citas" */}
                    <NavLink
                      to="/agendamientoCitas"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaCalendarAlt className={styles.sidebarIcon} />
                      <span>Agendamiento de Citas</span>
                    </NavLink>

                    {/* Nuevo botón "Mis Citas" */}
                    <NavLink
                      to="/citas"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaCalendarAlt className={styles.sidebarIcon} />
                      <span>Mis Citas</span>
                    </NavLink>

                    <NavLink
                      to="/UserProfile"
                      className={({ isActive }) =>
                        isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                      }
                      onClick={handleMenuItemClick}
                    >
                      <FaUserCircle className={styles.sidebarIcon} />
                      <span>Mi Perfil</span>
                    </NavLink>
                    
                    <div className={styles.sidebarDivider}></div>
                    
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setMobileMenuOpen(false);
                      }}
                      className={`${styles.sidebarMenuItem} ${styles.logoutMenuItem}`}
                    >
                      <FaSignOutAlt className={styles.sidebarIcon} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de confirmación */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <FaSignOutAlt />
            </div>
            <h3>Confirmar Cierre de Sesión</h3>
            <p>¿Estás seguro de que quieres cerrar sesión?</p>
            <div className={styles.modalButtons}>
              <button onClick={confirmLogout} className={styles.confirmButton}>
                Sí, cerrar sesión
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;