import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  TestTube, 
  ShieldCheck, 
  Activity, 
  Heart,
  Stethoscope,
  PawPrint,
  Calendar,
  ArrowLeft,
  Video,
  Sparkles
} from 'lucide-react';
import styles from './Oftalmologia.module.css';

const Oftalmologia: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    { 
      icon: Eye,
      title: "Diagnóstico Oftálmico",
      desc: "Exámenes completos de la vista, tonometría y oftalmoscopía para evaluar la salud ocular integral.",
      colorClass: "oftalmologia"
    },
    {
      icon: TestTube,
      title: "Cirugía Ocular",
      desc: "Procedimientos quirúrgicos especializados para cataratas, glaucoma y traumatismos oculares.",
      colorClass: "oftalmologia"
    },
    {
      icon: ShieldCheck,
      title: "Tratamiento Preventivo",
      desc: "Cuidados preventivos y tratamientos para mantener la salud visual de tu mascota.",
      colorClass: "oftalmologia"
    },
  ];

  const diseases = [
    {
      title: "Cataratas",
      description: "Opacificación del cristalino que causa pérdida gradual de la visión, común en perros mayores y ciertas razas.",
      icon: Eye,
      colorClass: "oftalmologia"
    },
    {
      title: "Glaucoma", 
      description: "Aumento de la presión intraocular que puede causar dolor severo y pérdida irreversible de la visión.",
      icon: Activity,
      colorClass: "oftalmologia"
    },
    {
      title: "Conjuntivitis",
      description: "Inflamación de la conjuntiva ocular que causa enrojecimiento, secreción y molestias.",
      icon: TestTube,
      colorClass: "oftalmologia"
    },
    {
      title: "Úlceras Corneales",
      description: "Lesiones en la córnea que pueden ser superficiales o profundas, requiriendo tratamiento inmediato.",
      icon: ShieldCheck,
      colorClass: "oftalmologia"
    }
  ];

  const symptoms = [
    "Enrojecimiento ocular",
    "Secreción excesiva",
    "Parpadeo frecuente",
    "Fotofobia (sensibilidad a la luz)",
    "Opacidad en el ojo",
    "Cambios en el comportamiento visual",
    "Rascado excesivo del ojo",
    "Pérdida de visión gradual"
  ];

  const diagnosticMethods = [
    "Oftalmoscopía directa e indirecta",
    "Tonometría (medición de presión ocular)",
    "Prueba de fluoresceína",
    "Ecografía ocular",
    "Análisis de lágrimas (test de Schirmer)"
  ];

  return (
    <div className={styles.oftalmologiaContainer}>
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

      <div className={styles.oftalmologiaContent}>
        {/* Header Section */}
        <div className={`${styles.oftalmologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <Eye className={styles.headerIcon} />
            </div>
            <h1 className={styles.oftalmologiaTitle}>Oftalmología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.oftalmologiaSubtitle}>
            Especialistas en el <span className={styles.highlightText}>cuidado de la salud visual</span> de 
            pequeños animales, preservando y restaurando la visión con tecnología de vanguardia 
            y técnicas quirúrgicas especializadas.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <Eye className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h3 className={styles.introTitle}>Salud Visual Integral</h3>
              <p className={styles.introDescription}>
                Nuestro equipo de oftalmólogos veterinarios se especializa en el diagnóstico, tratamiento y prevención 
                de enfermedades oculares en mascotas, utilizando equipos de última generación para preservar la visión 
                y calidad de vida de tu compañero.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <Eye className={styles.introDecorationIcon} />
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
                  <Eye className={styles.teamDecorationIcon} />
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
                  <Eye className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Síntomas a Observar</h3>
                <p className={styles.clinicalDescription}>
                  Signos que pueden indicar problemas oculares en tu mascota
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
              <Eye className={styles.clinicalDecorationIcon} />
            </div>
          </div>

          <div className={`${styles.clinicalCard} ${styles.diagnosticCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <TestTube className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Métodos Diagnósticos</h3>
                <p className={styles.clinicalDescription}>
                  Tecnología avanzada para evaluación oftálmica completa
                </p>
              </div>
              
              <ul className={styles.diagnosticList}>
                {diagnosticMethods.map((method, index) => (
                  <li key={index} className={styles.diagnosticItem}>
                    <h4 className={styles.diagnosticTitle}>{method}</h4>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.clinicalDecoration}>
              <TestTube className={styles.clinicalDecorationIcon} />
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
                  <Eye className={styles.diseaseDecorationIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              ¿Tu mascota presenta problemas oculares?
            </h3>
            <p className={styles.ctaDescription}>
              No esperes más. La detección temprana es clave para preservar la visión. 
              Agenda una consulta con nuestros especialistas en oftalmología veterinaria.
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
            Nuestros oftalmólogos veterinarios cuentan con certificaciones internacionales y años de experiencia 
            en cirugía ocular y tratamientos oftálmicos avanzados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Oftalmologia;
