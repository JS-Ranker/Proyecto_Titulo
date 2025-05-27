// src/pages/User.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/duenos";

const User = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const rut = parsedUser.rut;

    if (!rut) {
      localStorage.removeItem("currentUser");
      navigate("/login");
      return;
    }

    apiService
      .obtenerDuenoPorRut(rut)
      .then((res) => {
        setUsuario(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        localStorage.removeItem("currentUser");
        navigate("/login");
      });
  }, [navigate]);

  if (cargando) return <div>Cargando datos del usuario...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Perfil de Usuario</h1>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Apellido:</strong> {usuario.apellido}</p>
      <p><strong>RUT:</strong> {usuario.rut}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Teléfono:</strong> {usuario.telefono || "No registrado"}</p>

      <button onClick={() => {
        localStorage.removeItem("currentUser");
        navigate("/login");
      }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default User;
