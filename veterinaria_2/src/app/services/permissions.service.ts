import { Injectable, Optional } from '@angular/core';
import { Platform } from '@ionic/angular';

export interface PermissionStatus {
  camera: PermissionState | 'unknown';
  microphone: PermissionState | 'unknown';
  supported: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  
  constructor(@Optional() private platform: Platform) {
    if (!this.platform) {
      console.warn('⚠️ Platform service no disponible, usando valores por defecto');
    }
  }

  /**
   * Verificar permisos de cámara y micrófono
   */
  async checkMediaPermissions(): Promise<PermissionStatus> {
    const result: PermissionStatus = {
      camera: 'unknown',
      microphone: 'unknown',
      supported: this.isMediaPermissionsSupported()
    };

    if (!result.supported) {
      result.error = 'Permissions API no soportada en este navegador';
      return result;
    }

    try {
      // Verificar permisos de cámara
      if ('permissions' in navigator) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        result.camera = cameraPermission.state;

        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        result.microphone = microphonePermission.state;
      }
    } catch (error) {
      console.error('Error verificando permisos:', error);
      result.error = `Error al verificar permisos: ${error}`;
    }

    return result;
  }

  /**
   * Solicitar permisos de cámara y micrófono
   */
  async requestMediaPermissions(): Promise<{ success: boolean; stream?: MediaStream; error?: string }> {
    try {
      console.log('🎯 Solicitando permisos de cámara y micrófono...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('✅ Permisos concedidos exitosamente');
      
      return {
        success: true,
        stream
      };
    } catch (error: any) {
      console.error('❌ Error solicitando permisos:', error);
      
      let errorMessage = 'Error desconocido';
      
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Permisos denegados por el usuario. Por favor, permite el acceso a cámara y micrófono.';
          break;
        case 'NotFoundError':
          errorMessage = 'No se encontró cámara o micrófono en el dispositivo.';
          break;
        case 'NotReadableError':
          errorMessage = 'Error de hardware. La cámara o micrófono están siendo usados por otra aplicación.';
          break;
        case 'OverconstrainedError':
          errorMessage = 'Las restricciones de video/audio no se pueden satisfacer.';
          break;
        case 'SecurityError':
          errorMessage = 'Error de seguridad. Asegúrate de usar HTTPS.';
          break;
        default:
          errorMessage = `Error: ${error.message || error.name}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Verificar dispositivos de media disponibles
   */
  async getMediaDevices(): Promise<{ cameras: MediaDeviceInfo[]; microphones: MediaDeviceInfo[]; error?: string }> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const cameras = devices.filter(device => device.kind === 'videoinput');
      const microphones = devices.filter(device => device.kind === 'audioinput');
      
      console.log(`📹 Cámaras encontradas: ${cameras.length}`);
      console.log(`🎤 Micrófonos encontrados: ${microphones.length}`);
      
      return { cameras, microphones };
    } catch (error: any) {
      console.error('Error enumerando dispositivos:', error);
      return {
        cameras: [],
        microphones: [],
        error: error.message
      };
    }
  }

  /**
   * Verificar si el navegador soporta getUserMedia
   */
  isMediaSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Verificar si el navegador soporta Permissions API
   */
  isMediaPermissionsSupported(): boolean {
    return 'permissions' in navigator;
  }

  /**
   * Verificar si se está ejecutando en HTTPS o localhost
   */
  isSecureContext(): boolean {
    return window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }

  /**
   * Obtener información completa del entorno
   */
  async getEnvironmentInfo(): Promise<{
    mediaSupported: boolean;
    permissionsSupported: boolean;
    secureContext: boolean;
    platform: string;
    userAgent: string;
    permissions?: PermissionStatus;
    devices?: { cameras: MediaDeviceInfo[]; microphones: MediaDeviceInfo[] };
  }> {
    const info = {
      mediaSupported: this.isMediaSupported(),
      permissionsSupported: this.isMediaPermissionsSupported(),
      secureContext: this.isSecureContext(),
      platform: this.platform && this.platform.platforms ? this.platform.platforms().join(', ') : 'unknown',
      userAgent: navigator?.userAgent || 'unknown'
    };

    const result: any = { ...info };

    if (info.permissionsSupported) {
      try {
        result.permissions = await this.checkMediaPermissions();
      } catch (error) {
        console.warn('⚠️ Error obteniendo permisos:', error);
        result.permissions = {
          camera: 'unknown',
          microphone: 'unknown',
          supported: false,
          error: 'Error obteniendo permisos'
        };
      }
    }

    if (info.mediaSupported) {
      try {
        result.devices = await this.getMediaDevices();
      } catch (error) {
        console.warn('⚠️ Error obteniendo dispositivos:', error);
        result.devices = { cameras: [], microphones: [] };
      }
    }

    return result;
  }

  /**
   * Limpiar stream de media
   */
  stopMediaStream(stream: MediaStream): void {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Track ${track.kind} detenido`);
      });
    }
  }
}
