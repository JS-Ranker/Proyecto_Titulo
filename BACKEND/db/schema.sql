-- Esquema de la base de datos de Happy Pet (MySQL 8).
-- Generado a partir de la estructura del respaldo original, sin datos.
-- Uso: mysql -u <usuario> -p <base> < db/schema.sql  (luego db/seed.sql)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `adopciones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_mascota` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la mascota en adopción',
  `especie` enum('perro','gato','otro') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Especie',
  `edad` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Edad aproximada en texto',
  `sexo` enum('macho','hembra') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ruta uploads/... o URL absoluta',
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Título del anuncio',
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Descripción detallada',
  `requisitos` text COLLATE utf8mb4_unicode_ci COMMENT 'Requisitos para adoptar',
  `contacto_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de contacto',
  `contacto_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email de contacto',
  `contacto_telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Teléfono de contacto',
  `ubicacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ubicación de la mascota',
  `fecha_publicacion` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de publicación',
  `estado` enum('disponible','en_proceso','adoptado','cancelado') COLLATE utf8mb4_unicode_ci DEFAULT 'disponible' COMMENT 'Estado actual de la adopción',
  PRIMARY KEY (`id`),
  KEY `idx_adopciones_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de mascotas en adopción';

CREATE TABLE IF NOT EXISTS `categorias_productos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la categoría',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción de la categoría',
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL de imagen representativa',
  `categoria_padre_id` int unsigned DEFAULT NULL COMMENT 'Categoría padre para categorías jerárquicas',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_categoria` (`nombre`),
  KEY `fk_categoria_padre` (`categoria_padre_id`),
  CONSTRAINT `fk_categoria_padre` FOREIGN KEY (`categoria_padre_id`) REFERENCES `categorias_productos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de categorías de productos';

CREATE TABLE IF NOT EXISTS `citas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mascota_id` int unsigned NOT NULL COMMENT 'Mascota para la cita',
  `veterinario_id` int unsigned DEFAULT NULL COMMENT 'Veterinario asignado',
  `tipo_consulta_id` int unsigned DEFAULT NULL COMMENT 'Tipo de consulta a realizar',
  `fecha_hora` datetime NOT NULL COMMENT 'Fecha y hora de la cita',
  `duracion_minutos` int DEFAULT '30' COMMENT 'Duración estimada en minutos',
  `motivo` text COLLATE utf8mb4_unicode_ci COMMENT 'Motivo específico de la consulta',
  `estado` enum('pendiente','confirmada','cancelada','completada','no_asistio') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente' COMMENT 'Estado actual de la cita',
  `notas_previas` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas previas a la consulta',
  `notas_posteriores` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas posteriores a la consulta',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la cita',
  PRIMARY KEY (`id`),
  KEY `idx_citas_mascota` (`mascota_id`),
  KEY `idx_citas_veterinario` (`veterinario_id`),
  KEY `idx_citas_fecha` (`fecha_hora`),
  KEY `idx_citas_estado` (`estado`),
  KEY `fk_cita_tipo_consulta` (`tipo_consulta_id`),
  KEY `idx_citas_fecha_estado` (`fecha_hora`,`estado`),
  CONSTRAINT `fk_cita_mascota` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cita_tipo_consulta` FOREIGN KEY (`tipo_consulta_id`) REFERENCES `tipos_consulta` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_cita_veterinario` FOREIGN KEY (`veterinario_id`) REFERENCES `veterinarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de citas veterinarias';

CREATE TABLE IF NOT EXISTS `detalles_pedido` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pedido_id` int unsigned NOT NULL COMMENT 'Pedido al que pertenece',
  `producto_id` int unsigned NOT NULL COMMENT 'Producto comprado',
  `cantidad` int NOT NULL COMMENT 'Cantidad de unidades',
  `precio_unitario` decimal(10,2) NOT NULL COMMENT 'Precio unitario al momento de la compra',
  `descuento_unitario` decimal(10,2) DEFAULT '0.00' COMMENT 'Descuento por unidad',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Subtotal de la línea (cantidad * precio - descuento)',
  PRIMARY KEY (`id`),
  KEY `idx_detalles_pedido` (`pedido_id`),
  KEY `idx_detalles_producto` (`producto_id`),
  CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Detalles de productos en cada pedido';

CREATE TABLE IF NOT EXISTS `duenos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre completo del dueño',
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email de contacto y acceso',
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Número telefónico de contacto',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Contraseña hasheada',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro en el sistema',
  `activo` tinyint(1) DEFAULT '1' COMMENT 'Estado activo del usuario',
  PRIMARY KEY (`rut`),
  UNIQUE KEY `unique_email` (`email`),
  UNIQUE KEY `ux_duenos_id` (`id`),
  KEY `idx_duenos_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena información de los dueños de mascotas';

CREATE TABLE IF NOT EXISTS `especialidades` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la especialidad médica',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción detallada de la especialidad',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_especialidad` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de especialidades veterinarias';

CREATE TABLE IF NOT EXISTS `especies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la especie animal',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_especie` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de especies animales';

CREATE TABLE IF NOT EXISTS `facturas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `numero_factura` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Número de factura único',
  `dueno_id` int unsigned NOT NULL COMMENT 'Cliente facturado',
  `concepto` enum('producto','servicio','seguro','suscripcion','otro') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Concepto principal de la factura',
  `referencia_id` int unsigned DEFAULT NULL COMMENT 'ID de referencia según el concepto (pedido, cita, etc.)',
  `fecha_emision` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de emisión',
  `fecha_vencimiento` date NOT NULL COMMENT 'Fecha límite de pago',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Subtotal antes de impuestos',
  `impuestos` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Impuestos aplicados',
  `total` decimal(10,2) NOT NULL COMMENT 'Monto total a pagar',
  `metodo_pago` enum('mercado_pago','paypal','stripe','transferencia','efectivo','pendiente') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente' COMMENT 'Método de pago utilizado',
  `estado` enum('pendiente','pagada','vencida','cancelada') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente' COMMENT 'Estado actual de la factura',
  `notas` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas adicionales',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_numero_factura` (`numero_factura`),
  KEY `idx_facturas_dueno` (`dueno_id`),
  KEY `idx_facturas_fecha` (`fecha_emision`),
  KEY `idx_facturas_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de facturas emitidas';

CREATE TABLE IF NOT EXISTS `historial_clinico` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mascota_id` int unsigned NOT NULL COMMENT 'Mascota asociada',
  `fecha` datetime NOT NULL COMMENT 'Fecha del registro clínico',
  `tipo` enum('consulta','vacuna','cirugía','tratamiento','examen','otro') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tipo de evento clínico',
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Descripción detallada del evento',
  `veterinario_id` int unsigned DEFAULT NULL COMMENT 'Veterinario que atendió',
  `archivos_adjuntos` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URLs de archivos adjuntos separados por comas',
  PRIMARY KEY (`id`),
  KEY `idx_historial_mascota` (`mascota_id`),
  KEY `idx_historial_fecha` (`fecha`),
  KEY `fk_historial_veterinario` (`veterinario_id`),
  CONSTRAINT `fk_historial_mascota` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_historial_veterinario` FOREIGN KEY (`veterinario_id`) REFERENCES `veterinarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registros del historial médico de las mascotas';

CREATE TABLE IF NOT EXISTS `mascotas` (
  `id_mascota` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_mascota` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_especie` int unsigned DEFAULT NULL,
  `id_raza` int unsigned DEFAULT NULL,
  `fecha_nac_mascota` date DEFAULT NULL,
  `peso_kg` decimal(5,2) DEFAULT NULL,
  `sexo_mascota` enum('macho','hembra','desconocido') COLLATE utf8mb4_unicode_ci DEFAULT 'desconocido',
  `esta_esterilizado` tinyint(1) DEFAULT '0',
  `color_mascota` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_microchip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_imagen_mascota` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_dueno` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_registro_mascota` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado_activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_mascota`),
  KEY `idx_mascotas_nombre` (`nombre_mascota`),
  KEY `idx_mascotas_dueno` (`id_dueno`),
  KEY `fk_mascota_raza` (`id_raza`),
  KEY `idx_mascotas_especie_raza` (`id_especie`,`id_raza`),
  CONSTRAINT `fk_mascota_especie` FOREIGN KEY (`id_especie`) REFERENCES `especies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_mascota_raza` FOREIGN KEY (`id_raza`) REFERENCES `razas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena información de las mascotas registradas';

CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dueno_id` int unsigned DEFAULT NULL COMMENT 'Dueño destinatario (si aplica)',
  `veterinario_id` int unsigned DEFAULT NULL COMMENT 'Veterinario destinatario (si aplica)',
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Título de la notificación',
  `mensaje` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Contenido de la notificación',
  `tipo` enum('info','alerta','recordatorio','promocion','sistema') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info' COMMENT 'Tipo de notificación',
  `referencia_id` int unsigned DEFAULT NULL COMMENT 'ID de referencia según el tipo',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  `fecha_lectura` datetime DEFAULT NULL COMMENT 'Fecha de lectura',
  `estado` enum('pendiente','enviada','leida') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente' COMMENT 'Estado de la notificación',
  PRIMARY KEY (`id`),
  KEY `idx_notificaciones_dueno` (`dueno_id`),
  KEY `idx_notificaciones_veterinario` (`veterinario_id`),
  KEY `idx_notificaciones_estado` (`estado`),
  KEY `idx_notificaciones_fecha` (`fecha_creacion`),
  CONSTRAINT `fk_notificacion_veterinario` FOREIGN KEY (`veterinario_id`) REFERENCES `veterinarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sistema de notificaciones para usuarios';

CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dueno_id` int unsigned NOT NULL COMMENT 'Cliente que realiza el pedido',
  `fecha_pedido` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del pedido',
  `estado` enum('pendiente','procesando','enviado','entregado','cancelado') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente' COMMENT 'Estado actual del pedido',
  `direccion_envio` text COLLATE utf8mb4_unicode_ci COMMENT 'Dirección de envío',
  `metodo_pago` enum('mercado_pago','paypal','stripe','transferencia','efectivo') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Método de pago utilizado',
  `referencia_pago` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Referencia o ID de transacción de pago',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Subtotal antes de impuestos y descuentos',
  `impuestos` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Impuestos aplicados',
  `descuento` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Descuento aplicado',
  `costo_envio` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Costo de envío',
  `total` decimal(10,2) NOT NULL COMMENT 'Monto total final',
  `notas` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas adicionales del pedido',
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización',
  PRIMARY KEY (`id`),
  KEY `idx_pedidos_dueno` (`dueno_id`),
  KEY `idx_pedidos_fecha` (`fecha_pedido`),
  KEY `idx_pedidos_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de pedidos de productos';

CREATE TABLE IF NOT EXISTS `planes_seguro` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del plan de seguro',
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Descripción detallada del plan',
  `cobertura` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Detalles de la cobertura ofrecida',
  `precio_mensual` decimal(10,2) NOT NULL COMMENT 'Precio mensual del plan',
  `precio_anual` decimal(10,2) NOT NULL COMMENT 'Precio anual del plan',
  `activo` tinyint(1) DEFAULT '1' COMMENT 'Estado activo del plan',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_plan_seguro` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de planes de seguro disponibles';

CREATE TABLE IF NOT EXISTS `productos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo_sku` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Código único de producto (SKU)',
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del producto',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción detallada',
  `precio_costo` decimal(10,2) DEFAULT NULL COMMENT 'Precio de costo',
  `precio_venta` decimal(10,2) NOT NULL COMMENT 'Precio de venta',
  `stock` int NOT NULL DEFAULT '0' COMMENT 'Cantidad en inventario',
  `stock_minimo` int DEFAULT '5' COMMENT 'Nivel mínimo de inventario para alertas',
  `categoria_id` int unsigned DEFAULT NULL COMMENT 'Categoría del producto',
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL de imagen principal',
  `peso_kg` decimal(6,2) DEFAULT NULL COMMENT 'Peso en kilogramos',
  `activo` tinyint(1) DEFAULT '1' COMMENT 'Estado activo del producto',
  `destacado` tinyint(1) DEFAULT '0' COMMENT 'Producto destacado en tienda',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del producto',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_sku` (`codigo_sku`),
  KEY `idx_productos_nombre` (`nombre`),
  KEY `idx_productos_categoria` (`categoria_id`),
  KEY `idx_productos_precio` (`precio_venta`),
  KEY `idx_productos_activo_categoria` (`activo`,`categoria_id`),
  CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_productos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de productos disponibles';

CREATE TABLE IF NOT EXISTS `razas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la raza',
  `especie_id` int unsigned NOT NULL COMMENT 'Especie a la que pertenece la raza',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción y características de la raza',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_raza_especie` (`nombre`,`especie_id`),
  KEY `idx_razas_especie` (`especie_id`),
  CONSTRAINT `fk_raza_especie` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de razas por especie animal';

CREATE TABLE IF NOT EXISTS `resenas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dueno_id` int unsigned NOT NULL COMMENT 'Dueño que escribe la reseña',
  `veterinario_id` int unsigned DEFAULT NULL COMMENT 'Veterinario evaluado',
  `cita_id` int unsigned DEFAULT NULL COMMENT 'Cita relacionada con la reseña',
  `puntuacion` tinyint NOT NULL COMMENT 'Puntuación de 1 a 5 estrellas',
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Título de la reseña',
  `comentario` text COLLATE utf8mb4_unicode_ci COMMENT 'Comentario detallado',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  `respuesta` text COLLATE utf8mb4_unicode_ci COMMENT 'Respuesta del veterinario',
  `fecha_respuesta` datetime DEFAULT NULL COMMENT 'Fecha de respuesta',
  `estado` enum('publicada','pendiente','rechazada') COLLATE utf8mb4_unicode_ci DEFAULT 'publicada' COMMENT 'Estado de la reseña',
  PRIMARY KEY (`id`),
  KEY `idx_resenas_dueno` (`dueno_id`),
  KEY `idx_resenas_veterinario` (`veterinario_id`),
  KEY `idx_resenas_puntuacion` (`puntuacion`),
  KEY `fk_resena_cita` (`cita_id`),
  CONSTRAINT `fk_resena_cita` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_resena_veterinario` FOREIGN KEY (`veterinario_id`) REFERENCES `veterinarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resenas_chk_1` CHECK ((`puntuacion` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Reseñas y calificaciones para veterinarios';

CREATE TABLE IF NOT EXISTS `seguros_contratados` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dueno_id` int unsigned NOT NULL COMMENT 'Dueño que contrata',
  `mascota_id` int unsigned NOT NULL COMMENT 'Mascota asegurada',
  `plan_id` int unsigned NOT NULL COMMENT 'Plan de seguro contratado',
  `fecha_inicio` date NOT NULL COMMENT 'Fecha de inicio de la cobertura',
  `fecha_renovacion` date NOT NULL COMMENT 'Próxima fecha de renovación',
  `periodicidad` enum('mensual','anual') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mensual' COMMENT 'Periodicidad de pago',
  `precio_contratado` decimal(10,2) NOT NULL COMMENT 'Precio acordado al momento de la contratación',
  `estado` enum('activo','vencido','cancelado','en_renovacion') COLLATE utf8mb4_unicode_ci DEFAULT 'activo' COMMENT 'Estado actual del seguro',
  `numero_poliza` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Número de póliza asignado',
  `notas` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas relevantes sobre el contrato',
  PRIMARY KEY (`id`),
  KEY `idx_seguros_dueno` (`dueno_id`),
  KEY `idx_seguros_mascota` (`mascota_id`),
  KEY `idx_seguros_plan` (`plan_id`),
  KEY `idx_seguros_estado` (`estado`),
  CONSTRAINT `fk_seguro_mascota` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_seguro_plan` FOREIGN KEY (`plan_id`) REFERENCES `planes_seguro` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de seguros contratados por los clientes';

CREATE TABLE IF NOT EXISTS `tipos_consulta` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del tipo de consulta',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción del tipo de consulta',
  `duracion_minutos` int DEFAULT '30' COMMENT 'Duración estimada en minutos',
  `precio` decimal(10,2) DEFAULT NULL COMMENT 'Precio base de la consulta',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_tipo_consulta` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de tipos de consultas ofrecidas';

CREATE TABLE IF NOT EXISTS `veterinarios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre completo del veterinario',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email profesional de contacto',
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Número telefónico profesional',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Contraseña hasheada',
  `especialidad_id` int unsigned DEFAULT NULL COMMENT 'Referencia a la especialidad principal',
  `numero_licencia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Número de licencia profesional',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro en el sistema',
  `activo` tinyint(1) DEFAULT '1' COMMENT 'Estado activo del veterinario',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email_vet` (`email`),
  KEY `idx_veterinarios_nombre` (`nombre`),
  KEY `fk_veterinario_especialidad` (`especialidad_id`),
  CONSTRAINT `fk_veterinario_especialidad` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena información de los veterinarios';

SET FOREIGN_KEY_CHECKS = 1;
