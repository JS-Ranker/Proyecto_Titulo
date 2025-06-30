import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Activity, 
  TestTube, 
  Pill, 
  Calendar, 
  Sparkles,
  PawPrint,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import styles from "./Oncologia.module.css";

const Oncologia: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    {
      icon: TestTube,
      title: "Diagnóstico Especializado",
      desc: "Biopsias, citologías y estudios histopatológicos para diagnósticos precisos de tumores y lesiones oncológicas.",
      colorClass: "oncologia"
    }, 
    {
      icon: Pill,
      title: "Tratamiento Integral",
      desc: "Quimioterapia, cirugía oncológica y terapias de apoyo adaptadas a cada caso particular.",
      colorClass: "oncologia"
    },
    {
      icon: Shield,
      title: "Cuidado Paliativo",
      desc: "Control del dolor y cuidados de soporte para mejorar la calidad de vida durante el tratamiento.",
      colorClass: "oncologia"
    },
  ];

  const clinicalSymptoms = [
    "Masas o bultos palpables",
    "Pérdida de peso inexplicable", 
    "Pérdida de apetito persistente",
    "Letargo y debilidad general",
    "Sangrado anormal o hemorragias",
    "Dificultad para comer o tragar",
    "Cambios en hábitos de defecación",
    "Cojera persistente sin causa aparente",
    "Hinchazón abdominal",
    "Respiración dificultosa",
    "Vómitos frecuentes"
  ];

  const diagnosticProcedures = [
    {
      title: "Biopsia y Citología",
      desc: "Análisis microscópico de tejidos y células para confirmar la presencia de células cancerosas y determinar el tipo de tumor."
    },
    {
      title: "Estudios de Imagen",
      desc: "Radiografías, ecografías y tomografías para evaluar la extensión del tumor y detectar posibles metástasis."
    },
    {
      title: "Análisis de Sangre",
      desc: "Hemogramas completos y marcadores tumorales para evaluar el estado general del paciente y la respuesta al tratamiento."
    }
  ];

  const diseases = [
    {
      title: "Linfoma",
      description: "Cáncer del sistema linfático que puede afectar ganglios, bazo, hígado y otros órganos. Es uno de los tumores más comunes en perros y gatos.",
      icon: Activity,
      colorClass: "oncologia"
    },
    {
      title: "Osteosarcoma",
      description: "Tumor óseo agresivo que afecta principalmente a perros de razas grandes. Requiere tratamiento inmediato y multidisciplinario.",
      icon: Zap,
      colorClass: "oncologia"
    },
    {
      title: "Mastocitoma",
      description: "Tumor de piel común en perros que puede variar desde lesiones benignas hasta formas muy agresivas con potencial metastásico.",
      icon: Shield,
      colorClass: "oncologia"
    },
    {
      title: "Carcinoma Mamario",
      description: "Tumor frecuente en hembras no esterilizadas. La detección temprana y cirugía son fundamentales para el pronóstico.",
      icon: TestTube,
      colorClass: "oncologia"
    }
  ];

  return (
    <div className={styles.oncologiaContainer}>
      {/* Decorative Background Elements */}
      <div className={styles.decorativeBg}>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration1}`}>
          <Shield className={styles.bgDecorationIcon} />
        </div>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration2}`}>
          <PawPrint className={styles.bgDecorationIcon} />
        </div>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration3}`}>
          <Activity className={styles.bgDecorationIcon} />
        </div>
      </div>

      <div className={styles.oncologiaContent}>
        {/* Header Section */}
        <div className={`${styles.oncologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <Shield className={styles.headerIcon} />
            </div>
            <h1 className={styles.oncologiaTitle}>Oncología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.oncologiaSubtitle}>
            Especialistas en el <span className={styles.highlightText}>diagnóstico y tratamiento</span> de cáncer en mascotas.
            La detección temprana y el tratamiento especializado pueden marcar la diferencia en la 
            lucha contra el cáncer, ofreciendo esperanza y calidad de vida.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <Shield className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>Excelencia en Oncología Veterinaria</h2>
              <p className={styles.introDescription}>
                Nuestro equipo especializado combina experiencia clínica avanzada con tecnología 
                de vanguardia para ofrecer diagnósticos precisos y tratamientos personalizados 
                en oncología veterinaria, siempre priorizando el bienestar y comfort de tu mascota.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <Shield className={styles.introDecorationIcon} />
            </div>
          </div>
        </div>

        {/* Team Grid */}
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

        {/* Clinical Information Grid */}
        <div className={`${styles.clinicalGrid} ${isVisible ? styles.visible : ''}`}>
          {/* Symptoms Card */}
          <div className={`${styles.clinicalCard} ${styles.symptomsCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <Activity className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Síntomas de Alerta</h3>
              </div>

              <p className={styles.clinicalDescription}>
                Mantente atento a estos signos que pueden indicar problemas oncológicos:
              </p>

              <div className={styles.symptomsList}>
                {clinicalSymptoms.map((symptom, index) => (
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

          {/* Diagnostic Card */}
          <div className={`${styles.clinicalCard} ${styles.diagnosticCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <TestTube className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Procedimientos de Diagnóstico</h3>
              </div>

              <p className={styles.clinicalDescription}>
                Utilizamos técnicas especializadas para diagnósticos oncológicos precisos:
              </p>

              <div className={styles.diagnosticList}>
                {diagnosticProcedures.map((procedure, index) => (
                  <div key={index} className={styles.diagnosticItem}>
                    <h4 className={styles.diagnosticTitle}>{procedure.title}</h4>
                    <p className={styles.diagnosticDesc}>{procedure.desc}</p>
                  </div>
                ))}
              </div>

              <div className={styles.clinicalDecoration}>
                <TestTube className={styles.clinicalDecorationIcon} />
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
              ¿Detectaste algún síntoma oncológico en tu mascota?
            </h3>
            <p className={styles.ctaDescription}>
              No esperes más. Agenda una consulta con nuestro equipo especializado en oncología 
              o solicita una videoconsulta de urgencia para una evaluación inmediata.
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
            Nuestros especialistas en oncología cuentan con certificaciones internacionales y experiencia en tratamientos oncológicos avanzados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Oncologia;
