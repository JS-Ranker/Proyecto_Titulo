# Sistema de Video Consultas Veterinarias

## Características Implementadas

### 🎥 Interfaz de Doble Pantalla
- **Pantalla del Veterinario**: Lado izquierdo, marcada con chip azul "Veterinario"
- **Tu Pantalla**: Lado derecho, marcada con chip violeta "Tu Video"
- **Vista Responsiva**: En móviles se apilan verticalmente

### 🔧 Controles Disponibles

1. **🎤 Control de Audio**
   - Activar/Desactivar micrófono
   - Indicador visual del estado

2. **📹 Control de Video**
   - Activar/Desactivar cámara
   - Overlay cuando la cámara está apagada

3. **🔄 Intercambiar Vistas**
   - Botón para cambiar la posición de los videos
   - Útil según preferencia del usuario

4. **⚙️ Configuración de Calidad**
   - Alta (HD): 1280x720, 60fps
   - Media (SD): 640x480, 30fps
   - Baja: 320x240, 15fps

5. **📞 Colgar Llamada**
   - Termina la sesión y limpia recursos

### 📋 Información Mostrada

- **Estado de Conexión**: Conectado/Desconectado
- **Número de Participantes**: Veterinario + Cliente
- **Calidad de Video Actual**
- **Estado del Audio y Video**
- **Nombre del Canal de Consulta**

### 🚀 Cómo Usar

#### Desde Citas Agendadas:
1. Ve a "Citas Agendadas"
2. Busca una cita confirmada o pendiente
3. Presiona el botón de video (📹) en la cita
4. Se abrirá automáticamente con un canal generado

#### Desde Agendar Cita:
1. Ve a "Agendar Cita"
2. Selecciona una mascota
3. Presiona "Video Consulta Inmediata"
4. Confirma para iniciar la sesión

#### Manual:
1. Ve directamente a "Video Consulta"
2. Ingresa un nombre de canal
3. Presiona "Iniciar Video Consulta"

### 🔐 Configuración Técnica

#### Agora SDK:
- **App ID**: Configurado en `src/app/config/agora-config.ts`
- **Codec**: VP8 para mejor compatibilidad
- **Modo**: RTC (Real-Time Communication)

#### Optimizaciones:
- Detección automática de capacidades del dispositivo
- Configuración adaptativa de calidad
- Aceleración por hardware cuando está disponible

### 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Móvil
- **Permisos**: Requiere acceso a cámara y micrófono

### 🛠️ Estructura de Archivos

```
src/app/
├── video-consulta/
│   ├── video-consulta.page.ts      # Lógica del componente
│   ├── video-consulta.page.html    # Interfaz de usuario
│   ├── video-consulta.page.scss    # Estilos específicos
│   └── video-consulta.module.ts    # Módulo de Angular
├── services/
│   └── video-consulta.service.ts   # Servicio de Agora SDK
├── utils/
│   └── video-optimizer.ts          # Optimizaciones de rendimiento
└── config/
    └── agora-config.ts              # Configuración de Agora
```

### 🎯 Funcionalidades Adicionales

1. **Singleton Pattern**: Una sola instancia del servicio por sesión
2. **Gestión de Estado**: Sincronización automática de controles
3. **Limpieza Automática**: Recursos liberados al salir
4. **Manejo de Errores**: Mensajes informativos para problemas
5. **Indicadores Visuales**: Estados claros de conexión y participantes

### 🔄 Flujo de Uso Típico

1. **Cliente**: Inicia la video consulta desde la app
2. **Sistema**: Genera canal único para la sesión
3. **Cliente**: Se conecta y ve su video en la pantalla derecha
4. **Veterinario**: Se une usando el mismo canal
5. **Sistema**: Muestra veterinario en pantalla izquierda
6. **Consulta**: Ambos pueden controlar audio/video independientemente
7. **Finalización**: Cualquiera puede terminar la llamada

### 📋 Próximas Mejoras Sugeridas

- [ ] Chat de texto durante la consulta
- [ ] Grabación de sesiones (opcional)
- [ ] Compartir pantalla para mostrar documentos
- [ ] Integración con historial clínico
- [ ] Notificaciones push para invitar al veterinario
- [ ] Sistema de colas para veterinarios ocupados
