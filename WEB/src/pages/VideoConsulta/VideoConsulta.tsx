import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- Agrega esto
import { AgoraService } from "../../services/videoconsulta";
import styles from "./VideoConsulta.module.css";

const VideoConference: React.FC = () => {
  const [channelName, setChannelName] = useState("");
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const agoraServiceRef = useRef<AgoraService | null>(null);
  const navigate = useNavigate(); // <-- Agrega esto

  useEffect(() => {
    agoraServiceRef.current = new AgoraService();

    return () => {
      if (agoraServiceRef.current?.isConnected) {
        agoraServiceRef.current.leave();
      }
    };
  }, []);

  const startCall = async () => {
    if (!channelName.trim()) return;
    const appId = "e83d68a7ae864d4a9e920fcaae47fcd5";
    try {
      await agoraServiceRef.current?.join(appId, channelName);
      setInCall(true);
    } catch (error) {
      console.error("Error al iniciar la llamada:", error);
    }
  };

  const leaveCall = async () => {
    try {
      await agoraServiceRef.current?.leave();
      setInCall(false);
    } catch (error) {
      console.error("Error al salir de la llamada:", error);
    }
  };

  const toggleMic = () => {
    if (isMuted) {
      agoraServiceRef.current?.unmuteAudio();
    } else {
      agoraServiceRef.current?.muteAudio();
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (isCameraOff) {
      agoraServiceRef.current?.enableVideo();
    } else {
      agoraServiceRef.current?.disableVideo();
    }
    setIsCameraOff(!isCameraOff);
  };

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
            disabled={inCall}
          />
        </div>

        <div className={styles["video-container"]}>
          {/* Local Participant */}
          <div className={styles["participant"]}>
            <div id="local-player" className={styles["video-box"]}></div>
            <div className={styles["participant-footer"]}>
              <span className={styles["participant-name"]}>Yo</span>
              <span className={styles["signal-icon"]}>📶📶📶📶</span>
            </div>
          </div> 
          {/* Veterinario */}
          <div className={styles["participant"]}>
            <div id="remote-player" className={styles["video-box"]}></div>
            <div className={styles["participant-footer"]}>
              <span className={styles["participant-name"]}>Veterinario</span>
              <span className={styles["signal-icon"]}>📶📶📶📶</span>
            </div>
          </div>
        </div>

        <div className={styles["controls-container"]}>
          <div className={styles["main-buttons"]}>
            <button
              onClick={startCall}
              disabled={inCall || !channelName.trim()}
              className={`${styles["btn"]} ${styles["btn-success"]}`}
            >
              Iniciar
            </button>
            <button
              onClick={leaveCall}
              disabled={!inCall}
              className={`${styles["btn"]} ${styles["btn-danger"]}`}
            >
              Salir
            </button>
          </div>
          <div className={styles["secondary-buttons"]}>
            <button onClick={toggleMic} className={`${styles["btn"]} ${styles["btn-control"]}`}>
              <span className={styles["icon"]}>{isMuted ? "🎤❌" : "🎤"}</span>
              {isMuted ? "Activar micrófono" : "Silenciar micrófono"}
            </button>
            <button onClick={toggleVideo} className={`${styles["btn"]} ${styles["btn-control"]}`}>
              <span className={styles["icon"]}>{isCameraOff ? "📷❌" : "📷"}</span>
              {isCameraOff ? "Activar cámara" : "Apagar cámara"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoConference;
