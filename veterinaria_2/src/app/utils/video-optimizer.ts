export interface DeviceCapabilities {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  hardwareAcceleration: boolean;
  maxTextureSize: number;
  deviceMemory: number;
  cores: number;
}

export interface VideoRecommendation {
  quality: 'high' | 'medium' | 'low';
  description: string;
}

export class VideoOptimizer {
  private static instance: VideoOptimizer;
  
  public static getInstance(): VideoOptimizer {
    if (!VideoOptimizer.instance) {
      VideoOptimizer.instance = new VideoOptimizer();
    }
    return VideoOptimizer.instance;
  }

  // Optimizar el contexto de renderizado de video
  public optimizeVideoElement(videoElement: HTMLVideoElement) {
    // Habilitar aceleración por hardware
    videoElement.style.transform = 'translateZ(0)';
    videoElement.style.backfaceVisibility = 'hidden';
    videoElement.style.perspective = '1000px';
    
    // Configurar atributos para mejor rendimiento
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('webkit-playsinline', 'true');
    
    // Optimizar para 60fps
    if ('requestVideoFrameCallback' in videoElement) {
      const updateFrame = () => {
        (videoElement as any).requestVideoFrameCallback(updateFrame);
      };
      (videoElement as any).requestVideoFrameCallback(updateFrame);
    }
  }

  // Detectar capacidades del dispositivo
  public getDeviceCapabilities(): DeviceCapabilities {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    const webglContext = gl as WebGLRenderingContext | null;
    
    return {
      hasWebGL: !!gl,
      hasWebGL2: !!canvas.getContext('webgl2'),
      hardwareAcceleration: this.detectHardwareAcceleration(),
      maxTextureSize: webglContext ? webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE) : 0,
      deviceMemory: (navigator as any).deviceMemory || 4, // GB estimado
      cores: navigator.hardwareConcurrency || 4
    };
  }

  private detectHardwareAcceleration(): boolean {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    
    // Test básico de aceleración por hardware
    const imageData = ctx.createImageData(1, 1);
    const data = imageData.data;
    data[0] = 255; // R
    data[1] = 0;   // G
    data[2] = 0;   // B
    data[3] = 255; // A
    
    ctx.putImageData(imageData, 0, 0);
    const result = ctx.getImageData(0, 0, 1, 1);
    
    return result.data[0] === 255;
  }

  // Recomendar configuración basada en capacidades
  public getRecommendedConfig(): VideoRecommendation {
    const capabilities = this.getDeviceCapabilities();
    
    if (capabilities.hasWebGL2 && capabilities.deviceMemory >= 8 && capabilities.cores >= 8) {
      return {
        quality: 'high' as const,
        description: 'Dispositivo potente - 60fps HD recomendado'
      };
    } else if (capabilities.hasWebGL && capabilities.deviceMemory >= 4 && capabilities.cores >= 4) {
      return {
        quality: 'medium' as const,
        description: 'Dispositivo medio - 30fps SD recomendado'
      };
    } else {
      return {
        quality: 'low' as const,
        description: 'Dispositivo básico - 15fps básico recomendado'
      };
    }
  }

  // Optimizar automáticamente los divs de video
  public optimizeVideoContainers() {
    const videoContainers = document.querySelectorAll('#local-player, #remote-player');
    
    videoContainers.forEach(container => {
      const htmlContainer = container as HTMLElement;
      
      // Optimizaciones CSS via JavaScript
      htmlContainer.style.willChange = 'transform';
      htmlContainer.style.transform = 'translateZ(0)';
      htmlContainer.style.backfaceVisibility = 'hidden';
      htmlContainer.style.perspective = '1000px';
      
      // Para dispositivos móviles
      if (this.isMobileDevice()) {
        htmlContainer.style.webkitTransform = 'translate3d(0,0,0)';
        htmlContainer.style.webkitBackfaceVisibility = 'hidden';
      }
    });
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Hook personalizado para usar en componentes Angular
  public useVideoOptimization() {
    const capabilities = this.getDeviceCapabilities();
    const recommendation = this.getRecommendedConfig();

    const optimizeOnMount = () => {
      setTimeout(() => {
        this.optimizeVideoContainers();
      }, 100);
    };

    return {
      capabilities,
      recommendation,
      optimizeOnMount
    };
  }
}
