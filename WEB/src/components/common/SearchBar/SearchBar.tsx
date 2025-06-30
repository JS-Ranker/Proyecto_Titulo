import React, { useState, useEffect } from "react";
import "./SearchBar.css";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  precio_venta?: number; // <-- Agregado para el precio de venta
  imagen_url: string;
}

interface SearchBarProps {
  productos: Producto[];
}

const SearchBar: React.FC<SearchBarProps> = ({ productos }) => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<Producto[]>([]);

  useEffect(() => {
    console.log('productos:', productos); // <-- para ver la estructura de los productos
    if (busqueda.trim() === "") {
      setResultados([]);
      return;
    }
    const filtrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setResultados(filtrados);
  }, [busqueda, productos]);

  return (
    <div className="contenedor-buscador">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-buscador"
        />
        <button 
          className="boton-busqueda"
          aria-label="Buscar"
          onClick={() => {}}
        >
          🔍
        </button>
      </div>
      {resultados.length > 0 && (
        <div className="resultados-dropdown">
          <ul>
            {resultados.map((producto) => (
              <li key={producto.id} className="resultado-item">
                <img
                  src={`http://localhost:3000/${producto.imagen_url}`}
                  alt={producto.nombre}
                  className="img-producto"
                  onError={(e) => (e.currentTarget.src = "/default-product.png")}
                />
                <div className="producto-info">
                  <strong className="producto-nombre">{producto.nombre}</strong>
                  <span className="producto-precio">
                    {producto.precio_venta !== undefined ? `$${Math.round(producto.precio_venta).toLocaleString('es-CL')}` : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
