import React, { useEffect, useState } from "react";
import {
  HeartPulse,
  Stethoscope,
  PawPrint,
  Users,
  Award,
  Heart,
  Calendar,
  Clock,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import styles from "./Cardiologia.module.css";
import { useNavigate } from "react-router-dom";  const team = [
    {
      icon: Award,
      title: "Veterinarios Certificados",
      desc: "Especialistas en cardiología veterinaria con años de experiencia y certificaciones internacionales.",
      colorClass: "cardiologia"
    }, 
    {
      icon: Users,
      title: "Equipo Multidisciplinario",
      desc: "Colaboración entre médicos, técnicos y asistentes para un cuidado integral y personalizado.",
      colorClass: "cardiologia"
    },
    { 
      icon: Heart,
      title: "Atención Personalizada",
      desc: "Cada paciente es único y recibe un plan de tratamiento adaptado a sus necesidades específicas.",
      colorClass: "cardiologia"
    },
  ];

const symptoms = [
  "Tos persistente o nocturna",
  "Respiración dificultosa (disnea)",
  "Abdomen hinchado o distendido",
  "Colapso o episodios de desmayo",
  "Debilidad y fatiga excesiva",
  "Inquietud o ansiedad",
  "Baja tolerancia al ejercicio",
  "Cambios de comportamiento",
  "Actitud deprimida o retraída",
  "Pérdida de apetito",
  "Cambios de peso repentinos"
];

const diagnosticProcedures = [
  {
    title: "Análisis completo de sangre",
    desc: "Ayuda a definir causas cardíacas y extracardiacas del funcionamiento anormal del corazón, evaluando marcadores específicos."
  },
  {
    title: "Electrocardiografía (ECG)",
    desc: "Permite el análisis detallado del ritmo cardíaco y detectar problemas eléctricos del corazón con precisión."
  },
  {
    title: "Ecocardiografía Doppler",
    desc: "Estudio dinámico del funcionamiento cardíaco, evaluando la integridad estructural y el flujo sanguíneo en tiempo real."
  }
];

const Cardiologia: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
            El cuidado del <span className={styles.highlightText}>corazón de tu mascota</span> es nuestra prioridad.
            La detección temprana de enfermedades cardíacas puede mejorar significativamente 
            el pronóstico y la calidad de vida de tu compañero fiel.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <Stethoscope className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>Excelencia en Cardiología Veterinaria</h2>
              <p className={styles.introDescription}>
                Combinamos tecnología de vanguardia con un equipo humano apasionado 
                para ofrecer diagnósticos precisos y tratamientos de excelencia en 
                cardiología veterinaria, siempre con el bienestar de tu mascota como prioridad.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <Stethoscope className={styles.introDecorationIcon} />
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className={`${styles.teamGrid} ${isVisible ? styles.visible : ''}`}>
          {team.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <div
                key={index}
                className={`${styles.teamCard} ${styles.teamCard}-${index} ${styles[member.colorClass]}`}
              >
                <div className={styles.teamCardBg}></div>
                
                <div className={styles.teamCardContent}>
                  {/* Icon */}
                  <div className={styles.teamIconContainer}>
                    <IconComponent className={styles.teamMainIcon} />
                  </div>

                  {/* Content */}
                  <h2 className={styles.teamTitle}>{member.title}</h2>
                  
                  <p className={styles.teamDescription}>{member.desc}</p>

                  {/* Decorative Element */}
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
                  <HeartPulse className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Síntomas de Alerta</h3>
              </div>

              <p className={styles.clinicalDescription}>
                Mantente atento a estos signos que pueden indicar problemas cardíacas:
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
                <HeartPulse className={styles.clinicalDecorationIcon} />
              </div>
            </div>
          </div>

          {/* Diagnostic Card */}
          <div className={`${styles.clinicalCard} ${styles.diagnosticCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <Activity className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Procedimientos de Diagnóstico</h3>
              </div>

              <p className={styles.clinicalDescription}>
                Utilizamos tecnología avanzada para diagnósticos precisos:
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
                <Activity className={styles.clinicalDecorationIcon} />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              ¿Notas algún síntoma en tu mascota?
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