import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  Zap, 
  Shield, 
  Calendar,
  Video,
  ArrowRight,
  Sparkles,
  PawPrint
} from 'lucide-react';
import './EspecialidadesPage.css';

const EspecialidadesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const especialidades = [
    {
      id: 'cardiologia',
      title: 'Cardiología Veterinaria',
      description: 'Diagnóstico y tratamiento de enfermedades del corazón y sistema circulatorio.',
      icon: <Heart className="specialty-icon" />,
      colorClass: 'cardiologia',
      route: '/cardiologia'
    },  
    {
      id: 'endocrinologia',
      title: 'Endocrinología Veterinaria',
      description: 'Tratamiento de desórdenes hormonales como diabetes y problemas tiroideos.',
      icon: <Zap className="specialty-icon" />,
      colorClass: 'endocrinologia',
      route: '/endocrinologia'
    },
    {
      id: 'oncologia',
      title: 'Oncología Veterinaria',
      description: 'Diagnóstico y tratamiento del cáncer en animales.',
      icon: <Shield className="specialty-icon" />,
      colorClass: 'oncologia',
      route: '/oncologia'
    },
    {
      id: 'gastroenterologia',
      title: 'Gastroenterología Veterinaria',
      description: 'Enfermedades del sistema digestivo, hígado y páncreas.',
      icon: <Activity className="specialty-icon" />,
      colorClass: 'gastroenterologia',
      route: '/gastroenterologia'
    }
  ];
 
  return (
    <div className="especialidades-container">
      {/* Decorative Background Elements */}
      <div className="decorative-bg">
        <div className="bg-decoration bg-decoration-1">
          <Stethoscope className="bg-decoration-icon" />
        </div>
        <div className="bg-decoration bg-decoration-2">
          <PawPrint className="bg-decoration-icon" />
        </div>
        <div className="bg-decoration bg-decoration-3">
          <Heart className="bg-decoration-icon" />
        </div>
      </div>

      <div className="especialidades-content">
        {/* Header Section */}
        <div className={`especialidades-header ${isVisible ? 'visible' : ''}`}>
          <div className="header-title-container">
            <div className="header-icon-container">
              <Stethoscope className="header-icon" />
            </div>
            <h1 className="especialidades-title">Nuestras Especialidades</h1>
            <div className="header-icon-container">
              <Sparkles className="header-icon" />
            </div>
          </div>
          
          <div className="title-divider"></div>
          
          <p className="especialidades-subtitle">
            Contamos con <span className="highlight-text">especialistas altamente capacitados</span> en cada área,
            comprometidos con brindar la mejor atención médica para tu mascota
          </p>
        </div>

        {/* Specialties Grid */}
        <div className={`especialidades-grid ${isVisible ? 'visible' : ''}`}>
          {especialidades.map((especialidad, index) => (
            <div
              key={especialidad.id}
              className={`specialty-card specialty-card-${index} ${especialidad.colorClass}`}
            >
              <div className="specialty-card-bg"></div>
              
              <div className="specialty-card-content">
                {/* Icon */}
                <div className="specialty-icon-container">
                  {React.cloneElement(especialidad.icon, { className: "specialty-main-icon" })}
                </div>

                {/* Content */}
                <h2 className="specialty-title">{especialidad.title}</h2>
                
                <p className="specialty-description">{especialidad.description}</p>

                {/* Link */}
                <Link to={especialidad.route} className="specialty-link">
                  Ver más información
                  <ArrowRight className="specialty-arrow" />
                </Link>

                {/* Decorative Element */}
                <div className="specialty-decoration">
                  {React.cloneElement(especialidad.icon, { className: "specialty-decoration-icon" })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`cta-section ${isVisible ? 'visible' : ''}`}>
          <div className="cta-content">
            <h3 className="cta-title">
              ¿Necesitas atención especializada para tu mascota?
            </h3>
            <p className="cta-description">
              Nuestros especialistas están listos para brindar la mejor atención. 
              Agenda una cita presencial o solicita una videoconsulta.
            </p>
          </div>

          <div className="cta-buttons">
            <button 
              onClick={() => navigate("/agendamientoCitas")}
              className="cta-button cta-primary"
            >
              <Calendar className="cta-button-icon" />
              Agendar Cita Presencial
            </button>

            <button 
              onClick={() => navigate("/videoConsulta")}
              className="cta-button cta-secondary"
            >
              <Video className="cta-button-icon" />
              Video Consulta Online
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="footer-info">
          <p>
            Todos nuestros especialistas cuentan con certificaciones internacionales y años de experiencia
          </p>
        </div>
      </div>
    </div>
  );
};

export default EspecialidadesPage;