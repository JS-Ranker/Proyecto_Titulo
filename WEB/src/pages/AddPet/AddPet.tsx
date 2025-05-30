import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPaw, FaArrowLeft } from "react-icons/fa";
import { razasService } from "../../services/razas";
import { especiesService } from "../../services/especies";

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
  // url_imagen_mascota?: string; // Si quieres agregar imagen
}

interface UserData {
  rut: string; // <-- agrega esta línea
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
      setMensaje({ tipo: "exito", texto: "¡Registro exitoso!" });
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
      setMensaje({ tipo: "error", texto: "Registro inválido" });
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-link text-decoration-none"
          style={{ color: "#4b3f72" }}
        >
          <FaArrowLeft size={20} />
        </button>
        <h2 className="mb-0 text-center" style={{ color: "#4b3f72" }}>
          <FaPaw className="me-2" /> Registrar Mascota
        </h2>
        <div style={{ width: 20 }}></div>
      </div>

      <div className="card p-4 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="form-label fw-bold d-block"
              style={{ color: "#4b3f72", marginBottom: "8px" }}
            >
              Nombre de la Mascota
            </label>
            <input
              type="text"
              className="form-control"
              name="nombre_mascota"
              value={petData.nombre_mascota}
              onChange={handleChange}
              style={{
                border: "none",
                borderBottom: "2px solid #4b3f72",
                borderRadius: "0",
                padding: "10px 0",
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="form-label fw-bold d-block"
              style={{ color: "#4b3f72", marginBottom: "8px" }}
            >
              Tipo de Mascota
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
              className="form-select"
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

          <div className="mb-4">
            <label
              className="form-label fw-bold d-block"
              style={{ color: "#4b3f72", marginBottom: "8px" }}
            >
              Raza
            </label>
            <select
              name="id_raza"
              value={petData.id_raza || ""}
              onChange={handleChange}
              className="form-select"
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

          <div className="mb-4">
            <label className="form-label fw-bold d-block" style={{ color: "#4b3f72", marginBottom: "8px" }}>
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              className="form-control"
              name="fecha_nac_mascota"
              value={petData.fecha_nac_mascota}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold d-block" style={{ color: "#4b3f72", marginBottom: "8px" }}>
              Peso (kg)
            </label>
            <input
              type="number"
              className="form-control"
              name="peso_kg"
              value={petData.peso_kg}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold d-block" style={{ color: "#4b3f72", marginBottom: "8px" }}>
              Género
            </label>
            <select
              name="sexo_mascota"
              value={petData.sexo_mascota}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Selecciona género</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold d-block" style={{ color: "#4b3f72", marginBottom: "8px" }}>
              ¿Esterilizado?
            </label>
            <select
              name="esta_esterilizado"
              value={petData.esta_esterilizado}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold d-block" style={{ color: "#4b3f72", marginBottom: "8px" }}>
              Color
            </label>
            <input
              type="text"
              className="form-control"
              name="color_mascota"
              value={petData.color_mascota}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold d-block" style={{ color: "#4b3f72", marginBottom: "8px" }}>
              Código Microchip
            </label>
            <input
              type="text"
              className="form-control"
              name="codigo_microchip"
              value={petData.codigo_microchip}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold d-block" style={{ color: "#4b3f72", marginBottom: "8px" }}>
              Foto de la Mascota
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={e => setImagen(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <hr className="my-4" style={{ borderColor: "#ddd" }} />

          <div className="d-flex flex-column gap-2">
            <button
              type="submit"
              className="btn btn-primary py-2"
              style={{
                backgroundColor: "#ff9a76",
                border: "none",
                borderRadius: "10px",
                fontWeight: "500",
              }}
            >
              REGISTRAR MASCOTA
            </button>

            <Link
              to="/user"
              className="btn btn-outline-secondary py-2 text-center"
              style={{
                color: "#4b3f72",
                borderColor: "#4b3f72",
                borderRadius: "10px",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              VOLVER A INICIO
            </Link>
          </div>
        </form>

        {mensaje && (
          <div
            className={`alert ${mensaje.tipo === "exito" ? "alert-success" : "alert-danger"}`}
            role="alert"
            style={{ fontWeight: 500, textAlign: "center" }}
          >
            {mensaje.texto}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPet;
