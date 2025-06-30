import React, { useState, useEffect } from 'react';
import { FaHeart, FaPaw, FaUserMd, FaFilter, FaSearch } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import './adoptame.css';
import { getAdopciones, Adopcion } from '../../services/adopciones';

const Adoptame: React.FC = () => {
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [filteredAdopciones, setFilteredAdopciones] = useState<Adopcion[]>([]);
  const [filters, setFilters] = useState({
    estado: '',
    ubicacion: '',
    especie: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Adopcion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  const [imageLoading, setImageLoading] = useState<{[key: number]: boolean}>({});
  const [adoptionForm, setAdoptionForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    experiencia: '',
    vivienda: '',
    otros_animales: '',
    tiempo_disponible: '',
    razon_adopcion: '',
    comentarios: ''
  });

  // Efecto para mostrar modales con animación
  const [modalVisible, setModalVisible] = useState(false);

  // Controlar la animación del modal
  useEffect(() => {
    if (showModal) {
      setTimeout(() => setModalVisible(true), 10);
    } else {
      setModalVisible(false);
    }
  }, [showModal]);

  useEffect(() => {
    setLoading(true);
    getAdopciones().then(data => {
      setAdopciones(data);
      setFilteredAdopciones(data);
      setLoading(false);
      
      // Inicializar estados de imágenes
      const initialImageStates = data.reduce((acc: {[key: number]: boolean}, adopcion) => {
        if (adopcion.imagen_url) {
          acc[adopcion.id] = true; // Comenzar cargando
        }
        return acc;
      }, {});
      setImageLoading(initialImageStates);
    }).catch(() => {
      setAdopciones([]);
      setFilteredAdopciones([]);
      setLoading(false);
    });
  }, []);

  // Función para normalizar texto y mejorar búsquedas
  const normalizeSearchText = (text: string) => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .trim();
  };

  // Función para verificar si hay coincidencias en búsqueda
  const matchesSearchTerm = (adopcion: Adopcion, searchLower: string) => {
    if (!searchTerm) return true;
    
    // Campos de texto para buscar
    const searchFields = [
      adopcion.nombre_mascota,
      adopcion.titulo,
      adopcion.descripcion,
      adopcion.especie,
      adopcion.ubicacion,
      adopcion.edad,
      adopcion.sexo,
      adopcion.requisitos,
      adopcion.contacto_nombre
    ];

    // Buscar en todos los campos
    const hasDirectMatch = searchFields.some(field => 
      field && normalizeSearchText(field).includes(normalizeSearchText(searchLower))
    );

    // Búsquedas específicas mejoradas
    const searchNormalized = normalizeSearchText(searchLower);
    
    // Sinónimos y términos relacionados
    const synonyms: { [key: string]: string[] } = {
      'perro': ['canino', 'can', 'dog', 'cachorro', 'puppy'],
      'gato': ['felino', 'cat', 'gatito', 'kitten', 'minino'],
      'conejo': ['rabbit', 'bunny'],
      'hamster': ['hamster', 'roedor'],
      'ave': ['bird', 'pajaro', 'loro', 'canario'],
      'reptil': ['iguana', 'tortuga', 'snake', 'serpiente'],
      'pez': ['fish', 'goldfish', 'acuario'],
      'macho': ['masculino', 'male'],
      'hembra': ['femenina', 'female'],
      'pequeno': ['small', 'chico', 'mini'],
      'grande': ['large', 'big'],
      'adulto': ['mayor', 'viejo'],
      'joven': ['juvenil', 'young'],
      'cachorro': ['bebe', 'baby', 'pequeno']
    };

    // Verificar sinónimos
    let hasSynonymMatch = false;
    for (const [key, values] of Object.entries(synonyms)) {
      if (searchNormalized.includes(key) || values.some(v => searchNormalized.includes(v))) {
        const searchInFields = searchFields.some(field => 
          field && (
            normalizeSearchText(field).includes(key) ||
            values.some(synonym => normalizeSearchText(field).includes(synonym))
          )
        );
        if (searchInFields) {
          hasSynonymMatch = true;
          break;
        }
      }
    }

    return hasDirectMatch || hasSynonymMatch;
  };

  useEffect(() => {
    let filtered = adopciones.filter(adopcion => {
      const estadoNorm = (adopcion.estado || '').toLowerCase();
      const filtroEstadoNorm = (filters.estado || '').toLowerCase();
      
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = matchesSearchTerm(adopcion, searchLower);
      
      const matchesEstado = !filters.estado || estadoNorm === filtroEstadoNorm;
      const matchesUbicacion = !filters.ubicacion || (adopcion.ubicacion || '') === filters.ubicacion;
      
      // Lógica mejorada para filtro de especie
      let matchesEspecie = true;
      if (filters.especie) {
        const especieAdopcion = (adopcion.especie || '').toLowerCase();
        if (filters.especie === 'Perro') {
          matchesEspecie = especieAdopcion.includes('perro') || especieAdopcion.includes('canino') || especieAdopcion.includes('can');
        } else if (filters.especie === 'Gato') {
          matchesEspecie = especieAdopcion.includes('gato') || especieAdopcion.includes('felino') || especieAdopcion.includes('cat');
        } else if (filters.especie === 'Otro') {
          matchesEspecie = !especieAdopcion.includes('perro') && 
                          !especieAdopcion.includes('canino') && 
                          !especieAdopcion.includes('can') &&
                          !especieAdopcion.includes('gato') && 
                          !especieAdopcion.includes('felino') && 
                          !especieAdopcion.includes('cat');
        }
      }
      
      return matchesSearch && matchesEstado && matchesUbicacion && matchesEspecie;
    });
    setFilteredAdopciones(filtered);
  }, [adopciones, filters, searchTerm]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ estado: '', ubicacion: '', especie: '' });
    setSearchTerm('');
  };

  const handleAdoptClick = (adopcion: Adopcion) => {
    setSelectedPet(adopcion);
    setShowModal(true);
    setShowAdoptionForm(false); // Asegurar que empiece mostrando la info, no el formulario
  };

  const handleShowAdoptionForm = () => {
    setShowAdoptionForm(true);
  };

  const handleCloseModal = () => {
    console.log('handleCloseModal called');
    setShowModal(false);
    setSelectedPet(null);
    setShowAdoptionForm(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setAdoptionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAdoption = async () => {
    if (!selectedPet) return;
    
    // Validar campos requeridos
    if (!adoptionForm.nombre || !adoptionForm.email || !adoptionForm.telefono) {
      alert('Por favor completa los campos obligatorios: Nombre, Email y Teléfono');
      return;
    }

    // Crear el mensaje para enviar
    const mensaje = `
SOLICITUD DE ADOPCIÓN - ${selectedPet.nombre_mascota}

=== DATOS DEL SOLICITANTE ===
Nombre completo: ${adoptionForm.nombre} ${adoptionForm.apellido}
Email: ${adoptionForm.email}
Teléfono: ${adoptionForm.telefono}
Dirección: ${adoptionForm.direccion || 'No especificada'}
Ciudad: ${adoptionForm.ciudad || 'No especificada'}

=== INFORMACIÓN SOBRE LA ADOPCIÓN ===
Mascota solicitada: ${selectedPet.nombre_mascota}
Especie: ${selectedPet.especie}
Estado actual: ${selectedPet.estado}

=== EXPERIENCIA Y VIVIENDA ===
Experiencia con mascotas: ${adoptionForm.experiencia || 'No especificada'}
Tipo de vivienda: ${adoptionForm.vivienda || 'No especificada'}
Otros animales en casa: ${adoptionForm.otros_animales || 'No especificado'}
Tiempo disponible: ${adoptionForm.tiempo_disponible || 'No especificado'}

=== MOTIVACIÓN ===
Razón para adoptar: ${adoptionForm.razon_adopcion || 'No especificada'}
Comentarios adicionales: ${adoptionForm.comentarios || 'Ninguno'}

=== DATOS DE CONTACTO ORIGINALES ===
Este mensaje fue generado para: ${selectedPet.contacto_nombre}
Email del contacto: ${selectedPet.contacto_email}
`;

    // Aquí podrías implementar el envío real del email
    // Por ahora mostraremos el mensaje y simularemos el envío
    console.log('Mensaje de adopción:', mensaje);
    
    // Mostrar modal de confirmación personalizado
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmation = () => {
    // Limpiar el formulario y cerrar todos los modales
    setAdoptionForm({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      experiencia: '',
      vivienda: '',
      otros_animales: '',
      tiempo_disponible: '',
      razon_adopcion: '',
      comentarios: ''
    });
    setShowConfirmationModal(false);
    setShowAdoptionForm(false);
    setShowModal(false);
    setSelectedPet(null);
  };

  // Funciones para manejo de imágenes
  const handleImageLoad = (id: number) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  return (
    <>
      <div className="adoptameContainer">
        {/* Hero Section */}
        <section className="heroSection">
          <div className="heroOverlay">
            <div className="heroContent">
              <h1 className="heroTitle">
                <FaHeart className="heartIcon" />
                Encuentra tu Nuevo Mejor Amigo
              </h1>
              <p className="heroSubtitle">
                Cada uno de nuestros peludos ha sido rescatado, cuidado y rehabilitado con amor. 
                Ahora esperan encontrar una familia que los ame incondicionalmente.
              </p>
              <div className="heroStats">
                <div className="statItem">
                  <MdPets className="statIcon" />
                  <span className="statNumber">{adopciones.length}</span>
                  <span className="statLabel">Esperando Hogar</span>
                </div>
                <div className="statItem">
                  <FaUserMd className="statIcon" />
                  <span className="statNumber">100%</span>
                  <span className="statLabel">Atención Veterinaria</span>
                </div>
                <div className="statItem">
                  <FaHeart className="statIcon" />
                  <span className="statNumber">∞</span>
                  <span className="statLabel">Amor para Dar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="filtersSection">
          <div className="container">
            <div className="searchAndFilter">
              <div className="searchBar">
                <FaSearch className="searchIcon" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, especie (perro, gato, conejo...), descripción, ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="searchInput"
                />
              </div>
              <button 
                className="filterToggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filtros
              </button>
            </div>

            {showFilters && (
              <div className="filtersContainer">
                <div className="filterGroup">
                  <label>Estado:</label>
                  <select
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="disponible">Disponibles</option>
                    <option value="adoptado">Adoptados</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="cancelado">Cancelados</option>
                  </select>
                </div>
                <div className="filterGroup">
                  <label>Ubicación:</label>
                  <select
                    value={filters.ubicacion}
                    onChange={(e) => handleFilterChange('ubicacion', e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="Santiago">Santiago</option>
                    <option value="Valparaíso">Valparaíso</option>
                    <option value="Concepción">Concepción</option>
                  </select>
                </div>
                <div className="filterGroup">
                  <label>Especie:</label>
                  <select
                    value={filters.especie}
                    onChange={(e) => handleFilterChange('especie', e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="Perro">Perros</option>
                    <option value="Gato">Gatos</option>
                    <option value="Otro">Otros</option>
                  </select>
                </div>
                <button className="clearFilters" onClick={clearFilters}>
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Pets Grid */}
        <section className="petsSection">
          <div className="container">
            <h2 className="sectionTitle">
              <FaPaw className="pawIcon" />
              Mascotas en Adopción 
              <span className="resultsCount">
                ({filteredAdopciones.length} {filteredAdopciones.length === 1 ? 'encontrada' : 'encontradas'})
              </span>
              {searchTerm && (
                <span className="searchIndicator">
                  para "{searchTerm}"
                </span>
              )}
            </h2>
            {filteredAdopciones.length === 0 ? (
              <div className="noPets">
                {searchTerm ? (
                  <>
                    <p>No se encontraron mascotas que coincidan con la búsqueda "{searchTerm}".</p>
                    <p>Intenta buscar con otros términos como:</p>
                    <ul style={{ textAlign: 'left', display: 'inline-block', margin: '1rem 0' }}>
                      <li>Nombres de mascotas (ej: "Max", "Luna")</li>
                      <li>Especies (ej: "perro", "gato", "conejo", "hamster")</li>
                      <li>Ubicaciones (ej: "Santiago", "Valparaíso")</li>
                      <li>Características (ej: "cachorro", "adulto", "macho", "hembra")</li>
                    </ul>
                  </>
                ) : (
                  <p>No se encontraron mascotas que coincidan con los filtros seleccionados.</p>
                )}
                <button onClick={clearFilters} className="resetButton">
                  Ver todas las mascotas
                </button>
              </div>
            ) : loading ? (
              // Skeleton loading
              <div className="petsGrid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="petCard skeleton">
                    <div className="petImageContainer"></div>
                    <div className="petInfo">
                      <h3 className="petName">Cargando...</h3>
                      <p className="petBreed">Especie • Edad • Sexo</p>
                      <p className="petDescription">Descripción de la mascota...</p>
                      <div className="petDetails">
                        <div className="detailItem">
                          <span>Ubicación</span>
                          <span>Estado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="petsGrid">
                {filteredAdopciones.map((adopcion, index) => (
                  <div 
                    key={adopcion.id} 
                    className="petCard loaded"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {adopcion.imagen_url && (
                      <div className="petImageContainer">
                        {imageLoading[adopcion.id] && (
                          <div className="petImage loading" />
                        )}
                        <img 
                          src={adopcion.imagen_url.startsWith('http') ? adopcion.imagen_url : `http://localhost:3000/${adopcion.imagen_url}`} 
                          alt={adopcion.nombre_mascota} 
                          className={`petImage ${imageErrors[adopcion.id] ? 'error' : ''}`}
                          onLoad={() => handleImageLoad(adopcion.id)}
                          onError={() => handleImageError(adopcion.id)}
                          style={{ 
                            display: imageLoading[adopcion.id] ? 'none' : 'block' 
                          }}
                        />
                        {imageErrors[adopcion.id] && (
                          <div className="petImage error">
                            <span>📷<br/>Imagen no<br/>disponible</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Badges mejorados */}
                    <div className="petBadges">
                      {adopcion.estado === 'disponible' && (
                        <span className="badge">✅ Disponible</span>
                      )}
                      {adopcion.estado === 'en_proceso' && (
                        <span className="badge" style={{ background: 'linear-gradient(135deg, #FFC107, #FF8C70)' }}>
                          ⏳ En Proceso
                        </span>
                      )}
                      {adopcion.estado === 'adoptado' && (
                        <span className="badge" style={{ background: 'linear-gradient(135deg, #28A745, #A9E5BB)' }}>
                          ❤️ Adoptado
                        </span>
                      )}
                    </div>
                    
                    <div className="petInfo">
                      <h3 className="petName">{adopcion.nombre_mascota}</h3>
                      <p className="petBreed">
                        {adopcion.especie} • {adopcion.edad || 'Edad no informada'} • {adopcion.sexo || 'Sexo no informado'}
                      </p>
                      
                      {/* Tags de personalidad mejorados */}
                      {adopcion.descripcion && (
                        <div className="personalityTags">
                          {adopcion.descripcion.split(' ').slice(0, 3).map((word, i) => (
                            <span key={i} className="personalityTag">
                              {word.replace(/[^\w\s]/gi, '')}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="petDescription">{adopcion.descripcion}</p>
                      
                      <div className="petDetails">
                        <div className="detailItem">
                          <span className="detailLabel">Ubicación</span>
                          <span>{adopcion.ubicacion || 'No especificada'}</span>
                        </div>
                        <div className="detailItem">
                          <span className="detailLabel">Estado</span>
                          <span className={`estado-${adopcion.estado?.replace(/\s/g, '_')}`}>{adopcion.estado}</span>
                        </div>
                      </div>
                      
                      <div className="petFooter">
                        <div className="adoptionFee">
                          <span className="feeLabel">Adopción</span>
                          <span className="feeAmount">Gratuita</span>
                        </div>
                        <button className="adoptBtn" onClick={() => handleAdoptClick(adopcion)}>
                          Adoptar Ahora
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
   
        {/* Call to Action */}
        <section className="ctaSection">
          <div className="container">
            <h2 className="ctaTitle">¿No encuentras lo que buscas?</h2>
            <p className="ctaDescription">
              Contáctanos directamente. Regularmente recibimos nuevos peludos que necesitan hogar.
            </p>
            <div className="ctaButtons">
              <button className="contactBtn">Contáctanos</button>
              <button className="volunteerBtn">Ser Voluntario</button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && selectedPet && (
        <div 
          onClick={handleCloseModal}
          className={`modalOverlay ${modalVisible ? 'visible' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: modalVisible ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            transition: 'background-color 0.3s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={!showAdoptionForm ? "petModalEnhanced" : "adoptionModal"}
          >
            <button 
              onClick={handleCloseModal}
              className="closeModal"
            >
              ×
            </button>
            
            {!showAdoptionForm ? (
              <>
                {/* Modal de información de la mascota */}
                <div className="petModalHeader">
                  <h2 className="petModalTitle">{selectedPet.nombre_mascota}</h2>
                  <p className="petModalSubtitle">
                    {selectedPet.especie} • {selectedPet.edad || 'Edad no informada'} • {selectedPet.sexo || 'Sexo no informado'}
                  </p>
                </div>
                
                <div className="petModalBody">
                  <div className="petModalContent">
                    {selectedPet.imagen_url && (
                      <div className="petImageContainer">
                        {imageLoading[selectedPet.id] && (
                          <div className="petImage loading" style={{ minHeight: '300px' }}>
                            <span>Cargando imagen...</span>
                          </div>
                        )}
                        <img 
                          src={selectedPet.imagen_url.startsWith('http') ? selectedPet.imagen_url : `http://localhost:3000/${selectedPet.imagen_url}`} 
                          alt={selectedPet.nombre_mascota}
                          className={`petImage ${imageErrors[selectedPet.id] ? 'error' : ''}`}
                          onLoad={() => handleImageLoad(selectedPet.id)}
                          onError={() => handleImageError(selectedPet.id)}
                          style={{ 
                            display: imageLoading[selectedPet.id] ? 'none' : 'block' 
                          }}
                        />
                        {imageErrors[selectedPet.id] && (
                          <div className="petImage error" style={{ minHeight: '300px' }}>
                            <span>📷<br/>Imagen no disponible</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="petInfoSection">
                      <h4>📋 Información General</h4>
                      <div className="petDetailsGrid">
                        <div className="petDetailItem">
                          <div className="petDetailLabel">Estado</div>
                          <div className={`petDetailValue estado-${selectedPet.estado?.replace(/\s/g, '_')}`}>
                            {selectedPet.estado}
                          </div>
                        </div>
                        <div className="petDetailItem">
                          <div className="petDetailLabel">Ubicación</div>
                          <div className="petDetailValue">{selectedPet.ubicacion || 'No especificada'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="petInfoSection">
                      <h4>📝 Descripción</h4>
                      <p className="petDescription">{selectedPet.descripcion}</p>
                    </div>
                    
                    {selectedPet.requisitos && (
                      <div className="petInfoSection">
                        <div className="petRequirements">
                          <h4>⚠️ Requisitos Especiales</h4>
                          <p style={{ color: '#333333', margin: 0, lineHeight: '1.6' }}>{selectedPet.requisitos}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="petInfoSection">
                      <div className="petContact">
                        <h4>📞 Información de Contacto</h4>
                        <div className="contactItem">
                          <strong>Nombre:</strong> {selectedPet.contacto_nombre}
                        </div>
                        <div className="contactItem">
                          <strong>Email:</strong> {selectedPet.contacto_email}
                        </div>
                        {selectedPet.contacto_telefono && (
                          <div className="contactItem">
                            <strong>Teléfono:</strong> {selectedPet.contacto_telefono}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleShowAdoptionForm}
                      className="adoptButton"
                    >
                      ❤️ ¡Quiero Adoptar a {selectedPet.nombre_mascota}!
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Modal del formulario de adopción */}
                <div className="adoptionModalHeader">
                  <h3 className="adoptionModalTitle">Formulario de Adopción</h3>
                  <p className="adoptionModalSubtitle">Para {selectedPet.nombre_mascota}</p>
                </div>
                
                <div className="adoptionModalContent">
                  <div className="adoptionFormSection">
                    <h4>👤 Datos Personales</h4>
                    <div className="adoptionFormGrid">
                      <div className="adoptionFormField">
                        <label className="adoptionFormLabel required">Nombre</label>
                        <input
                          type="text"
                          value={adoptionForm.nombre}
                          onChange={(e) => handleFormChange('nombre', e.target.value)}
                          className="adoptionFormInput"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div className="adoptionFormField">
                        <label className="adoptionFormLabel">Apellido</label>
                        <input
                          type="text"
                          value={adoptionForm.apellido}
                          onChange={(e) => handleFormChange('apellido', e.target.value)}
                          className="adoptionFormInput"
                          placeholder="Tu apellido"
                        />
                      </div>
                      <div className="adoptionFormField">
                        <label className="adoptionFormLabel required">Email</label>
                        <input
                          type="email"
                          value={adoptionForm.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          className="adoptionFormInput"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div className="adoptionFormField">
                        <label className="adoptionFormLabel required">Teléfono</label>
                        <input
                          type="tel"
                          value={adoptionForm.telefono}
                          onChange={(e) => handleFormChange('telefono', e.target.value)}
                          className="adoptionFormInput"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="adoptionFormSection">
                    <h4>🏠 Información de Vivienda</h4>
                    <div className="adoptionFormGrid">
                      <div className="adoptionFormField adoptionFormFullWidth">
                        <label className="adoptionFormLabel">Dirección</label>
                        <input
                          type="text"
                          value={adoptionForm.direccion}
                          onChange={(e) => handleFormChange('direccion', e.target.value)}
                          className="adoptionFormInput"
                          placeholder="Tu dirección completa"
                        />
                      </div>
                      <div className="adoptionFormField">
                        <label className="adoptionFormLabel">Ciudad</label>
                        <input
                          type="text"
                          value={adoptionForm.ciudad}
                          onChange={(e) => handleFormChange('ciudad', e.target.value)}
                          className="adoptionFormInput"
                          placeholder="Tu ciudad"
                        />
                      </div>
                      <div className="adoptionFormField">
                        <label className="adoptionFormLabel">Tipo de vivienda</label>
                        <select
                          value={adoptionForm.vivienda}
                          onChange={(e) => handleFormChange('vivienda', e.target.value)}
                          className="adoptionFormSelect"
                        >
                          <option value="">Selecciona tu tipo de vivienda</option>
                          <option value="casa">Casa</option>
                          <option value="departamento">Departamento</option>
                          <option value="casa_patio">Casa con patio</option>
                          <option value="casa_jardin">Casa con jardín</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="adoptionFormSection">
                    <h4>🐾 Experiencia con Mascotas</h4>
                    <div className="adoptionFormField">
                      <label className="adoptionFormLabel">¿Tienes experiencia con mascotas?</label>
                      <textarea
                        value={adoptionForm.experiencia}
                        onChange={(e) => handleFormChange('experiencia', e.target.value)}
                        className="adoptionFormTextarea"
                        placeholder="Cuéntanos sobre tu experiencia con mascotas..."
                      />
                    </div>
                    <div className="adoptionFormField">
                      <label className="adoptionFormLabel">¿Tienes otras mascotas?</label>
                      <input
                        type="text"
                        value={adoptionForm.otros_animales}
                        onChange={(e) => handleFormChange('otros_animales', e.target.value)}
                        className="adoptionFormInput"
                        placeholder="Describe si tienes otras mascotas"
                      />
                    </div>
                  </div>

                  <div className="adoptionFormSection">
                    <h4>💭 Motivación</h4>
                    <div className="adoptionFormField">
                      <label className="adoptionFormLabel">¿Por qué quieres adoptar a {selectedPet.nombre_mascota}?</label>
                      <textarea
                        value={adoptionForm.razon_adopcion}
                        onChange={(e) => handleFormChange('razon_adopcion', e.target.value)}
                        className="adoptionFormTextarea"
                        placeholder="Explícanos por qué quieres adoptar a esta mascota..."
                      />
                    </div>
                    <div className="adoptionFormField">
                      <label className="adoptionFormLabel">Comentarios adicionales</label>
                      <textarea
                        value={adoptionForm.comentarios}
                        onChange={(e) => handleFormChange('comentarios', e.target.value)}
                        className="adoptionFormTextarea"
                        placeholder="¿Algo más que quieras agregar?"
                      />
                    </div>
                  </div>

                  <div className="adoptionFormButtons">
                    <button 
                      onClick={() => setShowAdoptionForm(false)}
                      className="adoptionFormButton cancel"
                    >
                      ⬅️ Volver
                    </button>
                    <button 
                      onClick={handleSubmitAdoption}
                      className="adoptionFormButton submit"
                    >
                      📤 Enviar Solicitud
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmationModal && selectedPet && (
        <div 
          onClick={handleCloseConfirmation}
          className="modalOverlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="confirmationModal"
          >
            <button 
              onClick={handleCloseConfirmation}
              className="closeModal"
            >
              ×
            </button>
            
            <div className="confirmationModalHeader">
              <h3 className="confirmationModalTitle">¡Solicitud Enviada!</h3>
            </div>
            
            <div className="confirmationModalContent">
              <p className="confirmationModalMessage">
                ¡Tu solicitud de adopción para <span className="petName">{selectedPet.nombre_mascota}</span> ha sido enviada exitosamente! 
              </p>
              
              <p className="confirmationModalMessage">
                <span className="ownerName">{selectedPet.contacto_nombre}</span> recibirá un email con tus datos y se pondrá en contacto contigo pronto.
              </p>
              
              <div className="confirmationModalContact">
                <h4>📞 Información de Contacto Directo</h4>
                <p><strong>Nombre:</strong> {selectedPet.contacto_nombre}</p>
                <p><strong>Email:</strong> {selectedPet.contacto_email}</p>
                {selectedPet.contacto_telefono && (
                  <p><strong>Teléfono:</strong> {selectedPet.contacto_telefono}</p>
                )}
              </div>
              
              <button 
                onClick={handleCloseConfirmation}
                className="confirmationModalButton"
              >
                ✅ ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Adoptame;
