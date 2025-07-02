import { useEffect, useState } from 'react';
import {
  Activity,
  Heart,
  PawPrint,
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  Stethoscope,
  TestTube,
  Pill,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import styles from "./Gastroenterologia.module.css";

const Gastroenterologia: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    { 
      icon: TestTube,
      title: "Diagnóstico Avanzado",
      desc: "Endoscopía, ultrasonografía y análisis especializados para diagnóstico preciso del sistema digestivo.",
      colorClass: "gastroenterologia"
    },
    {
      icon: Pill,
      title: "Tratamiento Especializado",
      desc: "Terapias médicas y quirúrgicas para trastornos gastrointestinales complejos.",
      colorClass: "gastroenterologia"
    },
    {
      icon: ShieldCheck,
      title: "Manejo Nutricional",
      desc: "Planes dietéticos terapéuticos y seguimiento continuo de la salud digestiva.",
      colorClass: "gastroenterologia"
    },
  ];

  const diseases = [
    {
      title: "Enfermedad Inflamatoria Intestinal",
      description: "Trastornos crónicos que afectan el tracto gastrointestinal con inflamación persistente y síntomas recurrentes.",
      icon: Activity,
      colorClass: "gastroenterologia"
    },
    {
      title: "Pancreatitis", 
      description: "Inflamación del páncreas que puede ser aguda o crónica, requiriendo manejo especializado del dolor y dieta.",
      icon: TestTube,
      colorClass: "gastroenterologia"
    },
    {
      title: "Hepatopatías",
      description: "Enfermedades hepáticas que afectan la función digestiva y requieren tratamiento integral.",
      icon: ShieldCheck,
      colorClass: "gastroenterologia"
    },
    {
      title: "Obstrucción Intestinal",
      description: "Bloqueo del tracto intestinal que requiere diagnóstico rápido y a menudo intervención quirúrgica urgente.",
      icon: Heart,
      colorClass: "gastroenterologia"
    }
  ];

  const symptoms = [
    "Vómitos frecuentes o persistentes",
    "Diarrea crónica o sanguinolenta",
    "Pérdida de apetito",
    "Pérdida de peso progresiva",
    "Distensión abdominal",
    "Dolor abdominal",
    "Cambios en las heces",
    "Letargia y deshidratación"
  ];

  const diagnosticMethods = [
    "Endoscopía digestiva",
    "Ultrasonografía abdominal",
    "Análisis coprológicos",
    "Biopsias intestinales",
    "Estudios radiológicos contrastados"
  ];

  return (
    <div className={styles.gastroenterologiaContainer}>
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

      <div className={styles.gastroenterologiaContent}>
        {/* Header Section */}
        <div className={`${styles.gastroenterologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <FlaskConical className={styles.headerIcon} />
            </div>
            <h1 className={styles.gastroenterologiaTitle}>Gastroenterología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.gastroenterologiaSubtitle}>
            Especialistas en el <span className={styles.highlightText}>diagnóstico y tratamiento integral</span> de 
            enfermedades del sistema digestivo, mejorando la salud gastrointestinal de tu mascota con 
            tecnología avanzada y cuidado personalizado.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <FlaskConical className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h3 className={styles.introTitle}>Especialistas en Gastroenterología Veterinaria</h3>
              <p className={styles.introDescription}>
                La gastroenterología veterinaria se enfoca en el diagnóstico y tratamiento de enfermedades del 
                sistema digestivo. Nuestro equipo utiliza tecnología de vanguardia para ofrecer soluciones 
                efectivas y personalizadas para cada paciente.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <Sparkles className={styles.introDecorationIcon} />
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
                  <PawPrint className={styles.teamDecorationIcon} />
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
                <h3 className={styles.clinicalTitle}>Síntomas Gastrointestinales</h3>
                <p className={styles.clinicalDescription}>
                  Señales que pueden indicar problemas digestivos en tu mascota
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
              <Heart className={styles.clinicalDecorationIcon} />
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
                  Técnicas avanzadas para el diagnóstico preciso de enfermedades digestivas
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
              <Pill className={styles.clinicalDecorationIcon} />
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
                  <Sparkles className={styles.diseaseDecorationIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>¿Tu mascota tiene problemas digestivos?</h2>
            <p className={styles.ctaDescription}>
              No esperes más. Nuestros especialistas en gastroenterología veterinaria pueden ayudar a 
              diagnosticar y tratar los trastornos digestivos de tu mascota con precisión y cuidado.
            </p>
          </div>
   
          <div className={styles.ctaButtons}>
            <button 
              onClick={() => navigate("/agendamientoCitas")}
              className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            >
              <Calendar className={styles.ctaButtonIcon} />
              Agendar Consulta Digestiva
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
            Nuestros especialistas en gastroenterología cuentan con certificaciones internacionales y experiencia 
            en medicina digestiva avanzada para brindar el mejor cuidado a tu mascota
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gastroenterologia;
