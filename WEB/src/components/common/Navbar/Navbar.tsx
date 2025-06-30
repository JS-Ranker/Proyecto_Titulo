import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAgendarCita = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate("/agendamientoCitas");
  };

  return (
    <nav className="navbar-principal">
      <ul className="navbar-list">
        <li>
          <NavLink to="/quienes-somos" className="navbar-link" end>Quienes Somos</NavLink>
        </li>
        <li>
          <NavLink to="/shop" className={({ isActive }) => isActive && location.pathname === "/shop" ? "navbar-link active" : "navbar-link"} end>
            Tienda
          </NavLink>
        </li>
        <li>
          <NavLink to="/agendar-cita#agendamientoCitas" className="navbar-link" end onClick={handleAgendarCita}>Agendar Cita</NavLink>
        </li>
        <li>
          <NavLink to="/adoptame" className="navbar-link" end>Adóptame</NavLink>
        </li>
      </ul>
    </nav> 
  );
};

export default Navbar;
