import { Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalVideoTrack,
  ILocalAudioTrack,
  IRemoteVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import { AGORA_CONFIG, LOG_CONFIG } from '../config/agora-config';
import { PermissionsService } from './permissions.service';

export interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  audioTrackExists: boolean;
  videoTrackExists: boolean;
  remoteUserCount: number;
  currentVideoQuality: 'high' | 'medium' | 'low';
  videoConfig: { width: number; height: number; frameRate: number };
  isScreenSharing: boolean;
  isLocalSpeaking: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VideoConsultaService {
  private static instance: VideoConsultaService | null = null;
  client!: IAgoraRTCClient;
  localAudioTrack: ILocalAudioTrack | null = null;
  localVideoTrack: ILocalVideoTrack | null = null;
  isConnected: boolean = false;
  remoteUsers: Map<UID, any> = new Map();
  currentVideoConfig: 'high' | 'medium' | 'low' = 'high';
  private isJoining: boolean = false;
  private permissionsService: PermissionsService = new PermissionsService(null as any);
  
  // Nuevas propiedades para screen sharing
  private screenVideoTrack: ILocalVideoTrack | null = null;
  private originalVideoTrack: ILocalVideoTrack | null = null;
  public isScreenSharing: boolean = false;
  
  // Propiedades para volume indicators
  public isLocalSpeaking: boolean = false;
  public remoteUsersVolumeMap: Map<UID, boolean> = new Map();

  constructor() {
    if (VideoConsultaService.instance) {
      console.warn('⚠️ Intentando crear múltiples instancias de VideoConsultaService. Usando la existente.');
      return VideoConsultaService.instance;
    }

    console.log('🔧 Creando nueva instancia de VideoConsultaService');
    
    this.client = AgoraRTC.createClient(AGORA_CONFIG.CLIENT_CONFIG);
    
    // Configurar nivel de logs según el entorno
    const isProduction = false; // Cambiar a true en producción
    AgoraRTC.setLogLevel(isProduction ? LOG_CONFIG.production : LOG_CONFIG.development);
    
    this.setupRemoteHandlers();
    VideoConsultaService.instance = this;
  }

  static getInstance(): VideoConsultaService {
    if (!VideoConsultaService.instance) {
      VideoConsultaService.instance = new VideoConsultaService();
    }
    return VideoConsultaService.instance;
  }

  static destroyInstance() {
    if (VideoConsultaService.instance) {
      // Limpiar recursos específicos
      VideoConsultaService.instance.screenVideoTrack?.close();
      VideoConsultaService.instance.originalVideoTrack?.close();
      VideoConsultaService.instance.isScreenSharing = false;
      VideoConsultaService.instance.remoteUsersVolumeMap.clear();
      
      VideoConsultaService.instance.leave();
      VideoConsultaService.instance = null;
      console.log('🗑️ Instancia de VideoConsultaService destruida');
    }
  }

  private setupRemoteHandlers() {
    // Configurar indicadores de volumen
    this.client.enableAudioVolumeIndicator();
    
    this.client.on('volume-indicator', (volumes) => {
      volumes.forEach((volume) => {
        const isHighVolume = volume.level > 5;
        
        if (volume.uid === 'local' || volume.uid === this.client.uid) {
          this.isLocalSpeaking = isHighVolume;
          
          // Aplicar efecto visual al video local
          const localElement = document.getElementById('local-player');
          if (localElement) {
            localElement.classList.toggle('speaking', isHighVolume);
          }
        } else {
          this.remoteUsersVolumeMap.set(volume.uid, isHighVolume);
          
          // Aplicar efecto visual al elemento remoto
          const remoteElement = document.getElementById('remote-player');
          if (remoteElement) {
            remoteElement.classList.toggle('speaking', isHighVolume);
          }
        }
      });
    });

    this.client.on('user-published', async (user, mediaType) => {
      try {
        console.log(`🔔 Usuario ${user.uid} publicó ${mediaType}`);
        
        if (user.uid === this.client.uid) {
          return;
        }

        await this.client.subscribe(user, mediaType);
        this.remoteUsers.set(user.uid, user);
        console.log(`✅ Suscripción exitosa a ${user.uid} para ${mediaType}`);

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
          const remoteDiv = document.getElementById('remote-player');
          
          if (remoteDiv) {
            remoteDiv.innerHTML = '';
            remoteVideoTrack.play(remoteDiv);
            console.log(`✅ Video remoto renderizado de ${user.uid}`);
          } else {
            console.error('❌ No se encontró el div remote-player');
          }
        }

        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.play();
          console.log(`✅ Audio remoto iniciado de ${user.uid}`);
        }
        
      } catch (err) {
        console.error('❌ Error al suscribirse al usuario remoto:', err);
      }
    });

    this.client.on('user-unpublished', (user, mediaType) => {
      console.log(`📤 Usuario ${user.uid} dejó de publicar ${mediaType}`);
      
      if (mediaType === 'video') {
        const remoteDiv = document.getElementById('remote-player');
        if (remoteDiv) {
          remoteDiv.innerHTML = '<p class="no-video">Sin video</p>';
        }
      }
      
      this.remoteUsers.delete(user.uid);
    });

    this.client.on('user-left', (user) => {
      console.log(`👋 Usuario ${user.uid} salió del canal`);
      this.remoteUsers.delete(user.uid);
      
      const remoteDiv = document.getElementById('remote-player');
      if (remoteDiv) {
        remoteDiv.innerHTML = '<p class="no-video">Esperando participante...</p>';
      }
    });

    this.client.on('connection-state-changed', (curState: any, revState: any) => {
      console.log(`🔄 Estado de conexión cambió de ${revState} a ${curState}`);
      this.isConnected = curState === 'CONNECTED';
    });

    this.client.on('exception', (evt: any) => {
      console.error('🚨 Excepción en AgoraRTC:', evt);
    });
  }

  async join(appId: string, channelName: string, token?: string): Promise<void> {
    if (this.isJoining) {
      console.warn('⚠️ Ya se está intentando unir al canal');
      return;
    }
    
    if (this.isConnected) {
      console.warn('⚠️ Ya estás conectado a un canal');
      return;
    }

    this.isJoining = true;
    
    try {
      console.log(`🚀 Intentando unirse al canal: ${channelName}`);
      
      const uid = await this.client.join(appId, channelName, token || null);
      console.log(`✅ Unido al canal con UID: ${uid}`);
      
      await this.createLocalTracks();
      await this.publishLocalTracks();
      
      this.isConnected = true;
      console.log('✅ Conexión completada exitosamente');
      
    } catch (error: any) {
      console.error('❌ Error al unirse al canal:', error);
      this.isConnected = false;
      
      // Reintento automático después de 5 segundos si hay problemas de red
      if (error.code === 'NETWORK_ERROR' || error.code === 'NETWORK_TIMEOUT' || error.name === 'AgoraRTCError') {
        console.log('🔄 Reintentando conexión en 5 segundos...');
        setTimeout(() => {
          this.join(appId, channelName, token).catch(retryError => {
            console.error('❌ Falló el reintento automático:', retryError);
          });
        }, 5000);
      }
      
      throw error;
    } finally {
      this.isJoining = false;
    }
  }

  private async createLocalTracks(): Promise<void> {
    try {
      console.log('🎬 Creando tracks locales...');
      
      const videoConfig = this.getVideoConfig();
      
      [this.localAudioTrack, this.localVideoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(AGORA_CONFIG.AUDIO_CONFIG),
        AgoraRTC.createCameraVideoTrack({
          encoderConfig: videoConfig,
          optimizationMode: AGORA_CONFIG.CLIENT_CONFIG.optimizationMode
        })
      ]);
      
      console.log('✅ Tracks locales creados exitosamente');
      console.log('🎥 Local video track:', this.localVideoTrack);
      
      // Renderizar video local con retry
      this.renderLocalVideo();
      
    } catch (error) {
      console.error('❌ Error al crear tracks locales:', error);
      throw error;
    }
  }

  private renderLocalVideo(retries: number = 3): void {
    const localDiv = document.getElementById('local-player');
    
    if (localDiv && this.localVideoTrack) {
      try {
        // Limpiar contenido previo
        localDiv.innerHTML = '';
        
        // Renderizar el video local
        this.localVideoTrack.play(localDiv);
        console.log('✅ Video local renderizado exitosamente');
        
        // Verificar que se renderizó correctamente
        setTimeout(() => {
          const videoElement = localDiv.querySelector('video');
          if (videoElement) {
            console.log('🎯 Elemento video local encontrado:', videoElement);
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
          } else {
            console.warn('⚠️ No se encontró elemento video en local-player');
            if (retries > 0) {
              console.log(`🔄 Reintentando renderizado local (${retries} intentos restantes)`);
              setTimeout(() => this.renderLocalVideo(retries - 1), 500);
            }
          }
        }, 500);
        
      } catch (error) {
        console.error('❌ Error al renderizar video local:', error);
        if (retries > 0) {
          setTimeout(() => this.renderLocalVideo(retries - 1), 1000);
        }
      }
    } else {
      console.warn('⚠️ localDiv o localVideoTrack no disponible');
      if (!localDiv) console.warn('❌ No se encontró elemento local-player');
      if (!this.localVideoTrack) console.warn('❌ localVideoTrack no existe');
      
      if (retries > 0) {
        setTimeout(() => this.renderLocalVideo(retries - 1), 500);
      }
    }
  }

  private async publishLocalTracks(): Promise<void> {
    try {
      if (this.localAudioTrack && this.localVideoTrack) {
        await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
        console.log('✅ Tracks locales publicados');
      }
    } catch (error) {
      console.error('❌ Error al publicar tracks locales:', error);
      throw error;
    }
  }

  private getVideoConfig() {
    return AGORA_CONFIG.VIDEO_CONFIGS[this.currentVideoConfig];
  }

  async leave(): Promise<void> {
    try {
      console.log('🚪 Saliendo del canal...');
      
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
      
      this.remoteUsers.clear();
      
      if (this.isConnected) {
        await this.client.leave();
        console.log('✅ Salió del canal exitosamente');
      }
      
      this.isConnected = false;
      this.isJoining = false;
      
      // Limpiar divs de video
      const localDiv = document.getElementById('local-player');
      const remoteDiv = document.getElementById('remote-player');
      
      if (localDiv) localDiv.innerHTML = '';
      if (remoteDiv) remoteDiv.innerHTML = '';
      
    } catch (error) {
      console.error('❌ Error al salir del canal:', error);
      throw error;
    }
  }

  muteAudio(): boolean {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.setEnabled(false);
        console.log('🔇 Audio silenciado');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error al silenciar audio:', error);
      return false;
    }
  }

  unmuteAudio(): boolean {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.setEnabled(true);
        console.log('🔊 Audio activado');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error al activar audio:', error);
      return false;
    }
  }

  disableVideo(): boolean {
    try {
      if (this.localVideoTrack) {
        this.localVideoTrack.setEnabled(false);
        console.log('📹 Video desactivado');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error al desactivar video:', error);
      return false;
    }
  }

  enableVideo(): boolean {
    try {
      if (this.localVideoTrack) {
        this.localVideoTrack.setEnabled(true);
        console.log('📸 Video activado');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error al activar video:', error);
      return false;
    }
  }

  getMediaState(): MediaState {
    return {
      audioEnabled: this.localAudioTrack ? this.localAudioTrack.enabled : false,
      videoEnabled: this.localVideoTrack ? this.localVideoTrack.enabled : false,
      audioTrackExists: !!this.localAudioTrack,
      videoTrackExists: !!this.localVideoTrack,
      remoteUserCount: this.remoteUsers.size,
      currentVideoQuality: this.currentVideoConfig,
      videoConfig: this.getVideoConfig(),
      isScreenSharing: this.isScreenSharing,
      isLocalSpeaking: this.isLocalSpeaking
    };
  }

  setVideoQuality(quality: 'high' | 'medium' | 'low'): void {
    this.currentVideoConfig = quality;
    console.log(`📊 Calidad de video cambiada a: ${quality}`);
  }

  // Método público para re-renderizar video local
  reRenderLocalVideo(): void {
    console.log('🔄 Re-renderizando video local...');
    this.renderLocalVideo();
  }

  // Método para verificar si el video local está visible
  isLocalVideoVisible(): boolean {
    const localDiv = document.getElementById('local-player');
    if (localDiv) {
      const videoElement = localDiv.querySelector('video');
      return !!videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0;
    }
    return false;
  }

  // Verificar permisos de cámara y micrófono
  async checkPermissions() {
    const permissions = await this.permissionsService.checkMediaPermissions();
    console.log('🔒 Estado de permisos:', permissions);
    return permissions;
  }

  // Solicitar permisos y obtener información del entorno
  async getEnvironmentInfo() {
    const info = await this.permissionsService.getEnvironmentInfo();
    console.log('🌐 Información del entorno:', info);
    return info;
  }

  // Verificar si el entorno es seguro (HTTPS)
  isSecureContext(): boolean {
    return this.permissionsService.isSecureContext();
  }

  // Obtener dispositivos de media disponibles
  async getMediaDevices() {
    const devices = await this.permissionsService.getMediaDevices();
    console.log('📱 Dispositivos de media:', devices);
    return devices;
  }

  // Compartir pantalla
  async shareScreen(): Promise<boolean> {
    try {
      console.log('🖥️ Iniciando compartir pantalla...');
      
      const screenResult = await AgoraRTC.createScreenVideoTrack({});
      let screenVideoTrack: ILocalVideoTrack;
      
      if (Array.isArray(screenResult)) {
        [screenVideoTrack] = screenResult;
      } else {
        screenVideoTrack = screenResult;
      }

      // Guardar video actual
      this.originalVideoTrack = this.localVideoTrack;
      
      if (this.localVideoTrack) {
        await this.client.unpublish([this.localVideoTrack]);
        this.localVideoTrack.close();
      }

      // Publicar pantalla
      await this.client.publish([screenVideoTrack]);
      
      // Renderizar en el player local
      const localDiv = document.getElementById('local-player');
      if (localDiv) {
        localDiv.innerHTML = '';
        screenVideoTrack.play(localDiv);
      }

      this.screenVideoTrack = screenVideoTrack;
      this.localVideoTrack = screenVideoTrack;
      this.isScreenSharing = true;
      
      console.log('✅ Compartiendo pantalla exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error compartiendo pantalla:', error);
      return false;
    }
  }

  // Detener compartir pantalla
  async stopScreenShare(): Promise<boolean> {
    try {
      if (!this.screenVideoTrack) {
        console.warn('⚠️ No hay pantalla siendo compartida');
        return false;
      }

      console.log('🛑 Deteniendo compartir pantalla...');

      // Despublicar pantalla
      await this.client.unpublish([this.screenVideoTrack]);
      this.screenVideoTrack.close();
      this.screenVideoTrack = null;

      // Restaurar cámara si no estaba deshabilitada
      if (!this.isCameraDisabled()) {
        const config = AGORA_CONFIG.VIDEO_CONFIGS[this.currentVideoConfig];
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: {
            width: config.width,
            height: config.height,
            frameRate: config.frameRate,
            bitrateMin: config.bitrateMin,
            bitrateMax: config.bitrateMax
          }
        });
        
        this.localVideoTrack = videoTrack;
        await this.client.publish([videoTrack]);
        
        // Renderizar video local
        this.renderLocalVideo();
      } else {
        this.localVideoTrack = null;
      }

      this.isScreenSharing = false;
      this.originalVideoTrack = null;
      
      console.log('✅ Pantalla dejó de compartirse');
      return true;
    } catch (error) {
      console.error('❌ Error deteniendo compartir pantalla:', error);
      return false;
    }
  }

  // Verificar si la cámara está deshabilitada
  private isCameraDisabled(): boolean {
    return !this.getMediaState().videoEnabled;
  }
}
