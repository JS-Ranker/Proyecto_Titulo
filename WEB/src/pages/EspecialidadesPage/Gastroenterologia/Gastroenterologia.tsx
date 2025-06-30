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
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
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
=======
const Gastroenterologia = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>GASTROENTEROLOGÍA VETERINARIA</h1>

      <div className={styles.content}>
        <div className={styles.textSection}>
          <p className={styles.intro}>
            La gastroenterología veterinaria es la especialidad médica que se
            enfoca en el diagnóstico y tratamiento de las enfermedades del
            sistema digestivo en animales. Desde la boca hasta el colon, esta
            especialidad aborda problemas como vómitos, diarreas, enfermedades
            inflamatorias intestinales, obstrucciones y trastornos hepáticos o
            pancreáticos.
          </p>

          <p className={styles.description}>
            Los trastornos gastrointestinales son una de las causas más
            frecuentes de consulta veterinaria. Pueden ser agudos o crónicos, y
            su origen puede ser infeccioso, parasitario, alérgico, metabólico o
            neoplásico. Un diagnóstico preciso y un tratamiento temprano son
            fundamentales para prevenir complicaciones y garantizar la
            recuperación de la salud digestiva de nuestras mascotas.
          </p>
        </div>

        <div className={styles.imageSection}>
          <img
            src="src/assets/images/EspecialidadesPage/Gastroenterologia/gastroenterologia.jpg"
            alt="Gastroenterología veterinaria"
            className={styles.image}
          />
>>>>>>> 4040c22b3f7b93af6815519bae4191b9d70c2f8f
        </div>
      </div>

      {/* Sección de Enfermedad Inflamatoria Intestinal */}
      <div className={styles.diseaseSection}>
        <h2 className={styles.sectionTitle}>
          Enfermedad Inflamatoria Intestinal (EII)
        </h2>
        <div className={styles.diseaseContent}>
          <div className={styles.diseaseText}>
            <p>
              La EII es un trastorno crónico caracterizado por la infiltración
              de células inflamatorias en la pared del tracto gastrointestinal.
              Es una de las causas más comunes de problemas digestivos crónicos
              en perros y gatos, especialmente en razas predispuestas como el
              Pastor Alemán, Boxer o el Gato Siames.
            </p>
            <p>Los síntomas pueden incluir:</p>
            <ul className={styles.symptomsList}>
              <li>Diarrea crónica (intermitente o persistente)</li>
              <li>Vómitos recurrentes</li>
              <li>Pérdida de peso progresiva</li>
              <li>Disminución del apetito</li>
              <li>Heces con moco o sangre</li>
              <li>Dolor abdominal</li>
              <li>Letargia</li>
            </ul>
          </div>
          <div className={styles.diseaseImage}>
            <img
              src="src/assets/images/EspecialidadesPage/Gastroenterologia/eii.jpg"
              alt="Enfermedad inflamatoria intestinal en mascotas"
              className={styles.image}
            />
          </div>
        </div>
      </div>

      {/* Sección de otras enfermedades gastrointestinales */}
      <div className={styles.otherDiseases}>
        <h2 className={styles.sectionTitle}>
          Otras Enfermedades Gastrointestinales
        </h2>

        <div className={styles.diseaseCards}>
          <div className={styles.diseaseCard}>
            <h3>Pancreatitis</h3>
            <p>
              Inflamación del páncreas que puede ser aguda o crónica. Causa
              dolor abdominal intenso, vómitos y deshidratación. Más común en
              perros pequeños con dietas altas en grasas.
            </p>
          </div>

          <div className={styles.diseaseCard}>
            <h3>Gastritis</h3>
            <p>
              Inflamación del estómago que provoca vómitos agudos. Puede ser
              causada por ingestión de cuerpos extraños, toxinas, infecciones o
              alergias alimentarias.
            </p>
          </div>

          <div className={styles.diseaseCard}>
            <h3>Enteritis Parasitaria</h3>
            <p>
              Infección por parásitos intestinales como giardias, coccidios o
              gusanos. Causa diarrea, pérdida de peso y en casos graves,
              desnutrición.
            </p>
          </div>

          <div className={styles.diseaseCard}>
            <h3>Obstrucción Intestinal</h3>
            <p>
              Bloqueo mecánico del intestino por cuerpos extraños, tumores o
              invaginaciones. Emergencia quirúrgica que causa vómitos, dolor y
              ausencia de defecación.
            </p>
          </div>
        </div>
      </div>

      {/* Sección de diagnóstico y tratamiento */}
      <div className={styles.diagnosticSection}>
        <h2 className={styles.sectionTitle}>Diagnóstico y Tratamiento</h2>
        <div className={styles.diagnosticContent}>
          <div className={styles.diagnosticMethods}>
            <h3>Métodos de Diagnóstico</h3>
            <ul>
              <li>Análisis de sangre completos (hemograma, bioquímica)</li>
              <li>Ecografía abdominal</li>
              <li>Endoscopia con biopsias</li>
              <li>Radiografías simples y contrastadas</li>
              <li>Análisis coprológicos y pruebas parasitarias</li>
              <li>Pruebas específicas (TLI, folatos, cobalamina)</li>
            </ul>
          </div>
          <div className={styles.treatmentMethods}>
            <h3>Opciones de Tratamiento</h3>
            <ul>
              <li>
                Dietas especiales (hipoalergénicas, bajas en grasas, etc.)
              </li>
              <li>
                Terapia farmacológica (antiinflamatorios, inmunosupresores)
              </li>
              <li>Tratamiento antiparasitario específico</li>
              <li>Probióticos y prebióticos</li>
              <li>Cirugía en casos de obstrucción o neoplasias</li>
              <li>Fluidoterapia y soporte nutricional</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Llamado a la acción */}
      <div className={styles.ctaSection}>
        <h2>¿Tu mascota tiene problemas digestivos?</h2>
        <p>
          Nuestros especialistas en gastroenterología veterinaria pueden ayudar
          a diagnosticar y tratar los trastornos gastrointestinales de tu
          compañero peludo con las técnicas más avanzadas.
        </p>
        <button className={styles.ctaButton} onClick={() => navigate("/agendamientoCitas")}>Reservar Consulta</button>
      </div>
    </div>
  );
};

export default Gastroenterologia;
