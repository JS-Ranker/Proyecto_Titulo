-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_mascotas
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adopciones`
--

DROP TABLE IF EXISTS `adopciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adopciones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mascota_id` int unsigned NOT NULL COMMENT 'Mascota en adopción',
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
  KEY `idx_adopciones_mascota` (`mascota_id`),
  KEY `idx_adopciones_estado` (`estado`),
  CONSTRAINT `fk_adopcion_mascota` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de mascotas en adopción';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adopciones`
--

LOCK TABLES `adopciones` WRITE;
/*!40000 ALTER TABLE `adopciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `adopciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias_productos`
--

DROP TABLE IF EXISTS `categorias_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_productos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la categoría',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción de la categoría',
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL de imagen representativa',
  `categoria_padre_id` int unsigned DEFAULT NULL COMMENT 'Categoría padre para categorías jerárquicas',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_categoria` (`nombre`),
  KEY `fk_categoria_padre` (`categoria_padre_id`),
  CONSTRAINT `fk_categoria_padre` FOREIGN KEY (`categoria_padre_id`) REFERENCES `categorias_productos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de categorías de productos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_productos`
--

LOCK TABLES `categorias_productos` WRITE;
/*!40000 ALTER TABLE `categorias_productos` DISABLE KEYS */;
INSERT INTO `categorias_productos` VALUES (1,'Alimento para Perros','Comida seca y húmeda premium para perros de todas las edades.','https://ejemplo.com/imagenes/alimento_perros.jpg',NULL),(2,'Alimento para Gatos','Alimentos balanceados para gatos con distintos sabores y formatos.','https://ejemplo.com/imagenes/alimento_gatos.jpg',NULL),(3,'Camas para Mascotas','Camas cómodas, acolchadas y lavables para perros y gatos.','https://ejemplo.com/imagenes/cama_mascotas.jpg',NULL),(4,'Juguetes para Perros','Juguetes resistentes e interactivos para la diversión y el ejercicio de los perros.','https://ejemplo.com/imagenes/juguete_perros.jpg',NULL),(5,'Correas y Paseo','Correas retráctiles, collares y arneses para paseos seguros.','https://ejemplo.com/imagenes/correa_retractil.jpg',NULL),(6,'Higiene y Cuidado','Productos para la higiene y cuidado de mascotas como shampoo, cepillos y colonias.','https://ejemplo.com/imagenes/shampoo_mascotas.jpg',NULL),(7,'Arneses y Accesorios','Arneses ajustables, accesorios de moda y elementos para el confort de tu mascota.','https://ejemplo.com/imagenes/arnes.jpg',NULL);
/*!40000 ALTER TABLE `categorias_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de citas veterinarias';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (9,4,7,7,'2025-06-03 09:00:00',30,NULL,'cancelada',NULL,NULL,'2025-06-19 22:10:06'),(10,4,7,7,'2025-06-05 09:00:00',30,NULL,'cancelada',NULL,NULL,'2025-06-19 22:14:24'),(11,9,5,5,'2025-06-03 08:00:00',30,'555','pendiente',NULL,NULL,'2025-06-20 10:34:29'),(12,6,6,6,'2025-06-11 12:00:00',30,'asdasda','cancelada','asdasdasd',NULL,'2025-06-20 19:03:21'),(13,3,6,6,'2025-06-27 16:00:00',30,NULL,'cancelada',NULL,NULL,'2025-06-20 20:46:52'),(14,8,7,7,'2025-06-28 09:00:00',30,NULL,'pendiente',NULL,NULL,'2025-06-20 20:49:51'),(15,7,4,4,'2025-06-24 17:00:00',30,NULL,'cancelada',NULL,NULL,'2025-06-20 20:50:32'),(16,6,1,1,'2025-06-29 17:00:00',30,NULL,'pendiente',NULL,NULL,'2025-06-20 20:52:25'),(17,7,4,4,'2025-06-22 17:00:00',30,NULL,'pendiente',NULL,NULL,'2025-06-20 20:53:22'),(18,7,7,7,'2025-07-01 15:00:00',30,NULL,'cancelada',NULL,NULL,'2025-06-20 20:56:54'),(19,7,2,2,'2025-06-29 17:00:00',30,NULL,'pendiente',NULL,NULL,'2025-06-20 20:59:45'),(20,4,6,6,'2025-06-03 09:00:00',30,NULL,'pendiente',NULL,NULL,'2025-06-21 02:35:58'),(21,6,1,1,'2025-06-26 13:00:00',30,NULL,'pendiente',NULL,NULL,'2025-06-21 02:39:14');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_pedido`
--

DROP TABLE IF EXISTS `detalles_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_pedido` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_pedido`
--

LOCK TABLES `detalles_pedido` WRITE;
/*!40000 ALTER TABLE `detalles_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `duenos`
--

DROP TABLE IF EXISTS `duenos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `duenos` (
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena información de los dueños de mascotas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `duenos`
--

LOCK TABLES `duenos` WRITE;
/*!40000 ALTER TABLE `duenos` DISABLE KEYS */;
INSERT INTO `duenos` VALUES (11,'11111111-1','Prueba','prueba 2','p@gmail.com','56920720569','123456','2025-04-26 19:32:43',1),(8,'111111111','tester','tesr','test@test.cl','111111111','11111','2025-04-26 00:36:27',1),(30,'12.345.678-9','Juan','Pérez','juan@example.com',NULL,'123456','2025-05-09 14:16:31',1),(6,'12345678-9','Juan Carlos','Pérez González','juanc.perez@example.com','56912345678','nuevacontrasena123','2025-04-25 16:37:05',0),(3,'19087654-3','Ana Salas','Salas','ana@gmail.com','99999999','123456','2025-04-11 23:27:48',1),(38,'19634886-7','Tester','Tester','tester@test.com','56999999999','123456','2025-05-31 04:08:05',1),(40,'20040939-6','hector','sanhueza','zanhuezahector@gmail.com','950750978','123456','2025-06-04 23:54:03',1),(32,'20207765-K','Ana','salas','anasalas301@gmail.com','+56930271156','123456','2025-05-09 14:52:45',1),(4,'20250123-4','Pedro López','López','pedro@example.com','912345678','miPass123','2025-04-22 21:46:28',1);
/*!40000 ALTER TABLE `duenos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la especialidad médica',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción detallada de la especialidad',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_especialidad` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de especialidades veterinarias';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` VALUES (1,'Cardiología','Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón.'),(2,'Oncología','Rama de la medicina que estudia y trata los tumores, especialmente el cáncer.'),(3,'Endocrinología','Especialidad centrada en el diagnóstico y tratamiento de los trastornos hormonales.'),(4,'Gastroenterología','Área médica dedicada al estudio del sistema digestivo y sus enfermedades.'),(5,'Dermatología','Especialidad que trata enfermedades de la piel, cabello y uñas.'),(6,'Oftalmología','Especialidad médica que se ocupa de la salud visual y enfermedades oculares.'),(7,'Medicina General','Especialidad médica que atiende una amplia variedad de patologías comunes y chequeos rutinarios.');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especies`
--

DROP TABLE IF EXISTS `especies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la especie animal',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_especie` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de especies animales';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especies`
--

LOCK TABLES `especies` WRITE;
/*!40000 ALTER TABLE `especies` DISABLE KEYS */;
INSERT INTO `especies` VALUES (1,'Perro',1),(2,'Gato',1),(3,'Ave',1),(4,'Conejo',1),(5,'Reptil',1),(6,'Pez',1),(7,'Hámster',1),(8,'Hurón',1);
/*!40000 ALTER TABLE `especies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturas`
--

DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas`
--

LOCK TABLES `facturas` WRITE;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_clinico`
--

DROP TABLE IF EXISTS `historial_clinico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_clinico` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_clinico`
--

LOCK TABLES `historial_clinico` WRITE;
/*!40000 ALTER TABLE `historial_clinico` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_clinico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas` (
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena información de las mascotas registradas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas`
--

LOCK TABLES `mascotas` WRITE;
/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
INSERT INTO `mascotas` VALUES (3,'Max',1,5,'2020-05-15',25.50,'macho',1,'Negro','1',NULL,'20040939-6','2025-05-26 23:30:58',1),(4,'Aurora',1,12,'2020-05-12',5.00,'hembra',0,'Cafe','000001','uploads/mascotas/1748577243141-WhatsAppImage2025-05-29at11.26.33PM.jpeg','20040939-6','2025-05-29 23:54:03',1),(5,'Pancho',1,12,'2024-12-23',3.00,'macho',0,'Cafe','0000002020','uploads/mascotas/1748678954960-WhatsAppImage2025-05-29at11.26.33PM.jpeg','19634886-7','2025-05-31 04:09:14',1),(6,'Copito',1,1,'2019-01-23',1.50,'hembra',1,'Cafe con Blanco','0213654','uploads/mascotas/1749177182096-chihuahua-cara-agresiva.jpg','20040939-6','2025-06-05 22:33:02',1),(7,'Manolito',1,26,'2022-09-13',10.50,'macho',0,'Cafe con negro y blanco','00000002545','uploads/mascotas/1749177382248-razas-de-perros-grandes.jpg','20040939-6','2025-06-05 22:36:22',1),(8,'Manolito',2,31,'2022-09-07',5.10,'hembra',1,'Amarillo con negro','124558543','uploads/mascotas/1749177543829-images.jpeg','20040939-6','2025-06-05 22:39:03',1),(9,'Pancho',1,3,'2025-07-03',50.00,'macho',1,'Cafe','000001',NULL,'11111111-1','2025-06-20 10:32:39',1);
/*!40000 ALTER TABLE `mascotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planes_seguro`
--

DROP TABLE IF EXISTS `planes_seguro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes_seguro` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes_seguro`
--

LOCK TABLES `planes_seguro` WRITE;
/*!40000 ALTER TABLE `planes_seguro` DISABLE KEYS */;
/*!40000 ALTER TABLE `planes_seguro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de productos disponibles';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (9,'SKU001','Alimento Premium para Perros 10kg','Nutrición completa para perros adultos. Rico en proteínas y sin colorantes.',15000.00,19990.00,50,10,1,'uploads/shop/Alimento_Premium_para_Perros_10kg.jpg',10.00,1,1,'2025-06-20 10:53:22'),(10,'SKU002','Alimento Seco para Gatos 3kg','Alimento balanceado con salmón y arroz. Fortalece el sistema inmune.',8000.00,11990.00,30,5,2,'uploads/shop/Alimento_Seco_para Gatos_3kg.jpg',3.00,1,0,'2025-06-20 10:53:22'),(11,'SKU003','Cama Acolchada para Mascotas M','Cama suave y lavable para perros o gatos medianos.',9000.00,12990.00,20,2,3,'uploads/shop/Cama_Acolchada_para_Mascotas_M.jpg',2.00,1,0,'2025-06-20 10:53:22'),(12,'SKU004','Juguete Mordedor para Perros','Juguete de goma duradero para perros medianos a grandes.',2500.00,4990.00,100,10,4,'uploads/shop/Juguete_Mordedor_para_Perros.jpg',0.50,1,0,'2025-06-20 10:53:22'),(13,'SKU005','Correa Retráctil Extensible 5m','Correa para paseos con botón de freno automático.',3500.00,7990.00,25,5,5,'uploads/shop/Correa_Retráctil_Extensible_5m.jpg',0.60,1,1,'2025-06-20 10:53:22'),(14,'SKU006','Shampoo Natural para Mascotas 500ml','Limpieza suave con aloe vera. Apto para piel sensible.',2000.00,4990.00,40,5,6,'uploads/shop/Shampoo_Natural_para_Mascotas_500ml.jpg',0.50,1,0,'2025-06-20 10:53:22'),(15,'SKU007','Arnés Ajustable Talla M','Arnés cómodo y seguro para paseos diarios.',4000.00,7490.00,30,5,7,'uploads/shop/Arnés_Ajustable_Talla_M.jpg',0.30,1,1,'2025-06-20 10:53:22'),(16,'SKU008','Snacks Dentales para Perros','Ayuda a la salud bucal de tu mascota. Sabor pollo.',1800.00,3990.00,60,10,1,'uploads/shop/Snacks_Dentales_para_Perros.jpg',0.20,1,1,'2025-06-20 10:53:22');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `razas`
--

DROP TABLE IF EXISTS `razas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `razas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la raza',
  `especie_id` int unsigned NOT NULL COMMENT 'Especie a la que pertenece la raza',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción y características de la raza',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_raza_especie` (`nombre`,`especie_id`),
  KEY `idx_razas_especie` (`especie_id`),
  CONSTRAINT `fk_raza_especie` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de razas por especie animal';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `razas`
--

LOCK TABLES `razas` WRITE;
/*!40000 ALTER TABLE `razas` DISABLE KEYS */;
INSERT INTO `razas` VALUES (1,'Mestizo',1,'Perro de raza mixta, sin pedigrí específico'),(2,'Labrador Retriever',1,'Raza grande, amigable y activa, excelente para familias'),(3,'Golden Retriever',1,'Raza grande, inteligente y leal, muy popular como mascota familiar'),(4,'Pastor Alemán',1,'Raza grande, inteligente y versátil, utilizada como perro de trabajo'),(5,'Bulldog Francés',1,'Raza pequeña, compacta y de carácter amigable'),(6,'Chihuahua',1,'Raza muy pequeña, valiente y leal a su dueño'),(7,'Poodle',1,'Raza inteligente e hipoalergénica, disponible en varios tamaños'),(8,'Rottweiler',1,'Raza grande y poderosa, excelente perro guardián'),(9,'Yorkshire Terrier',1,'Raza pequeña, elegante y con mucha personalidad'),(10,'Beagle',1,'Raza mediana, amigable y con excelente olfato'),(11,'Boxer',1,'Raza mediana-grande, enérgica y juguetona'),(12,'Dachshund',1,'Raza pequeña de cuerpo alargado, también conocido como \"perro salchicha\"'),(13,'Siberian Husky',1,'Raza grande, resistente al frío y muy activa'),(14,'Shih Tzu',1,'Raza pequeña, de pelo largo y temperamento tranquilo'),(15,'Boston Terrier',1,'Raza pequeña-mediana, inteligente y de buen carácter'),(16,'Pug',1,'Raza pequeña, de cara chata y personalidad encantadora'),(17,'Cocker Spaniel',1,'Raza mediana, de pelo sedoso y temperamento dulce'),(18,'Border Collie',1,'Raza mediana, extremadamente inteligente y activa'),(19,'Pitbull',1,'Raza mediana-grande, fuerte y leal cuando es bien socializada'),(20,'Schnauzer',1,'Raza disponible en tres tamaños, inteligente y alerta'),(21,'Doberman',1,'Raza grande, elegante y protectora'),(22,'Great Dane',1,'Raza gigante, conocido como \"gigante gentil\"'),(23,'Bulldog Inglés',1,'Raza mediana, robusta y de temperamento tranquilo'),(24,'Jack Russell Terrier',1,'Raza pequeña, muy activa y enérgica'),(25,'Akita',1,'Raza grande japonesa, leal y digna'),(26,'San Bernardo',1,'Raza gigante, famosa por rescates en montaña'),(27,'Weimaraner',1,'Raza grande de caza, elegante y atlética'),(28,'Australian Shepherd',1,'Raza mediana, inteligente y de trabajo'),(29,'Bernese Mountain Dog',1,'Raza grande, tranquila y familiar'),(30,'Cavalier King Charles Spaniel',1,'Raza pequeña, elegante y cariñosa'),(31,'Mestizo',2,'Gato de raza mixta, sin pedigrí específico'),(32,'Persa',2,'Raza de pelo largo, cara chata y temperamento tranquilo'),(33,'Siamés',2,'Raza elegante, vocal y muy social'),(34,'Maine Coon',2,'Raza grande de pelo semilargo, conocida como \"gigante gentil\"'),(35,'Ragdoll',2,'Raza grande, de temperamento muy dócil y relajado'),(36,'British Shorthair',2,'Raza robusta de pelo corto y carácter independiente'),(37,'Abisinio',2,'Raza activa y curiosa, de pelo corto y color rojizo'),(38,'Bengalí',2,'Raza con patrón similar al leopardo, muy activa'),(39,'Russian Blue',2,'Raza de pelo corto azul-gris y ojos verdes'),(40,'Sphynx',2,'Raza sin pelo, muy cariñosa y que busca calor'),(41,'Scottish Fold',2,'Raza caracterizada por sus orejas dobladas hacia adelante'),(42,'Munchkin',2,'Raza de patas cortas, juguetona y activa'),(43,'Angora Turco',2,'Raza de pelo largo y sedoso, muy elegante'),(44,'Birmano',2,'Raza de pelo semilargo con puntos de color y \"guantes\" blancos'),(45,'Exotic Shorthair',2,'Versión de pelo corto del gato Persa'),(46,'Oriental',2,'Raza esbelta y elegante, relacionada con el Siamés'),(47,'Manx',2,'Raza caracterizada por no tener cola o tenerla muy corta'),(48,'Himalayo',2,'Cruce entre Persa y Siamés, pelo largo con puntos de color'),(49,'Devon Rex',2,'Raza de pelo rizado y orejas grandes'),(50,'Cornish Rex',2,'Raza de pelo muy corto y rizado, cuerpo elegante'),(51,'Norwegian Forest',2,'Raza grande de pelo largo, resistente al frío'),(52,'Tonkinés',2,'Cruce entre Siamés y Birmano, muy social'),(53,'American Shorthair',2,'Raza robusta y adaptable'),(54,'Chartreux',2,'Raza francesa de pelo corto azul-gris'),(55,'Selkirk Rex',2,'Raza de pelo rizado, tranquila y cariñosa'),(56,'Canario',3,'Ave pequeña cantora, disponible en varios colores'),(57,'Periquito Australiano',3,'Ave pequeña muy popular como mascota'),(58,'Cacatúa',3,'Ave grande con cresta característica'),(59,'Loro Gris Africano',3,'Ave muy inteligente capaz de imitar sonidos'),(60,'Agapornis',3,'Ave pequeña también conocida como \"inseparable\"'),(61,'Ninfa',3,'Ave mediana con cresta y mejillas coloradas'),(62,'Amazonas',3,'Loro de tamaño mediano-grande, muy inteligente'),(63,'Guacamayo',3,'Loro grande y colorido'),(64,'Conure',3,'Loro pequeño-mediano, social y juguetón'),(65,'Diamante de Gould',3,'Ave pequeña muy colorida'),(66,'Jilguero',3,'Ave cantora pequeña'),(67,'Mandarín',3,'Ave pequeña social, vive en grupos'),(68,'Mestizo',4,'Conejo de raza mixta'),(69,'Holland Lop',4,'Conejo pequeño con orejas caídas'),(70,'Flemish Giant',4,'Raza de conejo muy grande'),(71,'Lionhead',4,'Conejo con melena característica alrededor de la cabeza'),(72,'Mini Rex',4,'Conejo pequeño de pelo muy suave'),(73,'Dutch',4,'Conejo con patrón de color característico blanco y otro color'),(74,'Angora',4,'Conejo de pelo muy largo que requiere cepillado constante'),(75,'Californian',4,'Conejo mediano-grande, blanco con puntos oscuros'),(76,'New Zealand',4,'Conejo grande, comúnmente blanco'),(77,'Mini Lop',4,'Conejo pequeño con orejas caídas'),(78,'Netherland Dwarf',4,'Conejo muy pequeño, una de las razas más pequeñas'),(79,'English Lop',4,'Conejo con orejas extremadamente largas'),(80,'Iguana Verde',5,'Reptil herbívoro de tamaño grande'),(81,'Gecko Leopardo',5,'Pequeño gecko con manchas características'),(82,'Pitón Bola',5,'Serpiente no venenosa de tamaño mediano'),(83,'Pogona',5,'Lagarto también conocido como \"dragón barbudo\"'),(84,'Tortuga Rusa',5,'Tortuga terrestre de tamaño pequeño-mediano'),(85,'Boa Constrictor',5,'Serpiente grande no venenosa'),(86,'Camaleón',5,'Lagarto que cambia de color'),(87,'Gecko Crestado',5,'Gecko nocturno con cresta característica'),(88,'Monitor de Sabana',5,'Lagarto grande e inteligente'),(89,'Tortuga de Orejas Rojas',5,'Tortuga acuática muy común como mascota'),(90,'Anolis Verde',5,'Pequeño lagarto que cambia de color'),(91,'Escincoideos',5,'Lagarto liso de tamaño pequeño-mediano'),(92,'Goldfish',6,'Pez dorado, muy resistente y popular'),(93,'Betta',6,'Pez luchador siamés, colorido y territorial'),(94,'Guppy',6,'Pez pequeño y colorido, fácil de cuidar'),(95,'Neón',6,'Pez pequeño con banda azul brillante'),(96,'Platy',6,'Pez tropical pacífico y resistente'),(97,'Molly',6,'Pez tropical adaptable a diferentes condiciones'),(98,'Angel Fish',6,'Pez ángel, elegante y popular en acuarios'),(99,'Discus',6,'Pez disco, considerado el rey de los acuarios'),(100,'Corydora',6,'Pez gato pequeño, limpiador de fondo'),(101,'Tetra Cardenal',6,'Pez pequeño con colores azul y rojo intensos'),(102,'Koi',6,'Carpa japonesa ornamental, para estanques'),(103,'Oscar',6,'Pez cíclido grande e inteligente'),(104,'Hámster Dorado',7,'Hámster sirio, el más común como mascota'),(105,'Hámster Enano Ruso',7,'Hámster pequeño y social'),(106,'Hámster Roborovski',7,'El hámster más pequeño, muy activo'),(107,'Hámster Chino',7,'Hámster de cola larga, parecido a un ratón'),(108,'Hámster Europeo',7,'Hámster salvaje europeo, menos común como mascota'),(109,'Hurón Doméstico',8,'Mustélido domesticado, juguetón y social'),(110,'Hurón Angora',8,'Hurón de pelo largo'),(111,'Hurón Estándar',8,'Hurón de tamaño y pelaje estándar'),(112,'Hurón Champagne',8,'Hurón de color claro característico'),(113,'Hurón Sable',8,'Hurón de color oscuro, el más común');
/*!40000 ALTER TABLE `razas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguros_contratados`
--

DROP TABLE IF EXISTS `seguros_contratados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguros_contratados` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguros_contratados`
--

LOCK TABLES `seguros_contratados` WRITE;
/*!40000 ALTER TABLE `seguros_contratados` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguros_contratados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_consulta`
--

DROP TABLE IF EXISTS `tipos_consulta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_consulta` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del tipo de consulta',
  `descripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción del tipo de consulta',
  `duracion_minutos` int DEFAULT '30' COMMENT 'Duración estimada en minutos',
  `precio` decimal(10,2) DEFAULT NULL COMMENT 'Precio base de la consulta',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_tipo_consulta` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de tipos de consultas ofrecidas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_consulta`
--

LOCK TABLES `tipos_consulta` WRITE;
/*!40000 ALTER TABLE `tipos_consulta` DISABLE KEYS */;
INSERT INTO `tipos_consulta` VALUES (1,'Cardiología','Consulta especializada en enfermedades del corazón.',30,35000.00),(2,'Oncología','Consulta para diagnóstico y tratamiento del cáncer.',30,40000.00),(3,'Endocrinología','Consulta sobre trastornos hormonales y metabólicos.',30,33000.00),(4,'Gastroenterología','Consulta sobre enfermedades del aparato digestivo.',30,32000.00),(5,'Dermatología','Consulta sobre enfermedades de la piel.',30,30000.00),(6,'Oftalmología','Consulta sobre salud visual y ocular.',30,31000.00),(7,'General','Consulta médica general para evaluación inicial de síntomas o chequeos rutinarios.',30,25000.00);
/*!40000 ALTER TABLE `tipos_consulta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veterinarios`
--

DROP TABLE IF EXISTS `veterinarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veterinarios` (
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena información de los veterinarios';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veterinarios`
--

LOCK TABLES `veterinarios` WRITE;
/*!40000 ALTER TABLE `veterinarios` DISABLE KEYS */;
INSERT INTO `veterinarios` VALUES (1,'Dra. Paula Torres','paula.torres@happypet.cl','+56912345678','password123',1,'LIC-001','2025-06-19 21:36:29',1),(2,'Dr. Marco Reyes','marco.reyes@happypet.cl','+56987654321','password123',2,'LIC-002','2025-06-19 21:36:29',1),(3,'Dra. Camila Soto','camila.soto@happypet.cl','+56911223344','password123',3,'LIC-003','2025-06-19 21:36:29',1),(4,'Dr. Tomás Leiva','tomas.leiva@happypet.cl','+56999887766','password123',4,'LIC-004','2025-06-19 21:36:29',1),(5,'Dra. Antonia Ríos','antonia.rios@happypet.cl','+56933445566','password123',5,'LIC-005','2025-06-19 21:36:29',1),(6,'Dr. Felipe Navarro','felipe.navarro@happypet.cl','+56955667788','password123',6,'LIC-006','2025-06-19 21:36:29',1),(7,'Dra. Ana Salas','ana.salas@happypet.cl','+56966778899','password123',7,'LIC-007','2025-06-19 21:36:29',1),(8,'Dra. Chiara Sanhueza','Chiara.sanhueza@happypet.cl','+56965505218','password123',1,'LIC-008','2025-06-19 21:37:45',1),(9,'Dr. Juan Pablo Sanhueza','JuanPablo.sanhueza@happypet.cl','+56976153946','password123',1,'LIC-009','2025-06-19 21:38:32',1);
/*!40000 ALTER TABLE `veterinarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-21  2:49:08
