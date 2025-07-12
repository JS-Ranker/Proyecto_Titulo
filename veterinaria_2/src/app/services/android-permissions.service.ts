import { Injectable, Optional, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Device } from '@capacitor/device';

@Injectable()
export class AndroidPermissionsService {
  
  constructor(
    private platform: Platform,
    @Optional() @Inject(AndroidPermissions) private androidPermissions: AndroidPermissions
  ) {
    console.log('🔧 AndroidPermissionsService inicializado');
    console.log('📱 Plataforma:', {
      isAndroid: this.platform.is('android'),
      isCapacitor: this.platform.is('capacitor'),
      isCordova: this.platform.is('cordova'),
      isWeb: !this.platform.is('capacitor') && !this.platform.is('cordova')
    });
    console.log('🔌 AndroidPermissions disponible:', !!this.androidPermissions);
  }

  /**
   * Solicitar permisos de Android para videollamadas
   */
  async requestVideoCallPermissions(): Promise<boolean> {
    if (!this.platform.is('android') && !this.platform.is('capacitor')) {
      console.log('📱 No es Android, omitiendo permisos nativos');
      return true;
    }

    if (!this.androidPermissions) {
      console.log('📱 AndroidPermissions no disponible, usando permisos web');
      return true;
    }

    try {
      console.log('🔐 Solicitando permisos de Android para videollamadas...');

      // Lista de permisos necesarios
      const permissions = [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
        this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE,
        this.androidPermissions.PERMISSION.INTERNET
      ];

      // Solicitar todos los permisos
      const result = await this.androidPermissions.requestPermissions(permissions);
      
      let allGranted = true;
      
      // Verificar cada permiso
      for (const permission of permissions) {
        const hasPermission = await this.androidPermissions.hasPermission(permission);
        if (!hasPermission.hasPermission) {
          console.warn(`❌ Permiso denegado: ${permission}`);
          allGranted = false;
        } else {
          console.log(`✅ Permiso concedido: ${permission}`);
        }
      }

      if (allGranted) {
        console.log('🎉 Todos los permisos concedidos');
      } else {
        console.warn('⚠️ Algunos permisos fueron denegados');
      }

      return allGranted;

    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
      return false;
    }
  }

  /**
   * Verificar si los permisos están concedidos
   */
  async checkVideoCallPermissions(): Promise<{
    camera: boolean;
    microphone: boolean;
    allGranted: boolean;
  }> {
    if (!this.platform.is('android') && !this.platform.is('capacitor')) {
      return { camera: true, microphone: true, allGranted: true };
    }

    if (!this.androidPermissions) {
      console.log('📱 AndroidPermissions no disponible, asumiendo permisos concedidos');
      return { camera: true, microphone: true, allGranted: true };
    }

    try {
      const cameraPermission = await this.androidPermissions.hasPermission(
        this.androidPermissions.PERMISSION.CAMERA
      );
      
      const microphonePermission = await this.androidPermissions.hasPermission(
        this.androidPermissions.PERMISSION.RECORD_AUDIO
      );

      const result = {
        camera: cameraPermission.hasPermission,
        microphone: microphonePermission.hasPermission,
        allGranted: cameraPermission.hasPermission && microphonePermission.hasPermission
      };

      console.log('🔍 Estado de permisos:', result);
      return result;

    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      return { camera: false, microphone: false, allGranted: false };
    }
  }

  /**
   * Probar acceso a la cámara usando Capacitor Camera
   */
  async testCameraAccess(): Promise<boolean> {
    try {
      console.log('📷 Probando acceso a la cámara...');
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      console.log('✅ Acceso a cámara exitoso');
      return !!image.webPath;

    } catch (error) {
      console.error('❌ Error accediendo a la cámara:', error);
      return false;
    }
  }

  /**
   * Obtener información del dispositivo
   */
  async getDeviceInfo(): Promise<any> {
    try {
      const info = await Device.getInfo();
      console.log('📱 Información del dispositivo:', info);
      return info;
    } catch (error) {
      console.error('❌ Error obteniendo info del dispositivo:', error);
      return null;
    }
  }

  /**
   * Método de inicialización para ser llamado en ionViewDidEnter
   */
  async initializePermissions(): Promise<void> {
    if (!this.platform.is('android') && !this.platform.is('capacitor')) {
      console.log('📱 Plataforma web, usando permisos del navegador');
      return;
    }

    if (!this.androidPermissions) {
      console.log('📱 AndroidPermissions no disponible');
      return;
    }

    try {
      console.log('🚀 Inicializando permisos Android...');
      
      // Verificar permisos actuales
      const currentPermissions = await this.checkVideoCallPermissions();
      
      if (!currentPermissions.allGranted) {
        console.log('⚠️ Solicitando permisos faltantes...');
        await this.requestVideoCallPermissions();
      } else {
        console.log('✅ Todos los permisos ya están concedidos');
      }

      // Obtener información del dispositivo
      await this.getDeviceInfo();

    } catch (error) {
      console.error('❌ Error inicializando permisos:', error);
    }
  }

  /**
   * Verificar si la plataforma soporta permisos nativos
   */
  isNativePlatform(): boolean {
    return this.platform.is('android') || this.platform.is('ios');
  }

  /**
   * Mostrar configuración de permisos del sistema
   */
  async openAppSettings(): Promise<void> {
    if (this.platform.is('android')) {
      if (!this.androidPermissions) {
        console.log('📱 AndroidPermissions no disponible');
        return;
      }
      
      try {
        // En Android, abrir configuración de la app
        await this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.CAMERA
        );
      } catch (error) {
        console.error('❌ Error abriendo configuración:', error);
      }
    }
  }
}
