import React, { useState, useEffect } from 'react';
import { Heart, Stethoscope, Users, Award, Sparkles, PawPrint } from 'lucide-react';
import './QuienesSomos.css';

const QuienesSomos: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    {
      icon: <Award className="feature-icon" />,
      title: "Veterinarios Certificados",
      description: "Amplia experiencia en diversas áreas de la medicina veterinaria"
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Personal Especializado",
      description: "Técnicos y personal de apoyo formados para asistir en todo el proceso"
    },
    {
      icon: <Heart className="feature-icon" />,
      title: "Vocación y Cariño",
      description: "Respeto y amor por cada mascota que entra por nuestra puerta"
    }
  ];

  return (
    <div className="quienes-somos-container">
      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="decoration decoration-1">
          <PawPrint className="decoration-icon decoration-paw" />
        </div>
        <div className="decoration decoration-2">
          <Heart className="decoration-icon decoration-heart" />
        </div>
        <div className="decoration decoration-3">
          <Stethoscope className="decoration-icon decoration-stethoscope" />
        </div>
      </div>

      <div className="content-wrapper">
        {/* Header Section */}
        <div className={`header-section ${isVisible ? 'visible' : ''}`}>
          <div className="title-container">
            <div className="title-icon-left">
              <Heart className="title-icon" />
            </div>
            <h1 className="main-title">¿Quiénes Somos?</h1>
            <div className="title-icon-right">
              <Sparkles className="title-icon" />
            </div>
          </div>
          <div className="title-divider"></div>
        </div>

        {/* Main Content */}
        <div className={`main-content ${isVisible ? 'visible' : ''}`}>
          {/* Introduction Card */}
          <div className="intro-card">
            <div className="intro-content">
              <div className="intro-icon-container">
                <Stethoscope className="intro-icon" />
              </div>
              <div className="intro-text">
                <p>
                  En nuestra clínica veterinaria, nos dedicamos con <span className="highlight-teal">pasión</span> al cuidado y
                  bienestar de tus mascotas. Contamos con un equipo de profesionales
                  altamente capacitados que comparten un profundo <span className="highlight-orange">amor por los animales</span>.
                  Nuestra prioridad es ofrecer una atención cercana, cálida y de alta
                  calidad, tanto a los pacientes como a sus familias.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mission-section">
            <div className="mission-header">
              <div className="mission-icon-container">
                <Heart className="mission-icon" />
              </div>
              <h2 className="mission-title">Nuestra Misión</h2>
            </div>
            
            <p className="mission-text">
              Brindar servicios veterinarios integrales con un enfoque en la
              <span className="highlight-teal"> prevención</span>, el <span className="highlight-teal">diagnóstico</span> y el <span className="highlight-teal">tratamiento oportuno</span>. Buscamos mejorar
              la calidad de vida de cada animal de compañía, acompañando a sus
              dueños con compromiso, confianza y empatía.
            </p>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <div className="team-header">
              <div className="team-icon-container">
                <Users className="team-icon" />
              </div>
              <h2 className="team-title">Nuestro Equipo</h2>
            </div>

            <div className="team-grid">
              {teamFeatures.map((feature, index) => (
                <div key={index} className={`team-card team-card-${index}`}>
                  <div className="team-card-content">
                    <div className="team-card-icon-container">
                      {React.cloneElement(feature.icon, { className: "team-card-icon" })}
                    </div>
                    
                    <h3 className="team-card-title">{feature.title}</h3>
                    
                    <p className="team-card-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <div className="cta-button">
              <Heart className="cta-icon" />
              <span className="cta-text">Cuidamos a tu mascota con amor</span>
              <PawPrint className="cta-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuienesSomos;