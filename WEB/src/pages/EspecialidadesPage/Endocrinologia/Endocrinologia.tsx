import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  Activity, 
  Stethoscope, 
  TestTube, 
  Pill, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  PawPrint, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import styles from "./Endocrinologia.module.css";

const Endocrinologia: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    { 
      icon: TestTube,
      title: "Diagnóstico Avanzado",
      desc: "Perfiles hormonales completos y pruebas especializadas para detectar alteraciones endocrinas con precisión.",
      colorClass: "endocrinologia"
    },
    {
      icon: Pill,
      title: "Tratamiento Personalizado",
      desc: "Terapias de reemplazo hormonal y medicación específica adaptada a cada paciente.",
      colorClass: "endocrinologia"
    },
    {
      icon: ShieldCheck,
      title: "Seguimiento Integral",
      desc: "Control periódico y ajuste de dosis para mantener el equilibrio hormonal óptimo.",
      colorClass: "endocrinologia"
    },
  ];

  const diseases = [
    {
      title: "Síndrome de Cushing",
      description: "Exceso de producción de cortisol que puede causar aumento de sed y orina, jadeo excesivo, abdomen péndulo y problemas cutáneos.",
      icon: Activity,
      colorClass: "endocrinologia"
    },
    {
      title: "Diabetes Mellitus", 
      description: "Deficiencia de insulina que provoca aumento de glucosa en sangre, con síntomas como poliuria, polidipsia y pérdida de peso.",
      icon: TestTube,
      colorClass: "endocrinologia"
    },
    {
      title: "Síndrome de Addison",
      description: "Deficiencia de hormonas adrenales que puede causar vómitos, diarrea, debilidad y deshidratación severa.",
      icon: ShieldCheck,
      colorClass: "endocrinologia"
    },
    {
      title: "Hipertiroidismo",
      description: "Común en gatos mayores, causa pérdida de peso a pesar de aumento de apetito, hiperactividad y taquicardia.",
      icon: Heart,
      colorClass: "endocrinologia"
    }
  ];

  const symptoms = [
    "Aumento de peso",
    "Hiporexia (disminución del apetito)",
    "Alteraciones dermatológicas",
    "Alteraciones en el sistema inmune",
    "Dislipemias (alteraciones en lípidos sanguíneos)",
    "Cambios en el comportamiento",
    "Letargia y disminución de la actividad",
    "Intolerancia al frío"
  ];

  const diagnosticMethods = [
    "Perfiles hormonales completos",
    "Pruebas de estimulación/supresión",
    "Análisis de sangre y orina",
    "Ultrasonido endocrino",
    "Pruebas genéticas en razas predispuestas"
  ];

  return (
    <div className={styles.endocrinologiaContainer}>
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

      <div className={styles.endocrinologiaContent}>
        {/* Header Section */}
        <div className={`${styles.endocrinologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <Activity className={styles.headerIcon} />
            </div>
            <h1 className={styles.endocrinologiaTitle}>Endocrinología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.endocrinologiaSubtitle}>
            Especialistas en el <span className={styles.highlightText}>diagnóstico y tratamiento</span> de alteraciones 
            hormonales y metabólicas en pequeños animales, mejorando su calidad de vida 
            con atención personalizada y tecnología de vanguardia.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <TestTube className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>Excelencia en Endocrinología Veterinaria</h2>
              <p className={styles.introDescription}>
                La endocrinología veterinaria es una rama de la medicina interna que se focaliza 
                en el diagnóstico y tratamiento de todas las alteraciones hormonales y metabólicas. 
                El correcto funcionamiento del sistema endocrino es fundamental para preservar el 
                bienestar del organismo.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <TestTube className={styles.introDecorationIcon} />
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

        {/* Hipotiroidismo Section */}
        <div className={`${styles.clinicalGrid} ${isVisible ? styles.visible : ''}`}>
          <div className={`${styles.clinicalCard} ${styles.symptomsCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <Activity className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Hipotiroidismo Canino</h3>
              </div>

              <p className={styles.clinicalDescription}>
                La enfermedad endocrina más frecuente en caninos. Síntomas principales:
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
                  <TestTube className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Métodos de Diagnóstico</h3>
              </div>

              <p className={styles.clinicalDescription}>
                Utilizamos tecnología avanzada para diagnósticos precisos:
              </p>

              <div className={styles.diagnosticList}>
                {diagnosticMethods.map((method, index) => (
                  <div key={index} className={styles.diagnosticItem}>
                    <h4 className={styles.diagnosticTitle}>{method}</h4>
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
              ¿Notas algún síntoma endocrino en tu mascota?
            </h3>
            <p className={styles.ctaDescription}>
              No esperes más. Agenda una consulta con nuestro equipo especializado en endocrinología 
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
            Nuestros especialistas en endocrinología cuentan con certificaciones internacionales y años de experiencia
          </p>
        </div>
      </div>
    </div>
  );
};

export default Endocrinologia;