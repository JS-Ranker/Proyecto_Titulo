import { useEffect, useState } from "react";
import {
  FaPaw,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaArrowLeft, 
  FaArrowRight, 
  FaCheck,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { citasService } from "../../services/citas";
import { mascotasService } from "../../services/mascotas";
import { tiposConsultaService, TipoConsulta } from "../../services/tipos_consultas";
import { veterinariosService, Veterinario } from "../../services/veterinario";
import styles from "./AgendamientoCitas.module.css";

const AgendamientoCitas = () => {
  const [step, setStep] = useState<number>(1);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [motivo, setMotivo] = useState<string>("");
  const [notasPrevias, setNotasPrevias] = useState<string>("");
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState<number | null>(
    null
  );
  const [selectedMascota, setSelectedMascota] = useState<any | null>(null);
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsulta[]>([]);
  const [selectedTipoConsulta, setSelectedTipoConsulta] = useState<TipoConsulta | null>(null);
  const [, setVeterinarios] = useState<Veterinario[]>([]);
  const [selectedVeterinario, setSelectedVeterinario] = useState<Veterinario | null>(null);

  const navigate = useNavigate();

  // Obtener usuario logueado y verificar autenticación
  const getCurrentUser = () => {
    try {
      // Verificar ambas claves - dar prioridad a currentUser si tiene datos completos
      let currentUserData = localStorage.getItem("currentUser");
      let happypetUserData = localStorage.getItem("happypet_user");
      
      let storedUser = null;
      
      // Si currentUser tiene datos completos (más que solo RUT), usarlo
      if (currentUserData && currentUserData !== "null" && currentUserData !== "undefined" && currentUserData !== "{}") {
        try {
          const parsedCurrentUser = JSON.parse(currentUserData);
          if (parsedCurrentUser && parsedCurrentUser.rut && Object.keys(parsedCurrentUser).length > 1) {
            storedUser = currentUserData;
          }
        } catch (e) {
          // Error parseando currentUser, continuar con happypet_user
        }
      }
      
      // Si no hay datos completos en currentUser, usar happypet_user
      if (!storedUser && happypetUserData && happypetUserData !== "null" && happypetUserData !== "undefined" && happypetUserData !== "{}") {
        storedUser = happypetUserData;
      }
      
      if (!storedUser) {
        return null;
      }
      
      const parsedUser = JSON.parse(storedUser);
      
      // Verificar que el usuario tenga las propiedades mínimas necesarias
      if (!parsedUser || !parsedUser.rut) {
        return null;
      }
      
      return parsedUser;
    } catch (error) {
      // Si hay error al parsear, limpiar localStorage
      localStorage.removeItem("currentUser");
      localStorage.removeItem("happypet_user");
      return null;
    }
  };

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const isAuthenticated = currentUser !== null;

  // useEffect para monitorear cambios en la autenticación
  useEffect(() => {
    const checkAuthStatus = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    // Verificar estado inicial
    checkAuthStatus();

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser" || e.key === "happypet_user") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Verificar periódicamente (para cambios en la misma pestaña)
    const interval = setInterval(checkAuthStatus, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Si no está autenticado, mostrar pantalla de autenticación
  if (!isAuthenticated || !currentUser) {
    return (
      <div className={styles.container}>
        <div className={styles.authRequired}>
          <div className={styles.authIcon}>
            <FaLock />
          </div>
          <h2 className={styles.authTitle}>Acceso Requerido</h2>
          <p className={styles.authMessage}>
            Para agendar una cita veterinaria necesitas iniciar sesión o registrarte en nuestra plataforma.
            <br />
            Una vez autenticado, podrás agendar citas para tus mascotas de forma rápida y sencilla.
          </p>
          <div className={styles.authButtons}>
            <button
              className={`${styles.authButton} ${styles.authButtonPrimary}`}
              onClick={() => navigate("/login")}
            >
              <FaSignInAlt /> Iniciar Sesión
            </button>
            <button
              className={`${styles.authButton} ${styles.authButtonSecondary}`}
              onClick={() => navigate("/register")}
            >
              <FaUserPlus /> Registrarse
            </button>
          </div>
        </div>
      </div>
    );
  }


  useEffect(() => {
    if (isAuthenticated && currentUser?.rut) {
      mascotasService
        .obtenerMascotasPorDueno(currentUser.rut)
        .then((res) => setMascotas(res.data))
        .catch(() => setMascotas([]));
    } else {
      // Limpiar datos cuando no está autenticado
      setMascotas([]);
      setSelectedMascotaId(null);
      setSelectedMascota(null);
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setMotivo("");
      setNotasPrevias("");
      setSelectedTipoConsulta(null);
      setSelectedVeterinario(null);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    tiposConsultaService.obtenerTodos().then(setTiposConsulta);
  }, []);

  useEffect(() => {
    if (selectedTipoConsulta?.id) {
      veterinariosService.obtenerPorEspecialidad(selectedTipoConsulta.id).then((vets) => {
        setVeterinarios(vets);
        setSelectedVeterinario(vets[0] || null); // Selecciona el primero por defecto
      });
    } else {
      setVeterinarios([]);
      setSelectedVeterinario(null);
    }
  }, [selectedTipoConsulta]);

  // Horarios disponibles
  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  // Generar años disponibles (actual hasta 2026)
  const availableYears = Array.from(
    { length: 3 },
    (_, i) => new Date().getFullYear() + i
  );

  // Obtener nombre del mes
  const getMonthName = (monthIndex: number) => {
    return new Date(currentYear, monthIndex).toLocaleString("es-ES", {
      month: "long",
    });
  };

  // Generar días del mes actual
  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];

    // Días vacíos para alinear el calendario
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    return days;
  };

  const handleMonthChange = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cita = {
      mascota_id: selectedMascotaId as number,
      veterinario_id: selectedVeterinario?.id ?? null,
      tipo_consulta_id: selectedTipoConsulta?.id ?? null,
      fecha_hora:
        selectedDate && selectedTime
          ? `${selectedDate.toISOString().split("T")[0]}T${selectedTime.split(" - ")[0]}:00`
          : "",
      duracion_minutos: selectedTipoConsulta?.duracion_minutos ?? 30,
      motivo,
      estado: "pendiente",
      notas_previas: notasPrevias,
    };

    try {
      await citasService.crearCita(cita);
      setIsSubmitted(true);

      // Redirige al inicio después de 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      alert("Error al agendar la cita");
    }
  };

  const days = generateCalendarDays();
  const monthName = getMonthName(currentMonth);

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.confirmationMessage}>
          <div className={styles.confirmationIcon}>
            <FaCheck />
          </div>
          <h2 className={styles.confirmationTitle}>¡Cita Agendada!</h2>
          <p className={styles.confirmationText}>
            Tu cita fue registrada exitosamente.<br />
            Serás redirigido al inicio en unos segundos.
          </p>
        </div>
      </div>
    );
  } 

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaPaw /> Agendar Cita Veterinaria
      </h1>

      {/* Paso 1: Información del dueño y mascota */}
      {step === 1 && (
        <div className={styles.formSection}>
          {/* Información del Dueño */}
          <div className={styles.sectionTitle}>
            <FaUser /> Información del Dueño
          </div>
          <input
            type="text"
            className={styles.inputField}
            value={
              currentUser && (currentUser.nombre || currentUser.nombres)
                ? `${currentUser.nombre || currentUser.nombres} ${currentUser.apellido || currentUser.apellidos || ""}`
                : ""
            }
            disabled
            placeholder="Nombre completo"
          />
          <input
            type="email"
            className={styles.inputField}
            value={currentUser?.email || ""}
            disabled
            placeholder="Correo electrónico"
          />
          <input
            type="tel"
            className={styles.inputField}
            value={currentUser?.telefono || ""}
            disabled
            placeholder="Teléfono"
          />

          <div className={styles.sectionTitle}>
            <FaPaw /> Información de la Mascota
          </div>
          {/* Select de mascotas */}
          <select
            className={styles.inputField}
            value={selectedMascotaId ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedMascotaId(id);
              const mascota = mascotas.find((m) => m.id_mascota === id);
              setSelectedMascota(mascota || null);
            }}
            required
          >
            <option value="">Selecciona una mascota</option>
            {mascotas.map((mascota) => (
              <option key={mascota.id_mascota} value={mascota.id_mascota}>
                {mascota.nombre_mascota}
              </option>
            ))}
          </select>

          {selectedMascota && (
            <div className={styles.mascotaDetalles}>
              <div className={styles.mascotaHeader}>
                {selectedMascota.url_imagen_mascota && (
                  <img
                    src={`http://localhost:3000/${selectedMascota.url_imagen_mascota}`}
                    alt={selectedMascota.nombre_mascota}
                    className={styles.mascotaAvatar}
                  />
                )}
                <div className={styles.mascotaInfo}>
                  <div className={styles.mascotaNombre}>
                    <FaPaw />
                    {selectedMascota.nombre_mascota}
                  </div>
                  <div className={styles.mascotaTipo}>
                    {selectedMascota.nombre_especie || "Especie no registrada"}
                  </div>
                </div>
              </div>

              <div className={styles.mascotaGrid}>
                <div className={styles.mascotaItem}>
                  <span className={styles.mascotaLabel}>Raza</span>
                  <span className={styles.mascotaValue}>
                    {selectedMascota.nombre_raza || "No registrada"}
                  </span>
                </div>

                <div className={styles.mascotaItem}>
                  <span className={styles.mascotaLabel}>Edad</span>
                  <span className={styles.mascotaValue}>
                    {selectedMascota.fecha_nac_mascota
                      ? `${Math.floor(
                          (Date.now() - new Date(selectedMascota.fecha_nac_mascota).getTime()) /
                            (1000 * 60 * 60 * 24 * 365)
                        )} años`
                      : "No registrada"}
                  </span>
                </div>

                <div className={styles.mascotaItem}>
                  <span className={styles.mascotaLabel}>Peso</span>
                  <span className={styles.mascotaValue}>
                    {selectedMascota.peso_kg ? `${selectedMascota.peso_kg} kg` : "No registrado"}
                  </span>
                </div>

                <div className={styles.mascotaItem}>
                  <span className={styles.mascotaLabel}>Sexo</span>
                  <span className={styles.mascotaValue}>
                    {selectedMascota.sexo_mascota === "macho"
                      ? "Macho"
                      : selectedMascota.sexo_mascota === "hembra"
                      ? "Hembra"
                      : "No registrado"}
                  </span>
                </div>

                <div className={styles.mascotaItem}>
                  <span className={styles.mascotaLabel}>Color</span>
                  <span className={styles.mascotaValue}>
                    {selectedMascota.color_mascota || "No registrado"}
                  </span>
                </div>

                <div className={styles.mascotaItem}>
                  <span className={styles.mascotaLabel}>Microchip</span>
                  <span className={styles.mascotaValue}>
                    {selectedMascota.codigo_microchip || "No registrado"}
                  </span>
                </div>
              </div>

              <div className={`${styles.mascotaEstado} ${selectedMascota.esta_esterilizado ? styles.activo : styles.inactivo}`}>
                <div className={`${styles.mascotaIcon} ${selectedMascota.esta_esterilizado ? styles.activo : styles.inactivo}`}></div>
                {selectedMascota.esta_esterilizado ? "Esterilizado" : "No Esterilizado"}
              </div>
            </div>
          )}

          <div className={styles.actionButtons}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => navigate("/especialidadesPage")}
            >
              <FaArrowLeft /> Atrás
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={() => setStep(2)}
              disabled={!selectedMascotaId}
            >
              Siguiente <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Selección de especialidad y fecha */}
      {step === 2 && (
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>
            <FaPaw /> Especialidad Médica
          </div>

          <div className={styles.specialtyRadio}>
            {tiposConsulta.map((tipo) => (
              <div
                key={tipo.id}
                className={`${styles.radioOption} ${selectedTipoConsulta?.id === tipo.id ? styles.selected : ""}`}
                onClick={() => setSelectedTipoConsulta(tipo)}
              >
                <div className={styles.radioInput} />
                <div>
                  <div style={{ fontWeight: 600 }}>{tipo.nombre}</div>
                  <div style={{ fontSize: "0.95em", color: "#555" }}>{tipo.descripcion}</div>
                  {tipo.precio && (
                    <div className={styles.precioEspecialidad}>
                      {Number(tipo.precio).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sectionTitle}>
            <FaCalendarAlt /> Seleccione Fecha
          </div>

          <div className={styles.calendarHeader}>
            <div className={styles.calendarNav}>
              <button
                className={styles.calendarNavButton}
                onClick={() => handleMonthChange(-1)}
              >
                <FaArrowLeft />
              </button>
              <span className={styles.calendarTitle}>
                {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
              </span>
              <button
                className={styles.calendarNavButton}
                onClick={() => handleMonthChange(1)}
              >
                <FaArrowRight />
              </button>
            </div>
            <select
              className={styles.yearSelect}
              value={currentYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.calendarGrid}>
            {["D", "L", "M", "X", "J", "V", "S"].map((day, idx) => (
              <div key={day + idx} className={styles.calendarDayHeader}>
                {day}
              </div>
            ))}

            {days.map((day, index) => (
              <div
                key={index}
                className={`${styles.calendarDay} ${
                  !day
                    ? styles.empty
                    : selectedDate &&
                      day.getDate() === selectedDate.getDate() &&
                      day.getMonth() === selectedDate.getMonth() &&
                      day.getFullYear() === selectedDate.getFullYear()
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleDateSelect(day)}
              >
                {day ? day.getDate() : ""}
              </div>
            ))}
          </div>

          <div className={styles.actionButtons}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => setStep(1)}
            >
              <FaArrowLeft /> Atrás
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={() => setStep(3)}
              disabled={!selectedTipoConsulta || !selectedDate}
            >
              Siguiente <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Selección de hora y confirmación */}
      {step === 3 && (
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>
            <FaClock /> Resumen de la Cita
          </div>

          {/* Motivo de la consulta */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Motivo de la consulta</span>
            <textarea
              className={styles.inputField}
              placeholder="Describe el motivo de la consulta"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {/* Notas previas */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Notas previas (opcional)</span>
            <textarea
              className={styles.inputField}
              placeholder="Notas adicionales para el veterinario"
              value={notasPrevias}
              onChange={(e) => setNotasPrevias(e.target.value)}
            />
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Mascota</span>
            <span className={styles.summaryValue}>
              {selectedMascota
                ? `${selectedMascota.nombre_mascota} (${selectedMascota.nombre_especie || ""})`
                : ""}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Veterinario</span>
            <span className={styles.summaryValue}>
              {selectedVeterinario
                ? `${selectedVeterinario.nombre} (${selectedVeterinario.numero_licencia || "Sin licencia"})`
                : "No hay veterinario disponible para esta especialidad"}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Especialidad</span>
            <span className={styles.summaryValue}>
              {selectedTipoConsulta
                ? `${selectedTipoConsulta.nombre} - ${selectedTipoConsulta.descripcion} (${Number(selectedTipoConsulta.precio).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 })})`
                : ""}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Fecha seleccionada</span>
            <span className={styles.summaryValue}>
              {selectedDate?.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className={styles.sectionTitle}>Horarios Disponibles</div>

          <div className={styles.timeSlots}>
            {timeSlots.map((time) => (
              <div
                key={time}
                className={`${styles.timeSlot} ${
                  selectedTime === time ? styles.selected : ""
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </div>
            ))}
          </div>

          <div className={styles.actionButtons}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => setStep(2)}
            >
              <FaArrowLeft /> Atrás
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleSubmit}
              disabled={!selectedTime}
            >
              Confirmar Cita <FaCheck />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendamientoCitas;
