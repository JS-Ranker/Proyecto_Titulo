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
  ShieldCheck
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
      title: "Diagnóstico Precoz",
      desc: "Biopsias, análisis citológicos y marcadores tumorales para detección temprana del cáncer.",
      colorClass: "oncologia"
    },
    {
      icon: Pill,
      title: "Tratamiento Multidisciplinario",
      desc: "Quimioterapia, radioterapia y cirugía oncológica con protocolos personalizados.",
      colorClass: "oncologia"
    },
    {
      icon: ShieldCheck,
      title: "Cuidados Paliativos",
      desc: "Manejo del dolor y mejora de la calidad de vida durante el tratamiento.",
      colorClass: "oncologia"
    },
  ];

  const cancerTypes = [
    {
      title: "Linfoma",
      description: "Cáncer del sistema linfático, uno de los más comunes en perros y gatos. Puede afectar múltiples órganos.",
      icon: Activity,
      colorClass: "oncologia"
    },
    {
      title: "Tumor de Mastocitos", 
      description: "Neoplasia cutánea frecuente en perros que puede presentar diferentes grados de malignidad.",
      icon: TestTube,
      colorClass: "oncologia"
    },
    {
      title: "Sarcoma",
      description: "Tumor maligno del tejido conectivo que puede aparecer en diferentes localizaciones.",
      icon: ShieldCheck,
      colorClass: "oncologia"
    },
    {
      title: "Carcinoma Mamario",
      description: "Muy común en hembras no esterilizadas, especialmente en perras de edad avanzada.",
      icon: Heart,
      colorClass: "oncologia"
    }
  ];

  const symptoms = [
    "Masas o bultos palpables",
    "Pérdida de peso progresiva",
    "Cambios en el apetito",
    "Dificultad para respirar",
    "Sangrado anormal",
    "Cojera persistente",
    "Vómitos o diarrea recurrentes",
    "Letargia y debilidad"
  ];

  const treatmentMethods = [
    "Cirugía oncológica especializada",
    "Quimioterapia adaptada",
    "Radioterapia dirigida",
    "Inmunoterapia",
    "Cuidados paliativos integrales"
  ];

  return (
    <div className={styles.oncologiaContainer}>
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

      <div className={styles.oncologiaContent}>
        {/* Header Section */}
        <div className={`${styles.oncologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <Activity className={styles.headerIcon} />
            </div>
            <h1 className={styles.oncologiaTitle}>Oncología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <Sparkles className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.oncologiaSubtitle}>
            Especialistas en el <span className={styles.highlightText}>diagnóstico temprano y tratamiento integral</span> del 
            cáncer en pequeños animales, brindando esperanza y calidad de vida con tecnología de vanguardia 
            y un enfoque compasivo.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <TestTube className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h3 className={styles.introTitle}>Especialistas en Oncología Veterinaria</h3>
              <p className={styles.introDescription}>
                La oncología veterinaria requiere un enfoque multidisciplinario para el diagnóstico, tratamiento y 
                seguimiento del cáncer en mascotas. Nuestro equipo combina experiencia clínica con tecnología 
                de vanguardia para brindar la mejor atención oncológica.
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
                <h3 className={styles.clinicalTitle}>Señales de Alerta del Cáncer</h3>
                <p className={styles.clinicalDescription}>
                  Reconoce los síntomas que pueden indicar la presencia de cáncer en tu mascota
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
                <h3 className={styles.clinicalTitle}>Métodos de Tratamiento</h3>
                <p className={styles.clinicalDescription}>
                  Opciones terapéuticas avanzadas para el manejo integral del cáncer
                </p>
              </div>
              
              <ul className={styles.diagnosticList}>
                {treatmentMethods.map((method, index) => (
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

        {/* Cancer Types Grid */}
        <div className={`${styles.diseasesGrid} ${isVisible ? styles.visible : ''}`}>
          {cancerTypes.map((cancer, index) => (
            <div key={index} className={`${styles.diseaseCard} ${styles[`diseaseCard-${index}`]}`}>
              <div className={styles.diseaseCardBg}></div>
              <div className={styles.diseaseCardContent}>
                <div className={styles.diseaseIconContainer}>
                  <cancer.icon className={styles.diseaseMainIcon} />
                </div>
                <h3 className={styles.diseaseTitle}>{cancer.title}</h3>
                <p className={styles.diseaseDescription}>{cancer.description}</p>
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
            <h2 className={styles.ctaTitle}>¿Sospechas que tu mascota puede tener cáncer?</h2>
            <p className={styles.ctaDescription}>
              La detección temprana es clave para un tratamiento exitoso. Nuestros especialistas en oncología 
              veterinaria están listos para evaluar a tu mascota con compasión y profesionalismo.
            </p>
          </div>
   
          <div className={styles.ctaButtons}>
            <button 
              onClick={() => navigate("/agendamientoCitas")}
              className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            >
              <Calendar className={styles.ctaButtonIcon} />
              Agendar Consulta Oncológica
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
            Nuestros especialistas en oncología veterinaria cuentan con certificaciones internacionales y experiencia 
            en el tratamiento del cáncer con enfoques tanto curativos como paliativos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Oncologia;
