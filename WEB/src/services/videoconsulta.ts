import AgoraRTC, {
  IAgoraRTCClient,
  ILocalVideoTrack,
  ILocalAudioTrack,
  IRemoteVideoTrack,
  UID,
} from "agora-rtc-sdk-ng";

export class AgoraService {
  private static instance: AgoraService | null = null;
  client!: IAgoraRTCClient;
  localAudioTrack: ILocalAudioTrack | null = null;
  localVideoTrack: ILocalVideoTrack | null = null;
  isConnected: boolean = false;
  remoteUsers: Map<UID, any> = new Map();
  currentVideoConfig: "high" | "medium" | "low" = "high";
  private isJoining: boolean = false; // Flag to prevent multiple join attempts

  constructor() {
    // Prevenir múltiples instancias
    if (AgoraService.instance) {
      console.warn("⚠️ Intentando crear múltiples instancias de AgoraService. Usando la existente.");
      return AgoraService.instance;
    }

    console.log("🔧 Creando nueva instancia de AgoraService");
    
    // Configuración optimizada para mejor rendimiento
    this.client = AgoraRTC.createClient({ 
      mode: "rtc", 
      codec: "vp8" 
    });
    
    // Configuraciones de red para mejor fluidez
    AgoraRTC.setLogLevel(4); // Reducir logs para producción (4 = WARNING)
    
    this.setupRemoteHandlers();
    AgoraService.instance = this;
  }

  // Método estático para obtener la instancia singleton
  static getInstance(): AgoraService {
    if (!AgoraService.instance) {
      AgoraService.instance = new AgoraService();
    }
    return AgoraService.instance;
  }

  // Método para destruir la instancia (útil para testing o reset completo)
  static destroyInstance() {
    if (AgoraService.instance) {
      AgoraService.instance.leave();
      AgoraService.instance = null;
      console.log("🗑️ Instancia de AgoraService destruida");
    }
  }

  private setupRemoteHandlers() {
    this.client.on("user-published", async (user, mediaType) => {
      try {
        console.log(`🔔 Usuario ${user.uid} publicó ${mediaType}`);
        
        // 🚫 No subscribirse a sí mismo para evitar eco
        if (user.uid === this.client.uid) {
          return;
        }

        await this.client.subscribe(user, mediaType);
        this.remoteUsers.set(user.uid, user);
        console.log(`✅ Suscripción exitosa a ${user.uid} para ${mediaType}`);

        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
          const remoteDiv = document.getElementById("remote-player");
          
          if (remoteDiv) {
            remoteDiv.innerHTML = "";
            remoteVideoTrack.play(remoteDiv);
            console.log(`✅ Video remoto renderizado de ${user.uid}`);
          } else {
            console.error("❌ No se encontró el div remote-player");
          }
        }

        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.play();
          console.log(`✅ Audio remoto iniciado de ${user.uid}`);
        }
        
      } catch (err) {
        console.error("❌ Error al suscribirse al usuario remoto:", err);
      }
    });

    this.client.on("user-unpublished", (user, mediaType) => {
      console.log(`📤 Usuario ${user.uid} dejó de publicar ${mediaType}`);
      
      if (mediaType === "video") {
        const remoteDiv = document.getElementById("remote-player");
        if (remoteDiv) remoteDiv.innerHTML = "";
      }
      
      if (!mediaType) {
        this.remoteUsers.delete(user.uid);
      }
    });

    this.client.on("user-left", (user) => {
      console.log(`🚪 Usuario ${user.uid} salió del canal`);
      this.remoteUsers.delete(user.uid);
      const remoteDiv = document.getElementById("remote-player");
      if (remoteDiv) remoteDiv.innerHTML = "";
    });

    this.client.on("exception", (evt) => {
      console.warn(`Excepción de red: ${evt.code} - ${evt.msg}`);
      if (evt.code === 2003) {
        console.warn("Red débil: calidad de audio/video reducida.");
      }
    });

    // Manejo de cambios de red con ajuste automático de calidad
    this.client.on("network-quality", (stats) => {
      const downlink = stats.downlinkNetworkQuality;
      const uplink = stats.uplinkNetworkQuality;
      
      console.log(`Calidad de red - Downlink: ${downlink}, Uplink: ${uplink}`);
      
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
      console.log("Ya está conectado.");
      return;
    }

    try {
      console.log(`🔗 Conectando al canal: ${channel}`);
      const actualUid = await this.client.join(appId, channel, null, uid);
      console.log(`✅ Conectado con UID: ${actualUid}`);

      // Crear pistas de audio y video
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "music_standard",
      });
      this.localAudioTrack = audioTrack;
      console.log("🎤 Audio track creado exitosamente");

      let videoTrack: ILocalVideoTrack | null = null;
      try {
        // Crear track de video con configuración simplificada y confiable
        videoTrack = await AgoraRTC.createCameraVideoTrack({
          // Configuración básica que siempre funciona
          encoderConfig: "720p_3",  // Preset confiable de Agora para 720p 30fps
          optimizationMode: "motion",
          facingMode: "user",
        });
        
        this.localVideoTrack = videoTrack;
        console.log("📹 Video track creado exitosamente, enabled:", videoTrack.enabled);
        const localDiv = document.getElementById("local-player");
        if (localDiv) {
          // Limpiar contenido previo
          localDiv.innerHTML = "";
          videoTrack.play(localDiv);
          console.log("✅ Video local renderizado exitosamente en #local-player");
        } else {
          console.error("❌ No se encontró el div local-player");
        }
        
        await this.client.publish([audioTrack, videoTrack]);
        console.log("📹 Cámara y 🎤 micrófono publicados con configuración optimizada.");
      } catch (videoError) {
        console.warn("⚠️ Error con la configuración de video avanzada, intentando configuración básica...", videoError);
        
        // Fallback: Intentar con configuración muy básica
        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack();
          this.localVideoTrack = videoTrack;
          const localDiv = document.getElementById("local-player");
          if (localDiv) {
            localDiv.innerHTML = "";
            videoTrack.play(localDiv);
            console.log("✅ Video local renderizado con configuración básica");
          }
          await this.client.publish([audioTrack, videoTrack]);
          console.log("📹 Video publicado con configuración básica");
        } catch (basicVideoError) {
          console.error("❌ No se pudo acceder a la cámara. Solo se publicará audio.", basicVideoError);
          this.localVideoTrack = null;
          await this.client.publish([audioTrack]);
        }
      }

      this.isConnected = true;
      
      // Habilitar estadísticas de red
      this.client.enableAudioVolumeIndicator();
      
      // Debug del estado final
      console.log("🎯 Join completado, verificando estado final:");
      this.debugTrackState();
      
    } catch (error) {
      console.error("Error al unirse a la llamada:", error);
      // Retry con backoff exponencial
      setTimeout(() => this.join(appId, channel, uid), 2000);
    }
  }

  async leave() {
    try {
      // Detener las pistas locales
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }
      
      if (this.localVideoTrack) {
        this.localVideoTrack.stop();
        this.localVideoTrack.close();
        this.localVideoTrack = null;
      }

      // Salir del canal
      await this.client.leave();

      // Limpiar los videos de los recuadros
      const remoteDiv = document.getElementById("remote-player");
      if (remoteDiv) remoteDiv.innerHTML = "";
      const localDiv = document.getElementById("local-player");
      if (localDiv) localDiv.innerHTML = "";

      // Limpiar el mapa de usuarios remotos
      this.remoteUsers.clear();
      
      this.isConnected = false;
      console.log("🚪 Salió de la llamada exitosamente");
    } catch (error) {
      console.error("Error al salir de la llamada:", error);
    }
  }

  // Métodos de control de audio con verificación de estado
  muteAudio(): boolean {
    if (this.localAudioTrack) {
      try {
        this.localAudioTrack.setEnabled(false);
        console.log("✅ Audio silenciado");
        return true;
      } catch (error) {
        console.error("❌ Error al silenciar audio:", error);
        return false;
      }
    } else {
      console.warn("❌ No hay track de audio para silenciar");
      return false;
    }
  }

  unmuteAudio(): boolean {
    if (this.localAudioTrack) {
      try {
        this.localAudioTrack.setEnabled(true);
        console.log("✅ Audio activado");
        return true;
      } catch (error) {
        console.error("❌ Error al activar audio:", error);
        return false;
      }
    } else {
      console.warn("❌ No hay track de audio para activar");
      return false;
    }
  }

  // Métodos de control de video con verificación de estado
  disableVideo(): boolean {
    if (this.localVideoTrack) {
      try {
        this.localVideoTrack.setEnabled(false);
        console.log("✅ Video desactivado");
        return true;
      } catch (error) {
        console.error("❌ Error al desactivar video:", error);
        return false;
      }
    } else {
      console.warn("❌ No hay track de video para desactivar");
      return false;
    }
  }

  enableVideo(): boolean {
    if (this.localVideoTrack) {
      try {
        this.localVideoTrack.setEnabled(true);
        console.log("✅ Video activado");
        return true;
      } catch (error) {
        console.error("❌ Error al activar video:", error);
        return false;
      }
    } else {
      console.warn("❌ No hay track de video para activar");
      return false;
    }
  }

  // Método para obtener estadísticas de calidad
  async getNetworkQuality(): Promise<any> {
    try {
      return await this.client.getRemoteNetworkQuality();
    } catch (error) {
      console.error("Error obteniendo calidad de red:", error);
      return null;
    }
  }

  // Método para verificar si los tracks están activos
  getMediaState() {
    // Convertir preset a información legible
    const getPresetInfo = (preset: string) => {
      const presetMap: {[key: string]: {width: number, height: number, frameRate: number}} = {
        "720p_6": { width: 1280, height: 720, frameRate: 60 },
        "720p_3": { width: 1280, height: 720, frameRate: 30 },
        "480p_1": { width: 640, height: 480, frameRate: 15 }
      };
      return presetMap[preset] || { width: 1280, height: 720, frameRate: 30 };
    };

    const state = {
      audioEnabled: this.localAudioTrack?.enabled || false,
      videoEnabled: this.localVideoTrack?.enabled || false,
      audioTrackExists: !!this.localAudioTrack,
      videoTrackExists: !!this.localVideoTrack,
      isConnected: this.isConnected,
      remoteUserCount: this.remoteUsers.size,
      currentVideoQuality: this.currentVideoConfig,
      videoConfig: getPresetInfo(this.getVideoConfig(this.currentVideoConfig))
    };

    // Solo hacer log cuando hay cambios importantes
    if (this.isConnected && (state.audioTrackExists || state.videoTrackExists)) {
      // Log menos frecuente para evitar spam
      if (Math.random() < 0.1) { // 10% de probabilidad
        console.log("📊 Estado medios:", { 
          audio: `${state.audioTrackExists ? '✅' : '❌'} ${state.audioEnabled ? 'ON' : 'OFF'}`,
          video: `${state.videoTrackExists ? '✅' : '❌'} ${state.videoEnabled ? 'ON' : 'OFF'}`,
          remote: state.remoteUserCount 
        });
      }
    }
    
    return state;
  }

  // Configuraciones de video para diferentes calidades (usando presets de Agora)
  private getVideoConfig(quality: "high" | "medium" | "low") {
    const configs = {
      high: "720p_6",     // 720p 60fps - preset de Agora
      medium: "720p_3",   // 720p 30fps - preset de Agora  
      low: "480p_1",      // 480p 15fps - preset de Agora
    };
    return configs[quality];
  }

  // Método para cambiar la calidad de video en tiempo real
  async switchVideoQuality(quality: "high" | "medium" | "low") {
    if (!this.isConnected || !this.localVideoTrack) return;
    
    try {
      // Guardar el estado actual del video
      const wasEnabled = this.localVideoTrack.enabled;
      
      // Crear nuevo track con la nueva calidad usando presets
      const videoConfig = this.getVideoConfig(quality);
      const newVideoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: videoConfig,
        optimizationMode: quality === "high" ? "motion" : "detail",
        facingMode: "user",
      });
      
      // Unpublish el track anterior
      await this.client.unpublish([this.localVideoTrack]);
      
      // Cerrar el track anterior
      this.localVideoTrack.stop();
      this.localVideoTrack.close();
      
      // Asignar el nuevo track
      this.localVideoTrack = newVideoTrack;
      this.currentVideoConfig = quality;
      
      // Restaurar el estado enabled
      this.localVideoTrack.setEnabled(wasEnabled);
      
      // Renderizar en el div local
      const localDiv = document.getElementById("local-player");
      if (localDiv) {
        localDiv.innerHTML = "";
        this.localVideoTrack.play(localDiv);
      }
      
      // Publish el nuevo track
      await this.client.publish([this.localVideoTrack]);
      
      console.log(`✅ Calidad de video cambiada a: ${quality}`);
    } catch (error) {
      console.error("Error al cambiar calidad de video:", error);
      // En caso de error, intentar restaurar la configuración anterior
      console.log("Intentando restaurar configuración de video...");
      await this.restoreVideoAfterError();
    }
  }

  // Método para restaurar video después de un error
  private async restoreVideoAfterError() {
    try {
      if (this.localVideoTrack) {
        this.localVideoTrack.stop();
        this.localVideoTrack.close();
      }
      
      // Crear un nuevo track básico
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      this.localVideoTrack = videoTrack;
      
      const localDiv = document.getElementById("local-player");
      if (localDiv) {
        localDiv.innerHTML = "";
        videoTrack.play(localDiv);
      }
      
      await this.client.publish([this.localVideoTrack]);
      console.log("✅ Video restaurado exitosamente");
    } catch (restoreError) {
      console.error("❌ No se pudo restaurar el video:", restoreError);
      this.localVideoTrack = null;
    }
  }

  // Método público para cambiar calidad manualmente
  async setVideoQuality(quality: "high" | "medium" | "low") {
    await this.switchVideoQuality(quality);
  }

  // Método de debugging para verificar el estado de los tracks
  debugTrackState() {
    console.log("🔍 DEBUG - Estado actual de tracks:");
    console.log("  - Audio track existe:", !!this.localAudioTrack);
    console.log("  - Video track existe:", !!this.localVideoTrack);
    console.log("  - Conectado:", this.isConnected);
    
    if (this.localAudioTrack) {
      console.log("  - Audio enabled:", this.localAudioTrack.enabled);
      console.log("  - Audio track type:", typeof this.localAudioTrack);
    }
    
    if (this.localVideoTrack) {
      console.log("  - Video enabled:", this.localVideoTrack.enabled);
      console.log("  - Video track type:", typeof this.localVideoTrack);
    }
    
    console.log("  - Usuarios remotos:", this.remoteUsers.size);
    
    // También debuggear usuarios remotos
    this.debugRemoteUsers();
  }

  // Método de debugging para verificar usuarios remotos
  debugRemoteUsers() {
    console.log("🔍 DEBUG - Usuarios remotos:");
    console.log("  - Total usuarios remotos:", this.remoteUsers.size);
    console.log("  - Lista de usuarios remotos:");
    
    this.remoteUsers.forEach((user, uid) => {
      console.log(`    - UID: ${uid}`);
      console.log(`      - Tiene video: ${!!user.videoTrack}`);
      console.log(`      - Tiene audio: ${!!user.audioTrack}`);
      console.log(`      - Video enabled: ${user.videoTrack?.enabled || 'N/A'}`);
      console.log(`      - Audio enabled: ${user.audioTrack?.enabled || 'N/A'}`);
    });
    
    // También verificar si los divs existen
    const localDiv = document.getElementById("local-player");
    const remoteDiv = document.getElementById("remote-player");
    console.log("  - Div local-player existe:", !!localDiv);
    console.log("  - Div remote-player existe:", !!remoteDiv);
    
    if (remoteDiv) {
      console.log("  - Contenido de remote-player:", remoteDiv.innerHTML.length > 0 ? "Tiene contenido" : "Vacío");
    }
  }
}
