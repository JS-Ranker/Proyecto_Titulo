import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { VideoConsultaService, MediaState } from '../services/video-consulta.service';
import { VideoOptimizer } from '../utils/video-optimizer';
import { AGORA_CONFIG } from '../config/agora-config';
import { PermissionsService } from '../services/permissions.service';
import { AndroidPermissionsService } from '../services/android-permissions.service';

@Component({
  selector: 'app-video-consulta',
  templateUrl: './video-consulta.page.html',
  styleUrls: ['./video-consulta.page.scss'],
  standalone: false
})
export class VideoConsultaPage implements OnInit, OnDestroy {
  channelName: string = '';
  inCall: boolean = false;
  isMuted: boolean = false;
  isCameraOff: boolean = false;
  isConnecting: boolean = false;
  connectionError: string = '';
  isViewSwapped: boolean = false; // Para intercambiar las vistas
  
  mediaState: MediaState = {
    audioEnabled: false,
    videoEnabled: false,
    audioTrackExists: false,
    videoTrackExists: false,
    remoteUserCount: 0,
    currentVideoQuality: 'high',
    videoConfig: { width: 1280, height: 720, frameRate: 60 },
    isScreenSharing: false,
    isLocalSpeaking: false
  };

  private videoService: VideoConsultaService;
  private videoOptimizer: VideoOptimizer;
  private mediaStateInterval: any;
  private permissionsService: PermissionsService;
  private androidPermissions: AndroidPermissionsService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private alertController: AlertController,
    permissionsService: PermissionsService,
    androidPermissions: AndroidPermissionsService
  ) {
    this.videoService = VideoConsultaService.getInstance();
    this.videoOptimizer = VideoOptimizer.getInstance();
    this.permissionsService = permissionsService;
    this.androidPermissions = androidPermissions;
  }

  ngOnInit() {
    // Obtener el canal de la URL si está disponible
    this.route.queryParams.subscribe(params => {
      if (params['canal']) {
        this.channelName = params['canal'];
      }
    });

    // Inicializar permisos Android
    this.initializeAndroidPermissions();

    // Verificar permisos y entorno al inicializar
    this.checkEnvironmentAndPermissions();

    // Aplicar optimizaciones de video
    const optimization = this.videoOptimizer.useVideoOptimization();
    optimization.optimizeOnMount();

    console.log(`🎯 Recomendación automática: ${optimization.recommendation.quality} - ${optimization.recommendation.description}`);
    console.log(`💻 Capacidades del dispositivo:`, optimization.capabilities);

    // Actualizar estado de los medios
    this.mediaStateInterval = setInterval(() => {
      this.updateMediaState();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.mediaStateInterval) {
      clearInterval(this.mediaStateInterval);
    }
    
    // Limpiar cuando el componente se destruya
    if (this.inCall && this.videoService.isConnected) {
      console.log('🚨 Componente desmontado durante llamada - destruyendo singleton');
      VideoConsultaService.destroyInstance();
    }
  }

  private updateMediaState() {
    if (this.videoService) {
      this.mediaState = this.videoService.getMediaState();
      
      // Sincronizar estados de UI con el SDK real
      if (this.mediaState.audioTrackExists && this.isMuted !== !this.mediaState.audioEnabled) {
        this.isMuted = !this.mediaState.audioEnabled;
      }
      if (this.mediaState.videoTrackExists && this.isCameraOff !== !this.mediaState.videoEnabled) {
        this.isCameraOff = !this.mediaState.videoEnabled;
      }
    }
  }

  async startCall() {
    if (!this.channelName.trim()) {
      this.connectionError = 'Por favor ingresa un nombre de canal';
      return;
    }
    
    this.isConnecting = true;
    this.connectionError = '';
    
    const loading = await this.loadingController.create({
      message: 'Conectando a la videollamada...',
    });
    await loading.present();
    
    try {
      await this.videoService.join(AGORA_CONFIG.APP_ID, this.channelName);
      this.inCall = true;
      
      // Inicializar estados de audio/video correctamente
      setTimeout(() => {
        if (this.videoService) {
          const state = this.videoService.getMediaState();
          this.isMuted = !state.audioEnabled;
          this.isCameraOff = !state.videoEnabled;
          
          // Verificar y re-renderizar video local si es necesario
          setTimeout(() => {
            if (!this.videoService.isLocalVideoVisible()) {
              console.log('🔄 Video local no visible, re-renderizando...');
              this.videoService.reRenderLocalVideo();
            }
          }, 1000);
          
          console.log('🎯 Estados inicializados:', { 
            audioEnabled: state.audioEnabled, 
            videoEnabled: state.videoEnabled 
          });
        }
      }, 1000);
      
      console.log('✅ Conectado exitosamente al canal:', this.channelName);
    } catch (error) {
      console.error('Error al iniciar la llamada:', error);
      this.connectionError = 'Error al conectar. Verifica tu conexión de internet.';
    } finally {
      this.isConnecting = false;
      loading.dismiss();
    }
  }

  async leaveCall() {
    this.isConnecting = true;
    
    const loading = await this.loadingController.create({
      message: 'Saliendo de la videollamada...',
    });
    await loading.present();
    
    try {
      await this.videoService.leave();
      VideoConsultaService.destroyInstance();
      console.log('🗑️ Singleton VideoConsultaService destruido completamente');
      
      this.inCall = false;
      this.isMuted = false;
      this.isCameraOff = false;
      this.connectionError = '';
      console.log('✅ Salió de la llamada exitosamente');
    } catch (error) {
      console.error('Error al salir de la llamada:', error);
    } finally {
      this.isConnecting = false;
      loading.dismiss();
    }
  }

  toggleMic() {
    if (!this.videoService || !this.inCall) {
      console.warn('No hay conexión activa para cambiar el micrófono');
      return;
    }
    
    let success = false;
    if (this.isMuted) {
      success = this.videoService.unmuteAudio();
    } else {
      success = this.videoService.muteAudio();
    }
    
    if (success) {
      this.isMuted = !this.isMuted;
    } else {
      console.warn('❌ Operación falló, sincronizando con estado real...');
      const realState = this.videoService.getMediaState();
      this.isMuted = !realState.audioEnabled;
    }
  }

  toggleVideo() {
    if (!this.videoService || !this.inCall) {
      console.warn('No hay conexión activa para cambiar la cámara');
      return;
    }
    
    let success = false;
    if (this.isCameraOff) {
      success = this.videoService.enableVideo();
    } else {
      success = this.videoService.disableVideo();
    }
    
    if (success) {
      this.isCameraOff = !this.isCameraOff;
    } else {
      console.warn('❌ Operación falló, sincronizando con estado real...');
      const realState = this.videoService.getMediaState();
      this.isCameraOff = !realState.videoEnabled;
    }
  }

  changeVideoQuality(quality: 'high' | 'medium' | 'low') {
    this.videoService.setVideoQuality(quality);
    
    // Cerrar el popover después de la selección
    const popover = document.querySelector('ion-popover');
    if (popover) {
      popover.dismiss();
    }
    
    console.log(`📊 Calidad de video cambiada a: ${quality}`);
  }

  toggleViewMode() {
    this.isViewSwapped = !this.isViewSwapped;
    
    // Re-renderizar los videos en las nuevas posiciones
    setTimeout(() => {
      if (this.videoService.localVideoTrack) {
        const localDiv = document.getElementById('local-player');
        if (localDiv) {
          localDiv.innerHTML = '';
          this.videoService.localVideoTrack.play(localDiv);
        }
      }
      
      // Re-renderizar video remoto si existe
      if (this.mediaState.remoteUserCount > 0) {
        const remoteDiv = document.getElementById('remote-player');
        if (remoteDiv) {
          // El video remoto se re-renderizará automáticamente
          console.log('🔄 Vista intercambiada');
        }
      }
    }, 100);
  }

  async showConnectionInfo() {
    const alert = await this.alertController.create({
      header: 'Información de la Consulta',
      message: `
        <div style="text-align: left;">
          <strong>🏥 Canal:</strong> ${this.channelName}<br><br>
          <strong>🔗 Estado:</strong> ${this.inCall ? '✅ Conectado' : '❌ Desconectado'}<br><br>
          <strong>🎤 Audio:</strong> ${this.isMuted ? '🔇 Silenciado' : '🔊 Activo'}<br><br>
          <strong>📹 Video:</strong> ${this.isCameraOff ? '📴 Desactivado' : '📸 Activo'}<br><br>
          <strong>�️ Pantalla:</strong> ${this.mediaState.isScreenSharing ? '📺 Compartiendo' : '❌ No compartiendo'}<br><br>
          <strong>🔊 Hablando:</strong> ${this.mediaState.isLocalSpeaking ? '🗣️ Sí' : '🤫 No'}<br><br>
          <strong>�👨‍⚕️ Veterinario:</strong> ${this.mediaState.remoteUserCount > 0 ? '✅ Conectado' : '⏳ Esperando...'}<br><br>
          <strong>📊 Calidad:</strong> ${this.mediaState.currentVideoQuality.toUpperCase()}<br><br>
          <strong>👥 Participantes:</strong> ${this.mediaState.remoteUserCount + 1} total
        </div>
      `,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Verificar video local manualmente
  checkLocalVideo() {
    if (!this.videoService.isLocalVideoVisible()) {
      console.log('⚠️ Video local no es visible, intentando re-renderizar...');
      this.videoService.reRenderLocalVideo();
    } else {
      console.log('✅ Video local es visible');
    }
  }

  // Compartir pantalla
  async shareScreen() {
    if (this.mediaState.isScreenSharing) {
      await this.stopScreenShare();
    } else {
      const success = await this.videoService.shareScreen();
      if (!success) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo compartir la pantalla. Verifica los permisos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  // Detener compartir pantalla
  async stopScreenShare() {
    const success = await this.videoService.stopScreenShare();
    if (!success) {
      console.warn('⚠️ Error deteniendo compartir pantalla');
    }
  }

  // Verificar entorno y permisos
  async checkEnvironmentAndPermissions() {
    try {
      console.log('🔍 Verificando entorno y permisos...');
      
      // Verificar si estamos en un contexto seguro (HTTPS)
      if (!this.videoService.isSecureContext()) {
        console.warn('⚠️ No estás en un contexto seguro. La cámara y micrófono requieren HTTPS o localhost.');
        await this.showPermissionAlert('Contexto Inseguro', 'Para usar la cámara y micrófono, necesitas acceder desde HTTPS o localhost.');
      }

      // Obtener información completa del entorno
      const envInfo = await this.videoService.getEnvironmentInfo();
      console.log('🌐 Información completa del entorno:', envInfo);

      // Verificar dispositivos de media
      const devices = await this.videoService.getMediaDevices();
      
      if (devices.cameras.length === 0) {
        await this.showPermissionAlert('Sin Cámara', 'No se detectó ninguna cámara en tu dispositivo.');
      }
      
      if (devices.microphones.length === 0) {
        await this.showPermissionAlert('Sin Micrófono', 'No se detectó ningún micrófono en tu dispositivo.');
      }

      // Verificar permisos
      const permissions = await this.videoService.checkPermissions();
      
      if (permissions.camera === 'denied' || permissions.microphone === 'denied') {
        await this.showPermissionAlert(
          'Permisos Denegados', 
          'Los permisos de cámara o micrófono han sido denegados. Por favor, permite el acceso en la configuración de tu navegador.'
        );
      }

      console.log('✅ Verificación de entorno completada');
      
    } catch (error) {
      console.error('❌ Error verificando entorno:', error);
    }
  }

  // Inicializar permisos Android
  async initializeAndroidPermissions() {
    try {
      console.log('📱 Inicializando permisos Android...');
      
      if (this.androidPermissions.isNativePlatform()) {
        await this.androidPermissions.initializePermissions();
        
        const permissions = await this.androidPermissions.checkVideoCallPermissions();
        
        if (!permissions.allGranted) {
          await this.showPermissionAlert(
            'Permisos Necesarios',
            'La aplicación necesita permisos de cámara y micrófono para las videollamadas. Por favor, concede los permisos cuando se soliciten.'
          );
        }
      } else {
        console.log('🌐 Plataforma web - usando permisos del navegador');
      }
      
    } catch (error) {
      console.error('❌ Error inicializando permisos Android:', error);
    }
  }

  // Mostrar alerta de permisos
  async showPermissionAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel'
        },
        {
          text: 'Ver Ayuda',
          handler: () => {
            this.showPermissionHelp();
          }
        }
      ]
    });
    await alert.present();
  }

  // Mostrar ayuda de permisos
  async showPermissionHelp() {
    const alert = await this.alertController.create({
      header: 'Ayuda - Permisos de Cámara y Micrófono',
      message: `
        <div style="text-align: left;">
          <strong>Para habilitar cámara y micrófono:</strong><br><br>
          
          <strong>Chrome/Edge:</strong><br>
          1. Haz clic en el ícono de candado 🔒 en la barra de direcciones<br>
          2. Cambia "Cámara" y "Micrófono" a "Permitir"<br>
          3. Recarga la página<br><br>
          
          <strong>Firefox:</strong><br>
          1. Haz clic en el ícono de escudo 🛡️ en la barra de direcciones<br>
          2. Haz clic en "Permisos"<br>
          3. Permite cámara y micrófono<br><br>
          
          <strong>Safari:</strong><br>
          1. Ve a Safari > Preferencias > Sitios web<br>
          2. Selecciona "Cámara" y "Micrófono"<br>
          3. Cambia a "Permitir"
        </div>
      `,
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  goBack() {
    if (this.inCall) {
      this.leaveCall().then(() => {
        this.router.navigate(['/citas-agendadas']);
      });
    } else {
      this.router.navigate(['/citas-agendadas']);
    }
  }
}
