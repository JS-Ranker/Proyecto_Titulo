import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgoraService } from "../../services/videoconsulta";
import { useVideoOptimization } from "../../utils/videoOptimizations";
import styles from "./VideoConsulta.module.css";

const VideoConference: React.FC = () => {
  const [channelName, setChannelName] = useState("");
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>("");
  const [mediaState, setMediaState] = useState({
    audioEnabled: false,
    videoEnabled: false,
    audioTrackExists: false,
    videoTrackExists: false,
    remoteUserCount: 0,
    currentVideoQuality: "high" as "high" | "medium" | "low",
    videoConfig: { width: 1280, height: 720, frameRate: 60 }
  });
  
  const agoraServiceRef = useRef<AgoraService | null>(null);
  const navigate = useNavigate();
  const mediaStateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { optimizeOnMount, getRecommendation, capabilities } = useVideoOptimization();

  useEffect(() => {
    // ✅ USAR SINGLETON - Asegurar que solo hay una instancia de AgoraService
    agoraServiceRef.current = AgoraService.getInstance();
    console.log("🔗 Usando AgoraService singleton:", agoraServiceRef.current);

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
      console.log("🧹 Limpiando referencias locales del componente");
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
    const appId = "e83d68a7ae864d4a9e920fcaae47fcd5";
    
    try {
      await agoraServiceRef.current?.join(appId, channelName);
      setInCall(true);
      
      // ✅ Inicializar estados de audio/video correctamente
      setTimeout(() => {
        if (agoraServiceRef.current) {
          const state = agoraServiceRef.current.getMediaState();
          setIsMuted(!state.audioEnabled);
          setIsCameraOff(!state.videoEnabled);
          console.log("🎯 Estados inicializados:", { 
            audioEnabled: state.audioEnabled, 
            videoEnabled: state.videoEnabled 
          });
        }
      }, 1000); // Dar tiempo para que se inicialicen los tracks
      
      console.log("✅ Conectado exitosamente al canal:", channelName);
    } catch (error) {
      console.error("Error al iniciar la llamada:", error);
      setConnectionError("Error al conectar. Verifica tu conexión de internet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const leaveCall = async () => {
    setIsConnecting(true);
    try {
      await agoraServiceRef.current?.leave();
      // ✅ DESTRUIR SINGLETON cuando se sale de la llamada
      AgoraService.destroyInstance();
      console.log("🗑️ Singleton AgoraService destruido completamente");
      
      setInCall(false);
      setIsMuted(false);
      setIsCameraOff(false);
      setConnectionError("");
      console.log("✅ Salió de la llamada exitosamente");
    } catch (error) {
      console.error("Error al salir de la llamada:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleMic = () => {
    if (!agoraServiceRef.current || !inCall) {
      console.warn("No hay conexión activa para cambiar el micrófono");
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
      console.warn("❌ Operación falló, sincronizando con estado real...");
      // Intentar obtener el estado real del SDK
      const realState = agoraServiceRef.current.getMediaState();
      setIsMuted(!realState.audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (!agoraServiceRef.current || !inCall) {
      console.warn("No hay conexión activa para cambiar la cámara");
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
      console.warn("❌ Operación falló, sincronizando con estado real...");
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
        console.log("🚨 Componente desmontado durante llamada - destruyendo singleton");
        AgoraService.destroyInstance();
      }
    };
  }, [inCall]);

  return (
    <div className={styles["video-conference-container"]}>
      <header className={styles["conference-header"]}>
        <h1>Videollamada Veterinaria</h1>
      </header>

      <main className={styles["conference-content"]}>
        {/* Botón para retroceder */}
        <button
          className={styles["btn"]}
          style={{ marginBottom: "1rem", width: "fit-content" }}
          onClick={() => navigate(-1)}
        >
          ⬅ Volver
        </button>

        <div className={styles["channel-input"]}>
          <label htmlFor="channelName">Nombre del canal</label>
          <input
            id="channelName"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            disabled={inCall || isConnecting}
            placeholder="Ingresa el nombre del canal"
          />
          {connectionError && (
            <div style={{ color: "red", fontSize: "0.9em", marginTop: "5px" }}>
              {connectionError}
            </div>
          )}
        </div>

        <div className={styles["video-container"]}>
          {/* Local Participant */}
          <div className={styles["participant"]}>
            <div id="local-player" className={styles["video-box"]}></div>
            <div className={styles["participant-footer"]}>
              <span className={styles["participant-name"]}>Yo</span>
              <div>
                {isCameraOff && <span style={{ color: "red" }}>📷❌</span>}
                {isMuted && <span style={{ color: "red" }}>🎤❌</span>}
                <span className={styles["signal-icon"]}>📶📶📶📶</span>
              </div>
            </div>
          </div> 
          {/* Veterinario */}
          <div className={styles["participant"]}>
            <div id="remote-player" className={styles["video-box"]}></div>
            <div className={styles["participant-footer"]}>
              <span className={styles["participant-name"]}>
                Veterinario {mediaState.remoteUserCount > 0 ? "🟢 Conectado" : "⭕ Desconectado"}
              </span>
              <span className={styles["signal-icon"]}>📶📶📶📶</span>
            </div>
          </div>
        </div>

        <div className={styles["controls-container"]}>
          <div className={styles["main-buttons"]}>
            <button
              onClick={startCall}
              disabled={inCall || !channelName.trim() || isConnecting}
              className={`${styles["btn"]} ${styles["btn-success"]}`}
            >
              {isConnecting ? "Conectando..." : "Iniciar"}
            </button>
            <button
              onClick={leaveCall}
              disabled={!inCall || isConnecting}
              className={`${styles["btn"]} ${styles["btn-danger"]}`}
            >
              {isConnecting ? "Desconectando..." : "Salir"}
            </button>
          </div>
          <div className={styles["secondary-buttons"]}>
            <button 
              onClick={toggleMic} 
              disabled={!inCall || !mediaState.audioTrackExists}
              className={`${styles["btn"]} ${styles["btn-control"]}`}
              title={`Audio track exists: ${mediaState.audioTrackExists}, Audio enabled: ${mediaState.audioEnabled}`}
            >
              <span className={styles["icon"]}>{isMuted ? "🎤❌" : "🎤"}</span>
              {isMuted ? "Activar micrófono" : "Silenciar micrófono"}
              {!mediaState.audioTrackExists && <small> (Sin audio)</small>}
            </button>
            <button 
              onClick={toggleVideo} 
              disabled={!inCall || !mediaState.videoTrackExists}
              className={`${styles["btn"]} ${styles["btn-control"]}`}
              title={`Video track exists: ${mediaState.videoTrackExists}, Video enabled: ${mediaState.videoEnabled}`}
            >
              <span className={styles["icon"]}>{isCameraOff ? "📷❌" : "📷"}</span>
              {isCameraOff ? "Activar cámara" : "Apagar cámara"}
              {!mediaState.videoTrackExists && <small> (Sin video)</small>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoConference;
