import { useState, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaTimes, FaPlus, FaMinus, FaArrowLeft, FaCheck, FaGift } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { productosService } from "../../services/productos";
import { categoriasService } from "../../services/categorias"; // Asegúrate de tener este servicio
import styles from "./Shop.module.css";

interface Product {
  id: number;
  codigo_sku?: string;
  nombre: string;
  descripcion?: string;
  precio_costo?: number;
  precio_venta: number;
  stock: number;
  stock_minimo?: number;
  categoria_id?: number;
  imagen_url?: string;
  peso_kg?: number;
  activo?: number;
  destacado?: number;
  fecha_creacion?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  categoria_padre_id?: number;
}

const Shop = () => {
  // Estado para los productos
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado para la alerta personalizada
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Estado para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Categoria[]>([
    { id: 0, nombre: "Todos los productos" }
  ]);

  const location = useLocation();

  // Cargar productos y categorías antes de filtrar por query param
  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [productos, cats] = await Promise.all([
          productosService.obtenerTodos(),
          categoriasService.obtenerTodas()
        ]);
        if (!isMounted) return;
        setProducts(productos);
        setCategories([{ id: 0, nombre: "Todos los productos" }, ...cats]);
        setLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error al cargar productos o categorías:", error);
        setLoading(false);
      }
    }; 
    fetchAll();
    return () => { isMounted = false; };
  }, []);

  // Filtrar productos según búsqueda y categoría
  useEffect(() => {
    let result = products;
    if (selectedCategory !== "0") {
      result = result.filter(
        (product) => String(product.categoria_id) === selectedCategory
      );
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.nombre.toLowerCase().includes(term) ||
          product.descripcion?.toLowerCase().includes(term)
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Leer query param 'categoria' y filtrar productos al cargar (solo si existe)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoria = params.get('categoria');
    if (categoria && categories.length > 1) {
      // Buscar la categoría por nombre (case-insensitive)
      const cat = categories.find(c => c.nombre.toLowerCase() === categoria.toLowerCase());
      if (cat) {
        setSelectedCategory(String(cat.id));
      } else {
        setSelectedCategory("0");
      }
    } else if (!categoria) {
      setSelectedCategory("0");
    }
  }, [location.search, categories]);

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Calcular total del carrito
  const cartTotal = cart.reduce(
    (total, item) => total + item.precio_venta * item.quantity,
    0
  );

  return (
    <div className={styles.shopContainer}>
      <div className={styles.shopHeader}>
        <Link to="/" className={styles.backLink}>
          <FaArrowLeft /> <span>Volver</span>
        </Link>
        <h1 className={styles.shopTitle}>Tienda HappyPet</h1>
        <button
          className={styles.cartButton}
          onClick={() => setIsCartOpen(true)}
        >
          <FaShoppingCart />
          <span>Carrito</span>
          {cart.length > 0 && (
            <span className={styles.cartCount}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Controles de búsqueda y filtro */}
      <div className={styles.shopControls}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de productos */}
      {loading ? (
        <div>Cargando productos...</div>
      ) : filteredProducts.length === 0 ? (
        <div>No se encontraron productos.</div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                <img
                  src={`http://localhost:3000/${product.imagen_url}`}
                  alt={product.nombre}
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.nombre}</h3>
                <p className={styles.productDescription}>
                  {product.descripcion}
                </p>
                <div className={styles.productPrice}>
                  ${Number(product.precio_venta).toLocaleString("es-CL")}
                </div>
                <div className={styles.productActions}>
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => {
                        const cartItem = cart.find(
                          (item) => item.id === product.id
                        );
                        if (cartItem) {
                          updateQuantity(product.id, cartItem.quantity - 1);
                        }
                      }}
                    >
                      <FaMinus />
                    </button>
                    <span className={styles.quantityDisplay}>
                      {cart.find((item) => item.id === product.id)?.quantity || 0}
                    </span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => addToCart(product)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className={styles.addToCartButton}
                    onClick={() => addToCart(product)}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal del carrito */}
      <div
        className={`${styles.cartModalOverlay} ${
          isCartOpen ? styles.open : ""
        }`}
      >
        <div className={styles.cartModal}>
          <div className={styles.cartHeader}>
            <h2 className={styles.cartTitle}>Tu Carrito</h2>
            <button
              className={styles.closeButton}
              onClick={() => setIsCartOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    src={
                      item.imagen_url
                        ? `http://localhost:3000/${item.imagen_url}`
                        : "/images/default-product.png"
                    }
                    alt={item.nombre}
                    className={styles.cartItemImage}
                  />
                  <div className={styles.cartItemDetails}>
                    <h3 className={styles.cartItemName}>{item.nombre}</h3>
                    <p className={styles.cartItemPrice}>
                      ${item.precio_venta.toLocaleString("es-CL")} x {item.quantity} =
                      ${(item.precio_venta * item.quantity).toLocaleString("es-CL")}
                    </p>
                    <div className={styles.cartItemActions}>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityButton}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <FaMinus />
                        </button>
                        <span className={styles.quantityDisplay}>
                          {item.quantity}
                        </span>
                        <button
                          className={styles.quantityButton}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button
                        className={styles.removeItemButton}
                        onClick={() => removeFromCart(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <span>Total:</span>
                <span>${cartTotal.toLocaleString("es-CL")}</span>
              </div>
              <button
                className={styles.checkoutButton}
                onClick={() => {
                  setShowSuccessAlert(true);
                  setCart([]);
                  setIsCartOpen(false);
                  // Auto cerrar la alerta después de 4 segundos
                  setTimeout(() => {
                    setShowSuccessAlert(false);
                  }, 4000);
                }}
              >
                Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alerta de éxito personalizada */}
      <div
        className={`${styles.successAlert} ${
          showSuccessAlert ? styles.show : ""
        }`}
      >
        <div className={styles.successAlertContent}>
          <div className={styles.successAlertIcon}>
            <FaCheck className={styles.successIcon} />
          </div>
          <div className={styles.successAlertText}>
            <h3 className={styles.successAlertTitle}>
              ¡Compra realizada con éxito!
            </h3>
            <p className={styles.successAlertMessage}>
              Gracias por tu compra en HappyPet. Tu pedido está siendo procesado.
            </p>
          </div>
          <button
            className={styles.successAlertClose}
            onClick={() => setShowSuccessAlert(false)}
          >
            <FaTimes />
          </button>
          <div className={styles.successAlertDecoration}>
            <FaGift className={styles.successDecorationIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
