import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgoraVeterinarioService } from "../../services/videoconsultaVeterinario";
import { useVideoOptimization } from "../../utils/videoOptimizations";
import styles from "./VideollamadaVeterinario.module.css";
import { FaArrowLeft, FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhone, FaPhoneSlash } from "react-icons/fa";

const VideollamadaVeterinario: React.FC = () => {
  const [channelName, setChannelName] = useState("");
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "reconnecting">("disconnected");
  const [mediaState, setMediaState] = useState({
    audioEnabled: false,
    videoEnabled: false,
    audioTrackExists: false,
    videoTrackExists: false,
    remoteUserCount: 0,
    currentVideoQuality: "high" as "high" | "medium" | "low",
    videoConfig: { width: 1280, height: 720, frameRate: 60 }
  });
  
  const agoraServiceRef = useRef<AgoraVeterinarioService | null>(null);
  const navigate = useNavigate();
  const mediaStateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { optimizeOnMount, getRecommendation, capabilities } = useVideoOptimization();

  useEffect(() => {
    // ✅ USAR SINGLETON - Asegurar que solo hay una instancia de AgoraVeterinarioService
    agoraServiceRef.current = AgoraVeterinarioService.getInstance();
    console.log("🔗 Usando AgoraVeterinarioService singleton:", agoraServiceRef.current);

    // Aplicar optimizaciones de video
    optimizeOnMount();

    // Obtener recomendación automática basada en el dispositivo
    const recommendation = getRecommendation();
    console.log(`🎯 Recomendación automática: ${recommendation.quality} - ${recommendation.description}`);
    console.log(`💻 Capacidades del dispositivo:`, capabilities);

    // Función para actualizar el estado de los medios
    const updateMediaState = () => {
      if (agoraServiceRef.current) {
        const state = agoraServiceRef.current.getMediaState();
        setMediaState(state);
        
        // ✅ IMPORTANTE: Sincronizar estados de UI con el SDK real
        // Solo actualizar si hay cambios para evitar bucles infinitos
        if (state.audioTrackExists && isMuted !== !state.audioEnabled) {
          setIsMuted(!state.audioEnabled);
        }
        if (state.videoTrackExists && isCameraOff !== !state.videoEnabled) {
          setIsCameraOff(!state.videoEnabled);
        }
      } 
    };

    // Actualizar estado cada segundo mientras esté en llamada
    mediaStateIntervalRef.current = setInterval(updateMediaState, 1000);

    return () => {
      if (mediaStateIntervalRef.current) {
        clearInterval(mediaStateIntervalRef.current);
      }
      // ✅ LIMPIEZA SINGLETON - No llamar leave() aquí para evitar conflictos
      // Solo limpiar las referencias locales
      console.log("🧹 Limpiando referencias locales del componente (Veterinario)");
      agoraServiceRef.current = null;
    };
  }, [optimizeOnMount, getRecommendation, capabilities]);

  const startCall = async () => {
    if (!channelName.trim()) {
      setConnectionError("Por favor ingresa un nombre de canal");
      return;
    }
    
    setIsConnecting(true);
    setConnectionError("");
    setConnectionStatus("connecting");
    const appId = "e83d68a7ae864d4a9e920fcaae47fcd5";
    
    try {
      await agoraServiceRef.current?.join(appId, channelName);
      setInCall(true);
      setConnectionStatus("connected");
      
      // ✅ Inicializar estados de audio/video correctamente
      setTimeout(() => {
        if (agoraServiceRef.current) {
          const state = agoraServiceRef.current.getMediaState();
          setIsMuted(!state.audioEnabled);
          setIsCameraOff(!state.videoEnabled);
          console.log("🎯 Estados inicializados (Veterinario):", { 
            audioEnabled: state.audioEnabled, 
            videoEnabled: state.videoEnabled 
          });
        }
      }, 1000); // Dar tiempo para que se inicialicen los tracks
      
      console.log("✅ Veterinario conectado exitosamente al canal:", channelName);
    } catch (error: any) {
      console.error("❌ Error al iniciar la llamada (Veterinario):", error);
      
      // Mostrar mensaje de error específico
      const errorMessage = error.message || "Error al conectar. Verifica tu conexión de internet.";
      setConnectionError(errorMessage);
      setConnectionStatus("disconnected");
      
      // Si hay problemas de red, sugerir soluciones
      if (errorMessage.includes("WebSocket") || errorMessage.includes("red") || errorMessage.includes("firewall")) {
        setConnectionError(`${errorMessage}\n\nSoluciones posibles:\n• Verifica tu conexión a internet\n• Desactiva temporalmente el firewall\n• Intenta desde otra red\n• Contacta al administrador de red`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const leaveCall = async () => {
    setIsConnecting(true);
    try {
      await agoraServiceRef.current?.leave();
      // ✅ DESTRUIR SINGLETON cuando se sale de la llamada
      AgoraVeterinarioService.destroyInstance();
      console.log("🗑️ Singleton AgoraVeterinarioService destruido completamente");
      
      setInCall(false);
      setIsMuted(false);
      setIsCameraOff(false);
      setConnectionError("");
      setConnectionStatus("disconnected");
      console.log("✅ Veterinario salió de la llamada exitosamente");
    } catch (error) {
      console.error("Error al salir de la llamada (Veterinario):", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleMic = () => {
    if (!agoraServiceRef.current || !inCall) {
      console.warn("No hay conexión activa para cambiar el micrófono (Veterinario)");
      return;
    }
    
    let success = false;
    if (isMuted) {
      success = agoraServiceRef.current.unmuteAudio();
    } else {
      success = agoraServiceRef.current.muteAudio();
    }
    
    if (success) {
      setIsMuted(!isMuted);
    } else {
      console.warn("❌ Operación falló, sincronizando con estado real... (Veterinario)");
      // Intentar obtener el estado real del SDK
      const realState = agoraServiceRef.current.getMediaState();
      setIsMuted(!realState.audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (!agoraServiceRef.current || !inCall) {
      console.warn("No hay conexión activa para cambiar la cámara (Veterinario)");
      return;
    }
    
    let success = false;
    if (isCameraOff) {
      success = agoraServiceRef.current.enableVideo();
    } else {
      success = agoraServiceRef.current.disableVideo();
    }
    
    if (success) {
      setIsCameraOff(!isCameraOff);
    } else {
      console.warn("❌ Operación falló, sincronizando con estado real... (Veterinario)");
      // Intentar obtener el estado real del SDK
      const realState = agoraServiceRef.current.getMediaState();
      setIsCameraOff(!realState.videoEnabled);
    }
  };

  // ✅ LIMPIEZA AL DESMONTAR - Si el usuario navega sin hacer "leave"
  useEffect(() => {
    return () => {
      // Solo destruir si estaba en llamada
      if (inCall && agoraServiceRef.current?.isConnected) {
        console.log("🚨 Componente desmontado durante llamada - destruyendo singleton (Veterinario)");
        AgoraVeterinarioService.destroyInstance();
      }
    };
  }, [inCall]);

  return (
    <div className={styles.videoConferenceContainer}>
      <header className={styles.conferenceHeader}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/veterinario/dashboard')}
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>
        <h1>Videollamada Veterinaria</h1>
        <p>Consulta virtual con pacientes</p>
        
        {/* Indicador de estado de conexión */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginTop: '10px',
          fontSize: '0.9em'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            marginRight: '8px',
            backgroundColor: 
              connectionStatus === 'connected' ? '#28a745' :
              connectionStatus === 'connecting' ? '#ffc107' :
              connectionStatus === 'reconnecting' ? '#fd7e14' : '#dc3545'
          }}></span>
          {connectionStatus === 'connected' && '🟢 Conectado'}
          {connectionStatus === 'connecting' && '🟡 Conectando...'}
          {connectionStatus === 'reconnecting' && '🟠 Reconectando...'}
          {connectionStatus === 'disconnected' && '🔴 Desconectado'}
        </div>
      </header>

      <main className={styles.conferenceContent}>
        <div className={styles.channelInput}>
          <label htmlFor="channelName">Nombre del canal</label>
          <input
            id="channelName"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            disabled={inCall || isConnecting}
            placeholder="Ej: consulta-mascota-123"
            className={styles.input}
          />
          {connectionError && (
            <div className={styles.errorMessage}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#dc3545' }}>
                ⚠️ Error de Conexión
              </div>
              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                {connectionError}
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#6c757d' }}>
                💡 Tip: Si persiste el problema, intenta con un canal diferente o verifica tu configuración de red.
              </div>
            </div>
          )}
        </div>

        <div className={styles.videoContainer}>
          {/* Video Local (Veterinario) */}
          <div className={styles.participant}>
            <div id="local-player-vet" className={styles.videoBox}></div>
            <div className={styles.participantFooter}>
              <span className={styles.participantName}>Dr. Veterinario</span>
              <div className={styles.statusIndicators}>
                {isCameraOff && <span className={styles.statusIcon}>📷❌</span>}
                {isMuted && <span className={styles.statusIcon}>🎤❌</span>}
                <span className={styles.signalIcon}>📶📶📶📶</span>
              </div>
            </div>
          </div> 

          {/* Video Remoto (Paciente) */}
          <div className={styles.participant}>
            <div id="remote-player-vet" className={styles.videoBox}></div>
            <div className={styles.participantFooter}>
              <span className={styles.participantName}>
                Paciente {mediaState.remoteUserCount > 0 ? "🟢 Conectado" : "⭕ Desconectado"}
              </span>
              <span className={styles.signalIcon}>📶📶📶📶</span>
            </div>
          </div>
        </div>

        <div className={styles.controlsContainer}>
          <div className={styles.mainButtons}>
            <button
              onClick={startCall}
              disabled={inCall || !channelName.trim() || isConnecting}
              className={`${styles.btn} ${styles.btnSuccess}`}
            >
              <FaPhone /> {isConnecting ? "Conectando..." : "Iniciar Llamada"}
            </button>
            <button
              onClick={leaveCall}
              disabled={!inCall || isConnecting}
              className={`${styles.btn} ${styles.btnDanger}`}
            >
              <FaPhoneSlash /> {isConnecting ? "Desconectando..." : "Finalizar"}
            </button>
          </div>
          
          <div className={styles.secondaryButtons}>
            <button 
              onClick={toggleMic} 
              disabled={!inCall || !mediaState.audioTrackExists}
              className={`${styles.btn} ${styles.btnControl} ${isMuted ? styles.btnMuted : ''}`}
              title={`Audio track exists: ${mediaState.audioTrackExists}, Audio enabled: ${mediaState.audioEnabled}`}
            >
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
              {isMuted ? "Activar micrófono" : "Silenciar micrófono"}
              {!mediaState.audioTrackExists && <small> (Sin audio)</small>}
            </button>
            
            <button 
              onClick={toggleVideo} 
              disabled={!inCall || !mediaState.videoTrackExists}
              className={`${styles.btn} ${styles.btnControl} ${isCameraOff ? styles.btnVideoOff : ''}`}
              title={`Video track exists: ${mediaState.videoTrackExists}, Video enabled: ${mediaState.videoEnabled}`}
            >
              {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
              {isCameraOff ? "Activar cámara" : "Apagar cámara"}
              {!mediaState.videoTrackExists && <small> (Sin video)</small>}
            </button>
          </div>

          {/* Información de estado para debugging */}
          <div className={styles.debugInfo}>
            <small>
              Estado: {inCall ? "En llamada" : "Desconectado"} | 
              Audio: {mediaState.audioTrackExists ? (mediaState.audioEnabled ? "✓" : "❌") : "N/A"} | 
              Video: {mediaState.videoTrackExists ? (mediaState.videoEnabled ? "✓" : "❌") : "N/A"} | 
              Remotos: {mediaState.remoteUserCount}
            </small>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideollamadaVeterinario;
