import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Heart, 
  Shield, 
  Activity, 
  Thermometer,
  PawPrint,
  Calendar,
  ArrowLeft,
  Video,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import styles from './MedicinaGeneral.module.css';

const MedicinaGeneral: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    { 
      icon: Stethoscope,
      title: "Consultas Integrales",
      desc: "Exámenes físicos completos y evaluaciones de salud general para el bienestar óptimo de tu mascota.",
      colorClass: "medicinaGeneral"
    },
    {
      icon: Shield,
      title: "Medicina Preventiva",
      desc: "Vacunaciones, desparasitaciones y programas de prevención adaptados a cada etapa de vida.",
      colorClass: "medicinaGeneral"
    },
    {
      icon: Heart,
      title: "Cuidado Integral",
      desc: "Atención personalizada considerando todos los aspectos de la salud y bienestar animal.",
      colorClass: "medicinaGeneral"
    },
  ];

  const diseases = [
    {
      title: "Enfermedades Infecciosas",
      description: "Diagnóstico y tratamiento de infecciones bacterianas, virales y parasitarias comunes en mascotas.",
      icon: Shield,
      colorClass: "medicinaGeneral"
    },
    {
      title: "Problemas Digestivos", 
      description: "Manejo de trastornos gastrointestinales, cambios alimentarios y problemas nutricionales.",
      icon: Activity,
      colorClass: "medicinaGeneral"
    },
    {
      title: "Enfermedades Respiratorias",
      description: "Tratamiento de afecciones del sistema respiratorio, desde resfriados hasta patologías complejas.",
      icon: Thermometer,
      colorClass: "medicinaGeneral"
    },
    {
      title: "Control de Salud Senior",
      description: "Cuidados especializados para mascotas mayores, manejo de enfermedades geriátricas.",
      icon: HeartHandshake,
      colorClass: "medicinaGeneral"
    }
  ];

  const symptoms = [
    "Cambios en el apetito",
    "Letargo o falta de energía",
    "Vómitos o diarrea",
    "Tos o dificultad respiratoria",
    "Cambios en los hábitos urinarios",
    "Pérdida o ganancia de peso",
    "Cambios de comportamiento",
    "Fiebre o temperatura anormal"
  ];

  const preventiveCare = [
    "Vacunación según calendario",
    "Desparasitación interna y externa",
    "Control de peso y nutrición",
    "Exámenes de salud regulares",
    "Cuidado dental básico"
  ];

  return (
    <div className={styles.medicinaGeneralContainer}>
      {/* Decorative Background Elements */}
      <div className={styles.decorativeBg}>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration1}`}>
          <Stethoscope className={styles.bgDecorationIcon} />
        </div>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration2}`}>
          <PawPrint className={styles.bgDecorationIcon} />
        </div>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration3}`}>
          <Heart className={styles.bgDecorationIcon} />
        </div>
      </div>

      <div className={styles.medicinaGeneralContent}>
        {/* Header Section */}
        <div className={`${styles.medicinaGeneralHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <Stethoscope className={styles.headerIcon} />
            </div>
            <h1 className={styles.medicinaGeneralTitle}>Medicina General Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.medicinaGeneralSubtitle}>
            Tu <span className={styles.highlightText}>primera línea de atención veterinaria</span>, 
            brindando cuidado integral y medicina preventiva para mantener a tu mascota 
            saludable en todas las etapas de su vida.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <HeartHandshake className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h3 className={styles.introTitle}>Atención Integral y Personalizada</h3>
              <p className={styles.introDescription}>
                Nuestro equipo de medicina general está comprometido con la salud y bienestar de tu mascota, 
                ofreciendo desde consultas preventivas hasta el manejo de enfermedades comunes, 
                siempre con un enfoque cálido y profesional.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <Heart className={styles.introDecorationIcon} />
            </div>
          </div>
        </div>

        {/* Team Features Grid */}
        <div className={`${styles.teamGrid} ${isVisible ? styles.visible : ''}`}>
          {teamFeatures.map((feature, index) => (
            <div key={index} className={`${styles.teamCard} ${styles[`teamCard-${index}`]}`}>
              <div className={styles.teamCardBg}></div>
              
              <div className={styles.teamCardContent}>
                <div className={styles.teamIconContainer}>
                  <feature.icon className={styles.teamMainIcon} />
                </div>
                
                <h3 className={styles.teamTitle}>{feature.title}</h3>
                <p className={styles.teamDescription}>{feature.desc}</p>
                
                <div className={styles.teamDecoration}>
                  <Heart className={styles.teamDecorationIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Information Section */}
        <div className={`${styles.clinicalGrid} ${isVisible ? styles.visible : ''}`}>
          <div className={`${styles.clinicalCard} ${styles.symptomsCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <Activity className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Síntomas de Alerta</h3>
                <p className={styles.clinicalDescription}>
                  Signos que indican que tu mascota necesita atención veterinaria
                </p>
              </div>
              
              <ul className={styles.symptomsList}>
                {symptoms.map((symptom, index) => (
                  <li key={index} className={styles.symptomItem}>
                    <div className={styles.symptomBullet}></div>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.clinicalDecoration}>
              <Thermometer className={styles.clinicalDecorationIcon} />
            </div>
          </div>

          <div className={`${styles.clinicalCard} ${styles.preventiveCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <Shield className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Cuidados Preventivos</h3>
                <p className={styles.clinicalDescription}>
                  Medidas esenciales para mantener la salud de tu mascota
                </p>
              </div>
              
              <ul className={styles.preventiveList}>
                {preventiveCare.map((care, index) => (
                  <li key={index} className={styles.preventiveItem}>
                    <h4 className={styles.preventiveTitle}>{care}</h4>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.clinicalDecoration}>
              <Shield className={styles.clinicalDecorationIcon} />
            </div>
          </div>
        </div>

        {/* Diseases Grid */}
        <div className={`${styles.diseasesGrid} ${isVisible ? styles.visible : ''}`}>
          {diseases.map((disease, index) => (
            <div key={index} className={`${styles.diseaseCard} ${styles[`diseaseCard-${index}`]}`}>
              <div className={styles.diseaseCardBg}></div>
              
              <div className={styles.diseaseCardContent}>
                <div className={styles.diseaseIconContainer}>
                  <disease.icon className={styles.diseaseMainIcon} />
                </div>
                
                <h3 className={styles.diseaseTitle}>{disease.title}</h3>
                <p className={styles.diseaseDescription}>{disease.description}</p>
                
                <div className={styles.diseaseDecoration}>
                  <Heart className={styles.diseaseDecorationIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              ¿Tu mascota necesita una revisión general?
            </h3>
            <p className={styles.ctaDescription}>
              La medicina preventiva es la clave para una vida larga y saludable. 
              Agenda una consulta con nuestros veterinarios generalistas para un chequeo integral.
            </p>
          </div>
   
          <div className={styles.ctaButtons}>
            <button 
              onClick={() => navigate("/agendamientoCitas")}
              className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            >
              <Calendar className={styles.ctaButtonIcon} />
              Agendar Consulta
            </button>

            <button 
              onClick={() => navigate("/videoConsulta")}
              className={`${styles.ctaButton} ${styles.ctaSecondary}`}
            >
              <Video className={styles.ctaButtonIcon} />
              Video Consulta
            </button> 
          </div> 
        </div>

        {/* Navigation */}
        <div className={styles.navigationSection}>
          <button 
            onClick={() => navigate("/especialidadespage")}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.backButtonIcon} />
            Volver a Especialidades
          </button>
        </div>

        {/* Additional Info */}
        <div className={styles.footerInfo}>
          <p>
            Nuestro equipo de medicina general cuenta con amplia experiencia en el cuidado integral 
            de mascotas de todas las edades, desde cachorros hasta animales senior
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicinaGeneral;
