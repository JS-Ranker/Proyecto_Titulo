import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  UID,
} from "agora-rtc-sdk-ng";

export interface VideoConfig {
  width: number;
  height: number;
  frameRate: number;
}

export interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  audioTrackExists: boolean;
  videoTrackExists: boolean;
  remoteUserCount: number;
  currentVideoQuality: "high" | "medium" | "low";
  videoConfig: VideoConfig;
}

export class AgoraVeterinarioService {
  private static instance: AgoraVeterinarioService | null = null;
  private client: IAgoraRTCClient;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private localVideoTrack: ICameraVideoTrack | null = null;
  private remoteUsers = new Map();
  private currentVideoConfig: "high" | "medium" | "low" = "high";
  public isConnected = false;

  // IDs de contenedores específicos para veterinario
  private readonly LOCAL_CONTAINER_ID = "local-player-vet";
  private readonly REMOTE_CONTAINER_ID = "remote-player-vet";

  private videoConfigs: Record<string, VideoConfig> = {
    high: { width: 1280, height: 720, frameRate: 60 },
    medium: { width: 640, height: 480, frameRate: 30 },
    low: { width: 320, height: 240, frameRate: 15 }
  };

  private constructor() {
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    this.setupRemoteHandlers();
    console.log("🏥 AgoraVeterinarioService inicializado");
  }

  static getInstance(): AgoraVeterinarioService {
    if (!AgoraVeterinarioService.instance) {
      AgoraVeterinarioService.instance = new AgoraVeterinarioService();
    }
    return AgoraVeterinarioService.instance;
  }

  static destroyInstance() {
    if (AgoraVeterinarioService.instance) {
      AgoraVeterinarioService.instance.leave();
      AgoraVeterinarioService.instance = null;
      console.log("🗑️ Instancia de AgoraVeterinarioService destruida");
    }
  }

  private setupRemoteHandlers() {
    this.client.on("user-published", async (user, mediaType) => {
      try {
        console.log(`🔔 Usuario ${user.uid} publicó ${mediaType} (Veterinario)`);
        
        // 🚫 No subscribirse a sí mismo para evitar eco
        if (user.uid === this.client.uid) {
          return;
        }

        await this.client.subscribe(user, mediaType);
        this.remoteUsers.set(user.uid, user);
        console.log(`✅ Suscripción exitosa a ${user.uid} para ${mediaType} (Veterinario)`);

        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
          const remoteDiv = document.getElementById(this.REMOTE_CONTAINER_ID);
          
          if (remoteDiv) {
            remoteDiv.innerHTML = "";
            remoteVideoTrack.play(remoteDiv);
            console.log(`✅ Video remoto renderizado de ${user.uid} (Veterinario)`);
          } else {
            console.error(`❌ No se encontró el div ${this.REMOTE_CONTAINER_ID}`);
          }
        }

        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.play();
          console.log(`✅ Audio remoto iniciado de ${user.uid} (Veterinario)`);
        }
        
      } catch (err) {
        console.error("❌ Error al suscribirse al usuario remoto (Veterinario):", err);
      }
    });

    this.client.on("user-unpublished", (user, mediaType) => {
      console.log(`📤 Usuario ${user.uid} dejó de publicar ${mediaType} (Veterinario)`);
      
      if (mediaType === "video") {
        const remoteDiv = document.getElementById(this.REMOTE_CONTAINER_ID);
        if (remoteDiv) remoteDiv.innerHTML = "";
      }
      
      if (!mediaType) {
        this.remoteUsers.delete(user.uid);
      }
    });

    this.client.on("user-left", (user) => {
      console.log(`🚪 Usuario ${user.uid} salió del canal (Veterinario)`);
      this.remoteUsers.delete(user.uid);
      const remoteDiv = document.getElementById(this.REMOTE_CONTAINER_ID);
      if (remoteDiv) remoteDiv.innerHTML = "";
    });

    this.client.on("exception", (evt) => {
      console.warn(`Excepción de red (Veterinario): ${evt.code} - ${evt.msg}`);
      if (evt.code === 2003) {
        console.warn("Red débil: calidad de audio/video reducida.");
      }
    });

    // Manejo de errores de conexión WebSocket
    this.client.on("connection-state-change", (curState, revState, reason) => {
      console.log(`🔄 Estado de conexión cambió (Veterinario): ${revState} -> ${curState}, razón: ${reason}`);
      
      if (curState === "DISCONNECTED") {
        console.warn("🚨 Conexión perdida, intentando reconectar...");
      } else if (curState === "CONNECTED") {
        console.log("✅ Reconectado exitosamente");
      } else if (curState === "CONNECTING") {
        console.log("🔄 Reconectando...");
      } else if (curState === "RECONNECTING") {
        console.log("🔄 Reintentando conexión...");
      }
    });

    // Manejo de cambios de red con ajuste automático de calidad
    this.client.on("network-quality", (stats) => {
      const downlink = stats.downlinkNetworkQuality;
      const uplink = stats.uplinkNetworkQuality;
      
      console.log(`Calidad de red (Veterinario) - Downlink: ${downlink}, Uplink: ${uplink}`);
      
      // Ajuste automático de calidad basado en la red
      if ((downlink > 3 || uplink > 3) && this.currentVideoConfig === "high") {
        console.warn("Red lenta detectada, cambiando a calidad media...");
        this.switchVideoQuality("medium");
      } else if ((downlink > 4 || uplink > 4) && this.currentVideoConfig === "medium") {
        console.warn("Red muy lenta detectada, cambiando a calidad baja...");
        this.switchVideoQuality("low");
      } else if (downlink <= 2 && uplink <= 2 && this.currentVideoConfig === "low") {
        console.log("Red mejorada detectada, cambiando a calidad alta...");
        this.switchVideoQuality("high");
      }
    });
  }

  async join(appId: string, channel: string, uid: UID | null = null) {
    if (this.isConnected) {
      console.log("Ya está conectado (Veterinario).");
      return;
    }

    try {
      console.log(`🏥 Uniéndose al canal ${channel} como veterinario...`);
      
      // Configurar timeout para la conexión
      const joinPromise = this.client.join(appId, channel, null, uid);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout de conexión")), 30000);
      });
      
      await Promise.race([joinPromise, timeoutPromise]);
      this.isConnected = true;

      // Crear tracks de audio y video
      await this.createLocalTracks();
      console.log("✅ Conexión exitosa al canal (Veterinario)");
    } catch (error: any) {
      console.error("❌ Error al unirse al canal (Veterinario):", error);
      
      // Proporcionar mensajes de error más específicos
      let errorMessage = "Error de conexión desconocido";
      
      if (error.message?.includes("timeout") || error.message?.includes("Timeout")) {
        errorMessage = "Timeout de conexión. Verifica tu conexión a internet.";
      } else if (error.code === "NETWORK_ERROR" || error.message?.includes("network")) {
        errorMessage = "Error de red. Verifica tu conexión a internet y firewall.";
      } else if (error.code === "INVALID_PARAMS") {
        errorMessage = "Parámetros inválidos. Verifica el App ID y nombre del canal.";
      } else if (error.code === "NOT_SUPPORTED") {
        errorMessage = "Tu navegador no soporta videollamadas WebRTC.";
      } else if (error.message?.includes("WebSocket")) {
        errorMessage = "Error de WebSocket. Tu red puede estar bloqueando las conexiones.";
      }
      
      const customError = new Error(errorMessage);
      (customError as any).originalError = error;
      throw customError;
    }
  }

  private async createLocalTracks() {
    try {
      // Crear track de micrófono
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "music_standard",
      });

      // Crear track de cámara con configuración inicial
      const videoConfig = this.videoConfigs[this.currentVideoConfig];
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: {
          width: videoConfig.width,
          height: videoConfig.height,
          frameRate: videoConfig.frameRate,
          bitrateMin: 1000,
          bitrateMax: 3000,
        },
      });

      // Publicar tracks
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
      
      // Reproducir video local
      const localDiv = document.getElementById(this.LOCAL_CONTAINER_ID);
      if (localDiv && this.localVideoTrack) {
        localDiv.innerHTML = "";
        this.localVideoTrack.play(localDiv);
        console.log("✅ Video local iniciado (Veterinario)");
      }

      console.log("✅ Tracks locales creados y publicados (Veterinario)");
    } catch (error) {
      console.error("❌ Error al crear tracks locales (Veterinario):", error);
      throw error;
    }
  }

  async leave() {
    try {
      console.log("🚪 Saliendo del canal (Veterinario)...");
      
      // Limpiar video local
      const localDiv = document.getElementById(this.LOCAL_CONTAINER_ID);
      if (localDiv) localDiv.innerHTML = "";
      
      // Limpiar video remoto
      const remoteDiv = document.getElementById(this.REMOTE_CONTAINER_ID);
      if (remoteDiv) remoteDiv.innerHTML = "";

      // Cerrar tracks locales
      this.localAudioTrack?.close();
      this.localVideoTrack?.close();
      this.localAudioTrack = null;
      this.localVideoTrack = null;

      // Salir del canal
      await this.client.leave();
      this.isConnected = false;
      this.remoteUsers.clear();
      
      console.log("✅ Salida exitosa del canal (Veterinario)");
    } catch (error) {
      console.error("❌ Error al salir del canal (Veterinario):", error);
    }
  }

  muteAudio(): boolean {
    if (this.localAudioTrack) {
      this.localAudioTrack.setMuted(true);
      console.log("🔇 Audio silenciado (Veterinario)");
      return true;
    }
    return false;
  }

  unmuteAudio(): boolean {
    if (this.localAudioTrack) {
      this.localAudioTrack.setMuted(false);
      console.log("🔊 Audio activado (Veterinario)");
      return true;
    }
    return false;
  }

  disableVideo(): boolean {
    if (this.localVideoTrack) {
      this.localVideoTrack.setMuted(true);
      console.log("📷❌ Video deshabilitado (Veterinario)");
      return true;
    }
    return false;
  }

  enableVideo(): boolean {
    if (this.localVideoTrack) {
      this.localVideoTrack.setMuted(false);
      console.log("📷✅ Video habilitado (Veterinario)");
      return true;
    }
    return false;
  }

  switchVideoQuality(quality: "high" | "medium" | "low") {
    const config = this.videoConfigs[quality];
    if (this.localVideoTrack && config) {
      this.localVideoTrack.setEncoderConfiguration({
        width: config.width,
        height: config.height,
        frameRate: config.frameRate,
      });
      this.currentVideoConfig = quality;
      console.log(`📺 Calidad de video cambiada a ${quality} (Veterinario):`, config);
    }
  }

  getMediaState(): MediaState {
    return {
      audioEnabled: this.localAudioTrack ? !this.localAudioTrack.muted : false,
      videoEnabled: this.localVideoTrack ? !this.localVideoTrack.muted : false,
      audioTrackExists: !!this.localAudioTrack,
      videoTrackExists: !!this.localVideoTrack,
      remoteUserCount: this.remoteUsers.size,
      currentVideoQuality: this.currentVideoConfig,
      videoConfig: this.videoConfigs[this.currentVideoConfig]
    };
  }
}
