import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- importa useNavigate
import { mascotasService } from "../../services/mascotas";
import styles from "../UserProfile/UserProfile.module.css";

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "#A9E5BB",
              color: "#4b3f72",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 600,
              cursor: "pointer",
              marginRight: 12,
            }}
          >
            ← Volver
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ margin: 0, color: "#4b3f72" }}>🐾 Mis Mascotas</h2>
          </div>
          <Link to="/add-pet" className={styles.viewAllPetsButton} style={{ fontWeight: 600, background: "#A9E5BB", color: "#4b3f72", borderRadius: 8, padding: "8px 18px", textDecoration: "none" }}>
            + Agregar Mascota
          </Link>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", margin: "2rem" }}>Cargando mascotas...</div>
        ) : mascotas.length > 0 ? (
          <div className={styles.petsGrid}>
            {mascotas.map((pet) => (
              <div key={pet.id_mascota} className={styles.petCard}>
                {pet.url_imagen_mascota && (
                  <img
                    src={`http://localhost:3000/${pet.url_imagen_mascota}`}
                    alt={pet.nombre_mascota}
                    className={styles.petImage}
                  />
                )}
                <h3>{pet.nombre_mascota}</h3>
                <p><strong>Tipo:</strong> {pet.id_especie || "No registrado"}</p>
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
          <div style={{ textAlign: "center", margin: "2rem" }}>
            No tienes mascotas registradas aún.
            <div>
              <Link to="/add-pet" className={styles.viewAllPetsButton}>
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