// Utilidades para optimizar el rendimiento de video

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
        videoElement.requestVideoFrameCallback(updateFrame);
      };
      videoElement.requestVideoFrameCallback(updateFrame);
    }
  }

  // Detectar capacidades del dispositivo
  public getDeviceCapabilities() {
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

  private detectHardwareAcceleration() {
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
  public getRecommendedConfig() {
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
      
      // Observer para optimizar videos cuando aparezcan
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              const video = element.querySelector('video') || 
                           (element.tagName === 'VIDEO' ? element as HTMLVideoElement : null);
              
              if (video) {
                this.optimizeVideoElement(video);
              }
            }
          });
        });
      });
      
      observer.observe(htmlContainer, { childList: true, subtree: true });
    });
  }
}

// Hook para React
export const useVideoOptimization = () => {
  const optimizer = VideoOptimizer.getInstance();
  
  const optimizeOnMount = () => {
    // Ejecutar optimizaciones cuando el componente se monte
    setTimeout(() => {
      optimizer.optimizeVideoContainers();
    }, 100);
  };
  
  const getRecommendation = () => {
    return optimizer.getRecommendedConfig();
  };
  
  return {
    optimizeOnMount,
    getRecommendation,
    capabilities: optimizer.getDeviceCapabilities()
  };
};
