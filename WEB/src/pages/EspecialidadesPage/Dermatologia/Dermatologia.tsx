import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TestTube, 
  Pill, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Stethoscope, 
  PawPrint, 
  Calendar, 
  Video, 
  Microscope,
  ArrowLeft
} from 'lucide-react';
import styles from './Dermatologia.module.css';

const Dermatologia: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamFeatures = [
    { 
      icon: Microscope,
      title: "Diagnóstico Dermatológico",
      desc: "Análisis microscópicos, cultivos y biopsias cutáneas para diagnóstico preciso de enfermedades de la piel.",
      colorClass: "dermatologia"
    },
    {
      icon: Pill,
      title: "Tratamiento Especializado",
      desc: "Terapias tópicas, sistémicas e inmunomoduladoras para diversas patologías dermatológicas.",
      colorClass: "dermatologia"
    },
    {
      icon: ShieldCheck,
      title: "Cuidado Preventivo",
      desc: "Protocolos de higiene y prevención para mantener la salud cutánea de tu mascota.",
      colorClass: "dermatologia"
    },
  ];

  const diseases = [
    {
      title: "Dermatitis Atópica",
      description: "Inflamación crónica de la piel causada por alergias ambientales, común en perros con predisposición genética.",
      icon: Activity,
      colorClass: "dermatologia"
    },
    {
      title: "Infecciones Fúngicas", 
      description: "Hongos como Malassezia o dermatofitos que causan irritación, picazón y lesiones cutáneas características.",
      icon: Microscope,
      colorClass: "dermatologia"
    },
    {
      title: "Pioderma",
      description: "Infecciones bacterianas de la piel que pueden ser superficiales o profundas, requiriendo tratamiento antibiótico específico.",
      icon: TestTube,
      colorClass: "dermatologia"
    },
    {
      title: "Alopecia Hormonal",
      description: "Pérdida de pelo relacionada con desbalances hormonales, especialmente común en perros de edad media.",
      icon: Heart,
      colorClass: "dermatologia"
    }
  ];

  const symptoms = [
    "Picazón excesiva (prurito)",
    "Enrojecimiento de la piel",
    "Descamación o caspa",
    "Pérdida de pelo anormal",
    "Lesiones cutáneas",
    "Mal olor en la piel",
    "Cambios en pigmentación",
    "Engrosamiento de la piel"
  ];

  const diagnosticMethods = [
    "Examen dermatológico completo",
    "Raspado cutáneo",
    "Cultivos bacterianos y fúngicos",
    "Biopsias de piel",
    "Pruebas de alergia"
  ];

  return (
    <div className={styles.dermatologiaContainer}>
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

      <div className={styles.dermatologiaContent}>
        {/* Header Section */}
        <div className={`${styles.dermatologiaHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIconContainer}>
              <Microscope className={styles.headerIcon} />
            </div>
            <h1 className={styles.dermatologiaTitle}>Dermatología Veterinaria</h1>
            <div className={styles.headerIconContainer}>
              <ShieldCheck className={styles.headerIcon} />
            </div>
          </div>
          
          <div className={styles.titleDivider}></div>
          
          <p className={styles.dermatologiaSubtitle}>
            Especialistas en el <span className={styles.highlightText}>cuidado y tratamiento</span> de 
            enfermedades de la piel, pelo y uñas, devolviendo el bienestar y la salud cutánea 
            a tu mascota con tecnología especializada.
          </p>
        </div>

        {/* Introduction Card */}
        <div className={`${styles.introSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.introCard}>
            <div className={styles.introIconContainer}>
              <Microscope className={styles.introMainIcon} />
            </div>
            <div className={styles.introContent}>
              <h3 className={styles.introTitle}>Salud Dermatológica Integral</h3>
              <p className={styles.introDescription}>
                La piel es el órgano más grande del cuerpo y requiere cuidado especializado. 
                Nuestros dermatólogos veterinarios diagnostican y tratan desde alergias simples 
                hasta enfermedades autoinmunes complejas, garantizando el confort y bienestar de tu mascota.
              </p>
            </div>
            <div className={styles.introDecoration}>
              <PawPrint className={styles.introDecorationIcon} />
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
                <h3 className={styles.clinicalTitle}>Síntomas a Observar</h3>
                <p className={styles.clinicalDescription}>
                  Signos que pueden indicar problemas dermatológicos en tu mascota
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
              <Microscope className={styles.clinicalDecorationIcon} />
            </div>
          </div>

          <div className={`${styles.clinicalCard} ${styles.treatmentCard}`}>
            <div className={styles.clinicalCardBg}></div>
            
            <div className={styles.clinicalCardContent}>
              <div className={styles.clinicalHeader}>
                <div className={styles.clinicalIconContainer}>
                  <TestTube className={styles.clinicalMainIcon} />
                </div>
                <h3 className={styles.clinicalTitle}>Métodos Diagnósticos</h3>
                <p className={styles.clinicalDescription}>
                  Técnicas avanzadas para diagnóstico dermatológico preciso
                </p>
              </div>
              
              <ul className={styles.treatmentList}>
                {diagnosticMethods.map((method, index) => (
                  <li key={index} className={styles.treatmentItem}>
                    <h4 className={styles.treatmentTitle}>{method}</h4>
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
                  <PawPrint className={styles.diseaseDecorationIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              ¿Tu mascota presenta problemas de piel?
            </h3>
            <p className={styles.ctaDescription}>
              No esperes más. Los problemas dermatológicos pueden empeorar rápidamente. 
              Agenda una consulta con nuestros especialistas para un diagnóstico preciso.
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
                <h3 className={styles.clinicalTitle}>Síntomas Dermatológicos</h3>
                <p className={styles.clinicalDescription}>
                  Signos que pueden indicar problemas en la piel de tu mascota
                </p>
              </div>
              <ul className={styles.symptomsList}>
                {symptoms.map((symptom, index) => (
                  <li key={index} className={styles.symptomItem}>
                    <span className={styles.symptomBullet}></span>
                    {symptom}
                  </li>
                ))}
              </ul>
              <div className={styles.clinicalDecoration}>
                <Heart className={styles.clinicalDecorationIcon} />
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
                <h3 className={styles.clinicalTitle}>Métodos Diagnósticos</h3>
                <p className={styles.clinicalDescription}>
                  Herramientas especializadas para identificar patologías cutáneas
                </p>
              </div>
              <ul className={styles.diagnosticList}>
                {diagnosticMethods.map((method, index) => (
                  <li key={index} className={styles.diagnosticItem}>
                    <span className={styles.diagnosticTitle}>{method}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.clinicalDecoration}>
                <Microscope className={styles.clinicalDecorationIcon} />
              </div>
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
                  <PawPrint className={styles.diseaseDecorationIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`${styles.ctaSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              ¿Tu mascota presenta problemas en la piel?
            </h3>
            <p className={styles.ctaDescription}>
              No esperes más. Los problemas dermatológicos pueden empeorar sin tratamiento adecuado. 
              Nuestros especialistas están listos para ayudar.
            </p>
          </div>
   
          <div className={styles.ctaButtons}>
            <button 
              onClick={() => navigate("/agendamientoCitas")}
              className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            >
              <Calendar className={styles.ctaButtonIcon} />
              Agendar Consulta Dermatológica
            </button>

            <button 
              onClick={() => navigate("/videoConsulta")}
              className={`${styles.ctaButton} ${styles.ctaSecondary}`}
            >
              <Video className={styles.ctaButtonIcon} />
              Consulta Virtual
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
            Nuestros dermatólogos veterinarios cuentan con certificaciones internacionales y experiencia 
            en el manejo de enfermedades cutáneas complejas y terapias avanzadas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dermatologia;
