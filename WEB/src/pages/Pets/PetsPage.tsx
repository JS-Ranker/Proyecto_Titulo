import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- importa useNavigate
import { mascotasService } from "../../services/mascotas";
import styles from "./PetsPage.module.css";

const ESPECIES_MAP: Record<number, string> = {
  1: "Perro",
  2: "Gato",
  3: "Ave",
  4: "Conejo",
  5: "Reptil",
  6: "Pez",
  7: "Hámster",
  8: "Hurón",
};

const PetsPage: React.FC = () => {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- inicializa el hook

  // Suponiendo que tienes el usuario logueado en localStorage o contexto
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
 
  useEffect(() => {
    const fetchMascotas = async () => {
      if (!currentUser.rut) return;
      setLoading(true);
      try {
        const response = await mascotasService.obtenerMascotasPorDueno(currentUser.rut);
        setMascotas(response.data);
      } catch (err) {
        setMascotas([]);
      } finally {
        setLoading(false);
      }
    }; 
    fetchMascotas();
  }, [currentUser.rut]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.headerBar}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`${styles.animatedButton} ${styles.backButton}`}
          >
            <span className={styles.icon}>←</span>
            Volver
          </button>
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>🐾 Mis Mascotas</h1>
            <p className={styles.subtitle}>Gestiona la información de tus compañeros peludos</p>
          </div>
          <Link
            to="/add-pet"
            className={`${styles.animatedButton} ${styles.addPetButton}`}
          >
            <span className={styles.icon}>＋</span>
            Agregar Mascota
          </Link>
        </div>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <span className={styles.loadingText}>Cargando mascotas...</span>
          </div>
        ) : mascotas.length > 0 ? (
          <div className={styles.petsGrid}>
            {mascotas.map((pet, index) => (
              <div key={pet.id_mascota} className={styles.petCard} style={{animationDelay: `${index * 0.1}s`} as React.CSSProperties}>
                <div className={styles.petImageContainer}>
                  {pet.url_imagen_mascota ? (
                    <img
                      src={`http://localhost:3000/${pet.url_imagen_mascota}`}
                      alt={pet.nombre_mascota}
                      className={styles.petImage}
                    />
                  ) : (
                    <div className={styles.petImagePlaceholder}>
                      🐾
                    </div>
                  )}
                  <div className={styles.petStatus}>
                    {pet.esta_esterilizado ? "✅" : "⚠️"}
                  </div>
                </div>
                <div className={styles.petInfo}>
                  <h3 className={styles.petName}>{pet.nombre_mascota}</h3>
                  <div className={styles.petDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>🐕 Tipo:</span>
                      <span className={styles.detailValue}>{ESPECIES_MAP[pet.id_especie] || "No registrado"}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>🎯 Raza:</span>
                      <span className={styles.detailValue}>{pet.nombre_raza || "No registrada"}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>🎂 Nacimiento:</span>
                      <span className={styles.detailValue}>{pet.fecha_nac_mascota ? new Date(pet.fecha_nac_mascota).toLocaleDateString() : "No registrada"}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>⚖️ Peso:</span>
                      <span className={styles.detailValue}>{pet.peso_kg ? `${pet.peso_kg} kg` : "No registrado"}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>⚧ Género:</span>
                      <span className={styles.detailValue}>{pet.sexo_mascota === "macho" ? "♂️ Macho" : pet.sexo_mascota === "hembra" ? "♀️ Hembra" : "No registrado"}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>🏥 Esterilizado:</span>
                      <span className={`${styles.detailValue} ${pet.esta_esterilizado ? styles.statusYes : styles.statusNo}`}>
                        {pet.esta_esterilizado ? "✅ Sí" : "❌ No"}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>🎨 Color:</span>
                      <span className={styles.detailValue}>{pet.color_mascota || "No registrado"}</span>
                    </div>
                    {pet.codigo_microchip && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>🔬 Microchip:</span>
                        <span className={styles.detailValue}>{pet.codigo_microchip}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noMascotasMessage}>
            <div className={styles.emptyStateIcon}>🐾</div>
            <h3 className={styles.emptyStateTitle}>No tienes mascotas registradas</h3>
            <p className={styles.emptyStateDescription}>
              Comienza agregando información de tus compañeros peludos para llevar un registro completo de su salud y cuidado.
            </p>
            <Link to="/add-pet" className={`${styles.viewAllPetsButton} ${styles.animatedButton}`}>
              <span className={styles.icon}>＋</span>
              Agregar Primera Mascota
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;