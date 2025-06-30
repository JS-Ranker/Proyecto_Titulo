import React, { useEffect, useState } from 'react';
import { 
  Beef, 
  Activity, 
  TestTube, 
  Calendar, 
  Sparkles,
  PawPrint,
  ArrowRight,
  Clock,
  Stethoscope,
  Users,
  Award,
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
      icon: Award,
      title: "Especialistas Certificados",
      desc: "Veterinarios especialistas en gastroenterología con años de experiencia en diagnóstico y tratamiento de enfermedades digestivas.",
      colorClass: "gastroenterologia"
    },
    {
      icon: Users,
      title: "Equipo Multidisciplinario",
      desc: "Colaboración entre gastroenterólogos, nutricionistas y técnicos especializados para un cuidado integral del sistema digestivo.",
      colorClass: "gastroenterologia"
    },
    {
      icon: Stethoscope,
      title: "Atención Personalizada",
      desc: "Planes de tratamiento y dietas específicas adaptadas a las necesidades digestivas particulares de cada paciente.",
      colorClass: "gastroenterologia"
    },
  ];

  const clinicalSymptoms = [
    "Vómitos frecuentes o persistentes",
    "Diarrea crónica o con sangre", 
    "Pérdida de apetito prolongada",
    "Pérdida de peso inexplicable",
    "Abdomen hinchado o doloroso",
    "Cambios en la consistencia de heces",
    "Dificultad para defecar o estreñimiento",
    "Flatulencias excesivas",
    "Salivación excesiva",
    "Deglución dificultosa",
    "Regurgitación de alimento"
  ];  
 
  const diagnosticProcedures = [
    {
      title: "Endoscopía Digestiva",
      desc: "Visualización directa del tracto digestivo para identificar lesiones, inflamaciones y tomar biopsias con precisión diagnóstica."
    },
    {
      title: "Estudios de Imagen",
      desc: "Radiografías con contraste, ecografías abdominales y tomografías para evaluar la estructura y función del sistema digestivo."
    },
    {
      title: "Análisis Especializados",
      desc: "Coprológicos, parasitológicos y análisis de sangre específicos para evaluar la función digestiva y absorción de nutrientes."
    }
  ];

  const diseases = [
    {
      title: "Enfermedad Inflamatoria Intestinal",
      description: "Condición crónica que causa inflamación del tracto digestivo, afectando la absorción de nutrientes y causando síntomas digestivos persistentes.",
      icon: Activity,
      colorClass: "gastroenterologia"
    },
    {
      title: "Pancreatitis",
      description: "Inflamación del páncreas que puede ser aguda o crónica, afectando la digestión y producción de enzimas digestivas esenciales.",
      icon: FlaskConical,
      colorClass: "gastroenterologia"
    },
    {
      title: "Gastritis Crónica",
      description: "Inflamación persistente del estómago que puede causar dolor, vómitos y problemas de digestión, requiriendo manejo dietético especializado.",
      icon: Beef,
      colorClass: "gastroenterologia"
    },
    {
      title: "Síndrome de Malabsorción",
      description: "Alteración en la capacidad de absorber nutrientes, vitaminas y minerales, causando desnutrición y problemas metabólicos.",
      icon: TestTube,
      colorClass: "gastroenterologia"
    }
  ];

  return (
    <div className={styles.gastroenterologiaContainer}>
      {/* Decorative Background Elements */}
      <div className={styles.decorativeBg}>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration1}`}>
          <Beef className={styles.bgDecorationIcon} />
        </div>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration2}`}>
          <PawPrint className={styles.bgDecorationIcon} />
        </div>
        <div className={`${styles.bgDecoration} ${styles.bgDecoration3}`}>
          <Activity className={styles.bgDecorationIcon} />
        </div>
      </div>

      <div className={styles.gastroenterologiaContent}>
        {/* Header Section */}
        <div className={`${styles.gastroenterologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <Beef className={styles.headerIcon} />
            </div>
            <h1 className={styles.gastroenterologiaTitle}>Gastroenterología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.gastroenterologiaSubtitle}>
            Especializados en la <span className={styles.highlightText}>salud digestiva</span> de tu mascota.
            Un sistema digestivo saludable es fundamental para el bienestar general, 
            la absorción adecuada de nutrientes y la calidad de vida de tu compañero.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <Beef className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>Excelencia en Gastroenterología Veterinaria</h2>
              <p className={styles.introDescription}>
                Combinamos diagnósticos avanzados con tratamientos especializados 
                para abordar problemas digestivos complejos, utilizando tecnología 
                de vanguardia y planes nutricionales personalizados para restaurar la salud digestiva.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <Beef className={styles.introDecorationIcon} />
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
                Mantente atento a estos signos que pueden indicar problemas digestivos:
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
                Utilizamos técnicas especializadas para diagnósticos gastroenterológicos precisos:
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
              ¿Notas problemas digestivos en tu mascota?
            </h3>
            <p className={styles.ctaDescription}>
              No esperes más. Agenda una consulta con nuestro equipo especializado en gastroenterología 
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
            Nuestros especialistas en gastroenterología cuentan con certificaciones internacionales y experiencia en medicina digestiva avanzada
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gastroenterologia;
