// Configuración para Agora Video SDK
export const AGORA_CONFIG = {
  APP_ID: 'e83d68a7ae864d4a9e920fcaae47fcd5', // Tu App ID de Agora
  // Agregar aquí tu certificado si usas tokens
  CERTIFICATE: '', 
  
  // Configuraciones de video por calidad
  VIDEO_CONFIGS: {
    high: {
      width: 1280,
      height: 720,
      frameRate: 60,
      bitrateMin: 1000,
      bitrateMax: 3000
    },
    medium: {
      width: 640,
      height: 480,
      frameRate: 30,
      bitrateMin: 500,
      bitrateMax: 1500
    },
    low: {
      width: 320,
      height: 240,
      frameRate: 15,
      bitrateMin: 200,
      bitrateMax: 800
    }
  },
  
  // Configuraciones de audio
  AUDIO_CONFIG: {
    encoderConfig: 'music_standard' as const,
    microphoneId: undefined, // Se detectará automáticamente
    cameraId: undefined, // Se detectará automáticamente
  },
  
  // Configuraciones del cliente
  CLIENT_CONFIG: {
    mode: 'rtc' as const,
    codec: 'vp8' as const,
    optimizationMode: 'detail' as const
  }
};

// Configuración de logs para desarrollo
export const LOG_CONFIG = {
  development: 0, // Todos los logs
  production: 4   // Solo warnings y errores
};
