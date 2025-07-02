import { useEffect, useState } from 'react';
import {
  HeartPulse,
  Stethoscope,
  PawPrint,
  Heart,
  Calendar,
  Clock,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import styles from "./Cardiologia.module.css";
import { useNavigate } from "react-router-dom";

const Cardiologia: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    { 
      icon: Stethoscope,
      title: "Diagnóstico Avanzado",
      desc: "Electrocardiogramas, ecocardiografías y pruebas de esfuerzo para un diagnóstico preciso del corazón.",
      colorClass: "cardiologia"
    },
    {
      icon: Heart,
      title: "Tratamiento Especializado",
      desc: "Terapias médicas y quirúrgicas para diversas patologías cardíacas con tecnología de punta.",
      colorClass: "cardiologia"
    },
    {
      icon: Activity,
      title: "Monitoreo Continuo",
      desc: "Seguimiento y control de la evolución de tu mascota post-tratamiento para asegurar su bienestar.",
      colorClass: "cardiologia"
    },
  ];

  const diseases = [
    {
      title: "Insuficiencia Cardíaca Congestiva",
      description: "Incapacidad del corazón para bombear sangre eficientemente, causando acumulación de líquidos, tos y dificultad respiratoria.",
      icon: HeartPulse,
      colorClass: "cardiologia"
    },
    {
      title: "Enfermedad Valvular", 
      description: "Deterioro de las válvulas cardíacas que provoca soplos, arritmias y puede evolucionar a insuficiencia cardíaca.",
      icon: Heart,
      colorClass: "cardiologia"
    },
    {
      title: "Cardiomiopatía Dilatada",
      description: "Dilatación del corazón que reduce su capacidad de contracción, común en razas grandes y gigantes.",
      icon: Activity,
      colorClass: "cardiologia"
    },
    {
      title: "Cardiomiopatía Hipertrófica",
      description: "Engrosamiento del músculo cardíaco especialmente común en gatos, que puede causar arritmias y muerte súbita.",
      icon: Stethoscope,
      colorClass: "cardiologia"
    }
  ];

  const symptoms = [
    "Tos persistente o nocturna",
    "Respiración dificultosa (disnea)",
    "Abdomen hinchado o distendido",
    "Colapso o episodios de desmayo",
    "Debilidad y fatiga excesiva",
    "Intolerancia al ejercicio",
    "Cambios de comportamiento",
    "Pérdida de apetito"
  ];

  const diagnosticMethods = [
    "Electrocardiogramas (ECG)",
    "Ecocardiografías Doppler",
    "Radiografías torácicas",
    "Análisis de biomarcadores cardíacos",
    "Pruebas de esfuerzo controladas"
  ];

  return (
    <div className={styles.cardiologiaContainer}>
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

      <div className={styles.cardiologiaContent}>
        {/* Header Section */}
        <div className={`${styles.cardiologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <HeartPulse className={styles.headerIcon} />
            </div>
            <h1 className={styles.cardiologiaTitle}>Cardiología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.cardiologiaSubtitle}>
            Especialistas en el <span className={styles.highlightText}>cuidado cardiovascular</span> de pequeños animales, 
            brindando diagnósticos precisos y tratamientos avanzados para mantener el corazón de tu mascota 
            saludable con tecnología de vanguardia.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <HeartPulse className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>Excelencia en Cardiología Veterinaria</h2>
              <p className={styles.introDescription}>
                La cardiología veterinaria es una especialidad médica que se enfoca en el diagnóstico y 
                tratamiento de enfermedades del corazón y sistema cardiovascular. Un corazón sano es 
                fundamental para la calidad de vida y longevidad de nuestras mascotas.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <HeartPulse className={styles.introDecorationIcon} />
            </div>
          </div>
        </div>

        {/* Team Features Grid */}
        <div className={`${styles.teamGrid} ${isVisible ? styles.visible : ''}`}>
          {teamFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`${styles.teamCard} ${styles.teamCard}-${index} ${styles[feature.colorClass]}`}
              >
                <div className={styles.teamCardBg}></div>
                
                <div className={styles.teamCardContent}>
                  <div className={styles.teamIconContainer}>
                    <IconComponent className={styles.teamMainIcon} />
                  </div>

                  <h2 className={styles.teamTitle}>{feature.title}</h2>
                  
                  <p className={styles.teamDescription}>{feature.desc}</p>

                  <div className={styles.teamDecoration}>
                    <IconComponent className={styles.teamDecorationIcon} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Section */}
        <div className={`${styles.clinicalGrid} ${isVisible ? styles.visible : ''}`}>
          <div className={`${styles.clinicalCard} ${styles.symptomsCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <Activity className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Síntomas de Alerta Cardíaca</h3>
              </div>

              <p className={styles.clinicalDescription}>
                Signos que indican posibles problemas cardiovasculares en tu mascota:
              </p>

              <div className={styles.symptomsList}>
                {symptoms.map((symptom, index) => (
                  <div key={index} className={styles.symptomItem}>
                    <span className={styles.symptomBullet}></span>
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>

              <div className={styles.clinicalDecoration}>
                <Activity className={styles.clinicalDecorationIcon} />
              </div>
            </div>
          </div>

          <div className={`${styles.clinicalCard} ${styles.diagnosticCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <Stethoscope className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Métodos de Diagnóstico</h3>
              </div>

              <p className={styles.clinicalDescription}>
                Utilizamos tecnología avanzada para diagnósticos cardíacos precisos:
              </p>

              <div className={styles.diagnosticList}>
                {diagnosticMethods.map((method, index) => (
                  <div key={index} className={styles.diagnosticItem}>
                    <h4 className={styles.diagnosticTitle}>{method}</h4>
                  </div>
                ))}
              </div>

              <div className={styles.clinicalDecoration}>
                <Stethoscope className={styles.clinicalDecorationIcon} />
              </div>
            </div>
          </div>
        </div>

        {/* Diseases Grid */}
        <div className={`${styles.diseasesGrid} ${isVisible ? styles.visible : ''}`}>
          {diseases.map((disease, index) => {
            const IconComponent = disease.icon;
            return (
              <div
                key={index}
                className={`${styles.diseaseCard} ${styles.diseaseCard}-${index} ${styles[disease.colorClass]}`}
              >
                <div className={styles.diseaseCardBg}></div>
                
                <div className={styles.diseaseCardContent}>
                  <div className={styles.diseaseIconContainer}>
                    <IconComponent className={styles.diseaseMainIcon} />
                  </div>

                  <h2 className={styles.diseaseTitle}>{disease.title}</h2>
                  
                  <p className={styles.diseaseDescription}>{disease.description}</p>

                  <div className={styles.diseaseDecoration}>
                    <IconComponent className={styles.diseaseDecorationIcon} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              ¿Notas algún síntoma cardíaco en tu mascota?
            </h3>
            <p className={styles.ctaDescription}>
              No esperes más. Agenda una consulta con nuestro equipo especializado en cardiología 
              o solicita una videoconsulta de urgencia.
            </p>
          </div>
  
          <div className={styles.ctaButtons}>
            <button 
              onClick={() => navigate("/agendamientoCitas")}
              className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            >
              <Calendar className={styles.ctaButtonIcon} />
              Reservar Consulta
              <ArrowRight className={styles.ctaButtonIcon} />
            </button>
 
            <button 
              onClick={() => navigate("/videoconsulta")}
              className={`${styles.ctaButton} ${styles.ctaSecondary}`}
            >
              <Clock className={styles.ctaButtonIcon} />
              Consulta de Urgencia
            </button>
          </div> 
        </div>

        {/* Additional Info */}
        <div className={styles.footerInfo}>
          <p>
            Nuestros especialistas en cardiología cuentan con certificaciones internacionales y años de experiencia
          </p>
        </div>
      </div>
    </div>
  );
};
export default Cardiologia;
