import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaLock, FaUserMd, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";
import styles from "./LoginVeterinario.module.css";
import { veterinarioService } from "../../services/veterinarios";

interface ApiError {
  response?: {
    data?: {
      error?: string;
    }
  }
}

const LoginVeterinario = () => {
  const navigate = useNavigate();
  const { loginVeterinario } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loadingSuccess, setLoadingSuccess] = useState<boolean>(false);

  // Efecto para el countdown después del login exitoso
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/veterinario/dashboard');
    }
  }, [success, countdown, navigate]);

  // Crear confeti después del login exitoso
  useEffect(() => {
    if (success) {
      createConfetti();
    }
  }, [success]);

  const createConfetti = (): void => {
    const confettiContainer = document.querySelector(`.${styles.confettiContainer}`);
    if (!confettiContainer) return;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = styles.confetti;
      
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 1 + Math.random() * 2;
      
      confetti.style.left = `${left}%`;
      confetti.style.backgroundColor = color;
      confetti.style.animation = `${styles.confettiDrop} ${duration}s ${delay}s ease-out forwards`;
      
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => {
        if (confettiContainer.contains(confetti)) {
          confettiContainer.removeChild(confetti);
        }
      }, (delay + duration) * 1000);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);
    
    try {
      const response = await veterinarioService.loginVeterinario({ email, password });
      
      setLoadingSuccess(true);
      
      setTimeout(() => {
        // The response structure is: { data: { message: 'Login exitoso', data: veterinarioData } }
        loginVeterinario(response.data.data);
        setLoadingSuccess(false);
        setSuccess(true);
        setIsSubmitting(false);
      }, 2000);
      
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || "Error al iniciar sesión");
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.confettiContainer}></div>
      
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <Link to="/login" className={styles.backButton}>
            <FaArrowLeft />
          </Link>
          <div className={styles.logoSection}>
            <FaUserMd className={styles.logo} />
            <h1 className={styles.title}>Acceso Veterinario</h1>
            <p className={styles.subtitle}>Ingresa a tu panel profesional</p>
          </div>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {loadingSuccess && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Verificando credenciales...</p>
          </div>
        )}

        {success ? (
          <div className={styles.successContainer}>
            <FaCheckCircle className={styles.successIcon} />
            <h2>¡Bienvenido!</h2>
            <p>Login exitoso. Redirigiendo al panel...</p>
            <div className={styles.countdown}>
              <span>{countdown}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Email profesional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.togglePassword}
                  disabled={isSubmitting}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FaUserMd />
                  Ingresar como Veterinario
                </>
              )}
            </button>

            <div className={styles.links}>
              <Link to="/login" className={styles.link}>
                ¿Eres dueño de mascota? Inicia sesión aquí
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginVeterinario;
