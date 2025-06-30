import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPaw, FaArrowLeft } from "react-icons/fa";
import { razasService } from "../../services/razas";
import { especiesService } from "../../services/especies";
import styles from "./AddPet.module.css";

interface PetData {
  nombre_mascota: string;
  id_especie: number | "";
  id_raza: number | "";
  fecha_nac_mascota: string;
  peso_kg: string;
  sexo_mascota: string;
  esta_esterilizado: string;
  color_mascota: string;
  codigo_microchip: string;
  
}

interface UserData {
  rut: string; 
  email: string;
  name: string;
  password: string;
  pets?: PetData[];
}

const AddPet = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState<PetData>({
    nombre_mascota: "",
    id_especie: "",
    id_raza: "",
    fecha_nac_mascota: "",
    peso_kg: "",
    sexo_mascota: "",
    esta_esterilizado: "",
    color_mascota: "",
    codigo_microchip: "",
  });
  const [especies, setEspecies] = useState<any[]>([]);
  const [especieId, setEspecieId] = useState<number | "">("");
  const [razas, setRazas] = useState<any[]>([]);
  const [imagen, setImagen] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    especiesService.getAll().then((res) => setEspecies(res.data));
  }, []);

  useEffect(() => {
    if (especieId) {
      razasService.getByEspecie(especieId).then((res) => setRazas(res.data));
    } else {
      setRazas([]);
    }
  }, [especieId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar datos de la mascota
    if (
      !petData.nombre_mascota ||
      !petData.id_especie ||
      !petData.id_raza ||
      !petData.fecha_nac_mascota
    ) {
      setMensaje({ tipo: "error", texto: "Por favor completa todos los campos" });
      return;
    }

    const currentUserString = localStorage.getItem("currentUser");
    const currentUser: UserData = currentUserString
      ? JSON.parse(currentUserString)
      : null;

    if (!currentUser?.rut) {
      setMensaje({ tipo: "error", texto: "Usuario no válido. Inicia sesión nuevamente." });
      return;
    }

    // Prepara los datos para enviar al backend
    const formData = new FormData();
    formData.append("nombre_mascota", petData.nombre_mascota);
    formData.append("id_especie", petData.id_especie.toString());
    formData.append("id_raza", petData.id_raza.toString());
    formData.append("fecha_nac_mascota", petData.fecha_nac_mascota);
    formData.append("peso_kg", petData.peso_kg);
    formData.append("sexo_mascota", petData.sexo_mascota);
    formData.append("esta_esterilizado", petData.esta_esterilizado);
    formData.append("color_mascota", petData.color_mascota);
    formData.append("codigo_microchip", petData.codigo_microchip);
    formData.append("id_dueno", currentUser.rut);

    if (imagen) {
      formData.append("imagen", imagen);
    }

    // Enviar al backend
    try {
      const response = await fetch("http://localhost:3000/api/mascotas", {
        method: "POST",
        body: formData, 
      });
      if (!response.ok) {
        const errorData = await response.json();
        setMensaje({ tipo: "error", texto: errorData.error || "Registro inválido" });
        return;
      }
      // setMensaje({ tipo: "exito", texto: "🎉 ¡Mascota registrada exitosamente!" });
      // Mostrar modal de éxito en lugar del mensaje normal
      setShowSuccessModal(true);
      
      // Redireccionar a la página de mascotas después de un breve delay
      setTimeout(() => {
        navigate("/mascotas");
      }, 3000);
      // Opcional: limpiar formulario
      setPetData({
        nombre_mascota: "",
        id_especie: "",
        id_raza: "",
        fecha_nac_mascota: "",
        peso_kg: "",
        sexo_mascota: "",
        esta_esterilizado: "",
        color_mascota: "",
        codigo_microchip: "",
      });
      setImagen(null);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "❌ Error al registrar la mascota. Intenta nuevamente." });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className={styles.title}>
          <FaPaw className={styles.pawIcon} /> 
          Registrar Nueva Mascota
        </h1>
        <div style={{ width: 48 }}></div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              🏷️ Nombre de la Mascota
            </label>
            <input
              type="text"
              className={styles.nameInput}
              name="nombre_mascota"
              value={petData.nombre_mascota}
              onChange={handleChange}
              placeholder="Ej: Max, Luna, Rocky..."
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              🐾 Tipo de Mascota
            </label>
            <select
              name="id_especie"
              value={especieId}
              onChange={e => {
                setEspecieId(Number(e.target.value));
                setPetData(prev => ({
                  ...prev,
                  id_especie: Number(e.target.value)
                }));
              }}
              className={styles.select}
              required
            >
              <option value="">Selecciona un tipo</option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              🎯 Raza
            </label>
            <select
              name="id_raza"
              value={petData.id_raza || ""}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Selecciona una raza</option>
              {razas.map((raza: any) => (
                <option key={raza.id} value={raza.id}>
                  {raza.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              🎂 Fecha de Nacimiento
            </label>
            <input
              type="date"
              className={styles.input}
              name="fecha_nac_mascota"
              value={petData.fecha_nac_mascota}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              ⚖️ Peso (kg)
            </label>
            <input
              type="number"
              className={styles.input}
              name="peso_kg"
              value={petData.peso_kg}
              onChange={handleChange}
              placeholder="Ej: 5.5"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              ⚧ Género
            </label>
            <select
              name="sexo_mascota"
              value={petData.sexo_mascota}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Selecciona género</option>
              <option value="macho">♂️ Macho</option>
              <option value="hembra">♀️ Hembra</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              🏥 ¿Esterilizado?
            </label>
            <select
              name="esta_esterilizado"
              value={petData.esta_esterilizado}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="1">✅ Sí</option>
              <option value="0">❌ No</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              🎨 Color
            </label>
            <input
              type="text"
              className={styles.input}
              name="color_mascota"
              value={petData.color_mascota}
              onChange={handleChange}
              placeholder="Ej: Café, Negro, Blanco..."
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              🔬 Código Microchip (Opcional)
            </label>
            <input
              type="text"
              className={styles.input}
              name="codigo_microchip"
              value={petData.codigo_microchip}
              onChange={handleChange}
              placeholder="Ej: 123456789012345"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              📸 Foto de la Mascota
            </label>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={e => setImagen(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <hr className={styles.divider} />

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.primaryButton}
            >
              🐾 REGISTRAR MASCOTA
            </button>

            <Link
              to="/mascotas"
              className={styles.secondaryButton}
            >
              📋 VER MIS MASCOTAS
            </Link>
          </div>
        </form>

        {mensaje && (
          <div
            className={`${styles.alert} ${mensaje.tipo === "exito" ? styles.alertSuccess : styles.alertError}`}
            role="alert"
          >
            {mensaje.texto}
          </div>
        )}

        {/* Modal de éxito personalizado */}
        {showSuccessModal && (
          <div className={styles.successModal}>
            <div className={styles.successModalContent}>
              <div className={styles.successIcon}>
                🎉
              </div>
              <h2 className={styles.successTitle}>¡Éxito!</h2>
              <p className={styles.successMessage}>
                Tu mascota ha sido registrada correctamente en el sistema veterinario.
              </p>
              <div className={styles.successDetails}>
                <div className={styles.successDetailItem}>
                </div>
                <div className={styles.successDetailItem}>
                  <span className={styles.successDetailIcon}>📋</span>
                  <span>Redirigiendo a tus mascotas...</span>
                </div>
              </div>
              <div className={styles.successActions}>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPet;