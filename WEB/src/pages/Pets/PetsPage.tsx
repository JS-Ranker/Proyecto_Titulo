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
          <h2>🐾 Mis Mascotas</h2>
          <Link
            to="/add-pet"
            className={`${styles.animatedButton} ${styles.addPetButton}`}
          >
            <span className={styles.icon}>＋</span>
            Agregar Mascota
          </Link>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", margin: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div className={styles.loadingSpinner}></div>
            <span style={{ color: "#4b3f72" }}>Cargando mascotas...</span>
          </div>
        ) : mascotas.length > 0 ? (
          <div className={styles.petsGrid}>
            {mascotas.map((pet) => (
              <div key={pet.id_mascota} className={styles.petCard}>
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
                <h3>{pet.nombre_mascota}</h3>
                <p><strong>Tipo:</strong> {ESPECIES_MAP[pet.id_especie] || "No registrado"}</p>
                <p><strong>Raza:</strong> {pet.nombre_raza || "No registrada"}</p>
                <p><strong>Fecha de nacimiento:</strong> {pet.fecha_nac_mascota ? new Date(pet.fecha_nac_mascota).toLocaleDateString() : "No registrada"}</p>
                <p><strong>Peso:</strong> {pet.peso_kg ? `${pet.peso_kg} kg` : "No registrado"}</p>
                <p><strong>Género:</strong> {pet.sexo_mascota === "macho" ? "Macho" : pet.sexo_mascota === "hembra" ? "Hembra" : "No registrado"}</p>
                <p><strong>Esterilizado:</strong> {pet.esta_esterilizado ? "Sí" : "No"}</p>
                <p><strong>Color:</strong> {pet.color_mascota || "No registrado"}</p>
                <p><strong>Microchip:</strong> {pet.codigo_microchip || "No registrado"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${styles.noMascotasMessage}`} style={{ textAlign: "center", margin: "2rem" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>No tienes mascotas registradas aún.</p>
            <div>
              <Link to="/add-pet" className={`${styles.viewAllPetsButton} ${styles.animatedButton}`}>
                + Agregar Mascota
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;