import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPaw, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../../utils/AuthContext";
import styles from "./header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    closeMenu();
    navigate("/");
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <nav className={styles.container}>
          <div className={styles.navWrapper}>
            <NavLink to="/" className={styles.brand} onClick={closeMenu}>
              <FaPaw className={styles.logo} /> Happy Pet
            </NavLink>

            <button
              className={styles.hamburger}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className={styles.hamburgerIcon}></span>
            </button>

            <div className={`${styles.navMenu} ${isMenuOpen ? styles.showMenu : ""}`}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                    }
                    onClick={closeMenu}
                  >
                    Inicio
                  </NavLink>
                </li>

                {!isLoggedIn ? (
                  <>
                    <li className={styles.navItem}>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                        }
                        onClick={closeMenu}
                      >
                        Login
                      </NavLink>
                    </li>
                    <li className={styles.navItem}>
                      <NavLink
                        to="/register"
                        className={({ isActive }) =>
                          isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                        }
                        onClick={closeMenu}
                      >
                        Registro
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className={styles.navItem}>
                    <NavLink
                      to="/UserProfile"
                      className={({ isActive }) =>
                        isActive? `${styles.navLink} ${styles.activeNavLink}`: styles.navLink} 
                    onClick={closeMenu}>
                    <FaUserCircle className= {styles.navItem} /> Perfil
                    </NavLink>

                    </li>
                    <li className={styles.navItem}>
<button
  onClick={() => setShowLogoutConfirm(true)}
  className={`${styles.navLink} ${styles.logoutButton}`}
>
  Cerrar sesión
</button>

                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Modal de confirmación */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>¿Estás seguro de que quieres cerrar sesión?</p>
            <div className={styles.modalButtons}>
              <button onClick={confirmLogout} className={styles.confirmButton}>Sí</button>
              <button onClick={() => setShowLogoutConfirm(false)} className={styles.cancelButton}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
