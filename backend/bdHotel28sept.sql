-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.4.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para hotel
CREATE DATABASE IF NOT EXISTS `hotel` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `hotel`;

-- Volcando estructura para tabla hotel.adonis_schema
CREATE TABLE IF NOT EXISTS `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  `migration_time` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.adonis_schema_versions
CREATE TABLE IF NOT EXISTS `adonis_schema_versions` (
  `version` int(10) unsigned NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.apertura_caja
CREATE TABLE IF NOT EXISTS `apertura_caja` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `monto` float(8,2) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `apertura_caja_user_id_foreign` (`user_id`),
  CONSTRAINT `apertura_caja_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.arqueo_caja
CREATE TABLE IF NOT EXISTS `arqueo_caja` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `apertura_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `monto` float(8,2) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `arqueo_caja_apertura_id_foreign` (`apertura_id`),
  KEY `arqueo_caja_user_id_foreign` (`user_id`),
  CONSTRAINT `arqueo_caja_apertura_id_foreign` FOREIGN KEY (`apertura_id`) REFERENCES `apertura_caja` (`id`),
  CONSTRAINT `arqueo_caja_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.auth_access_tokens
CREATE TABLE IF NOT EXISTS `auth_access_tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_id` int(10) unsigned NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `hash` varchar(255) NOT NULL,
  `abilities` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auth_access_tokens_tokenable_id_foreign` (`tokenable_id`),
  CONSTRAINT `auth_access_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para vista hotel.cajas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `cajas` (
	`id_apertura` INT(10) UNSIGNED NOT NULL,
	`id_arqueo` INT(10) UNSIGNED NULL,
	`user_id` INT(10) UNSIGNED NULL,
	`usuario` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`fecha_apertura` DATETIME NOT NULL,
	`observaciones` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`monto` FLOAT(8,2) NOT NULL,
	`estado` VARCHAR(8) NOT NULL COLLATE 'utf8mb4_general_ci',
	`fecha_arqueo` DATETIME NULL,
	`monto_arqueo` FLOAT(8,2) NULL,
	`anulado` TINYINT(1) NULL,
	`fecha_cierre` DATETIME NULL,
	`monto_sistema` FLOAT(8,2) NULL,
	`existe_cierre` INT(1) NOT NULL,
	`observacionesCierre` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`aplicaCierre` INT(1) NULL
) ENGINE=MyISAM;

-- Volcando estructura para tabla hotel.cierre_caja
CREATE TABLE IF NOT EXISTS `cierre_caja` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `arqueo_id` int(10) unsigned DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `monto_sistema` float(8,2) NOT NULL,
  `observaciones` varchar(255) NOT NULL,
  `anulado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `cierre_caja_user_id_foreign` (`user_id`),
  KEY `cierre_caja_arqueo_id_foreign` (`arqueo_id`),
  CONSTRAINT `cierre_caja_arqueo_id_foreign` FOREIGN KEY (`arqueo_id`) REFERENCES `arqueo_caja` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cierre_caja_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.clases_habitaciones
CREATE TABLE IF NOT EXISTS `clases_habitaciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `tipo_documento` enum('NIT','CUI','IDE') NOT NULL,
  `num_documento` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `clientes_user_id_foreign` (`user_id`),
  CONSTRAINT `clientes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.detalle_facturas
CREATE TABLE IF NOT EXISTS `detalle_facturas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `factura_id` int(10) unsigned DEFAULT NULL,
  `producto_id` int(10) unsigned DEFAULT NULL,
  `cantidad` float(8,2) NOT NULL,
  `costo` float(8,2) NOT NULL,
  `precio_venta` float(8,2) NOT NULL,
  `descuento` float(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `detalle_facturas_factura_id_foreign` (`factura_id`),
  KEY `detalle_facturas_producto_id_foreign` (`producto_id`),
  CONSTRAINT `detalle_facturas_factura_id_foreign` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_facturas_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.detalle_hospedajes
CREATE TABLE IF NOT EXISTS `detalle_hospedajes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hospedaje_id` int(10) unsigned DEFAULT NULL,
  `producto_id` int(10) unsigned DEFAULT NULL,
  `cantidad` float(8,2) NOT NULL,
  `costo` float(8,2) NOT NULL,
  `precio_venta` float(8,2) NOT NULL,
  `descuento` float(8,2) NOT NULL,
  `pagado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `detalle_hospedajes_hospedaje_id_foreign` (`hospedaje_id`),
  KEY `detalle_hospedajes_producto_id_foreign` (`producto_id`),
  CONSTRAINT `detalle_hospedajes_hospedaje_id_foreign` FOREIGN KEY (`hospedaje_id`) REFERENCES `hospedajes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_hospedajes_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.facturas
CREATE TABLE IF NOT EXISTS `facturas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hospedaje_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `num_factura` int(11) NOT NULL,
  `nit` varchar(255) DEFAULT NULL,
  `nombre_facturado` varchar(255) DEFAULT NULL,
  `direccion_facturado` varchar(255) DEFAULT NULL,
  `numero_fel` varchar(255) DEFAULT NULL,
  `serie_fel` varchar(255) DEFAULT NULL,
  `autorizacion_fel` varchar(255) DEFAULT NULL,
  `emision_fel` datetime DEFAULT NULL,
  `certificacion_fel` datetime DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `total` float(8,2) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `facturas_hospedaje_id_foreign` (`hospedaje_id`),
  KEY `facturas_user_id_foreign` (`user_id`),
  CONSTRAINT `facturas_hospedaje_id_foreign` FOREIGN KEY (`hospedaje_id`) REFERENCES `hospedajes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `facturas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.gastos
CREATE TABLE IF NOT EXISTS `gastos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `tipo_gasto_id` int(10) unsigned DEFAULT NULL,
  `proveedor_id` int(10) unsigned DEFAULT NULL,
  `descripcion` varchar(255) NOT NULL,
  `monto` float(8,2) NOT NULL,
  `fecha` date NOT NULL,
  `anulado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `gastos_user_id_foreign` (`user_id`),
  KEY `gastos_tipo_gasto_id_foreign` (`tipo_gasto_id`),
  KEY `gastos_proveedor_id_foreign` (`proveedor_id`),
  CONSTRAINT `gastos_proveedor_id_foreign` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gastos_tipo_gasto_id_foreign` FOREIGN KEY (`tipo_gasto_id`) REFERENCES `tipogastos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gastos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.habitaciones
CREATE TABLE IF NOT EXISTS `habitaciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `nivel_id` int(10) unsigned NOT NULL,
  `clase_habitacion_id` int(10) unsigned NOT NULL,
  `precio` float(8,2) NOT NULL,
  `tarifa` float(8,2) NOT NULL,
  `estado` enum('D','O','L') NOT NULL,
  `numero_personas` int(11) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `habitaciones_nivel_id_foreign` (`nivel_id`),
  KEY `habitaciones_clase_habitacion_id_foreign` (`clase_habitacion_id`),
  CONSTRAINT `habitaciones_clase_habitacion_id_foreign` FOREIGN KEY (`clase_habitacion_id`) REFERENCES `clases_habitaciones` (`id`),
  CONSTRAINT `habitaciones_nivel_id_foreign` FOREIGN KEY (`nivel_id`) REFERENCES `niveles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.hospedajes
CREATE TABLE IF NOT EXISTS `hospedajes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `reservacion_id` int(10) unsigned DEFAULT NULL,
  `habitacion_id` int(10) unsigned DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `total` float(8,2) NOT NULL,
  `monto_penalidad` float(8,2) NOT NULL DEFAULT 0.00,
  `facturado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `hospedajes_cliente_id_foreign` (`cliente_id`),
  KEY `hospedajes_user_id_foreign` (`user_id`),
  KEY `hospedajes_reservacion_id_foreign` (`reservacion_id`),
  KEY `hospedajes_habitacion_id_foreign` (`habitacion_id`),
  CONSTRAINT `hospedajes_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hospedajes_habitacion_id_foreign` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hospedajes_reservacion_id_foreign` FOREIGN KEY (`reservacion_id`) REFERENCES `reservaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hospedajes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.modulos
CREATE TABLE IF NOT EXISTS `modulos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.modulo_rol
CREATE TABLE IF NOT EXISTS `modulo_rol` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rol_id` int(10) unsigned DEFAULT NULL,
  `modulo_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modulo_rol_rol_id_foreign` (`rol_id`),
  KEY `modulo_rol_modulo_id_foreign` (`modulo_id`),
  CONSTRAINT `modulo_rol_modulo_id_foreign` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modulo_rol_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.niveles
CREATE TABLE IF NOT EXISTS `niveles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para función hotel.obtenerInfoEstado
DELIMITER //
CREATE FUNCTION `obtenerInfoEstado`(id_habitacion INT, estado CHAR(1), fecha DATETIME) RETURNS int(11)
BEGIN
   DECLARE numeroHoras INT DEFAULT 0;
	
	IF estado='D' THEN
		SELECT TIMESTAMPDIFF(MINUTE, fecha, reservaciones.fecha_inicio) 
    	INTO numeroHoras
    	FROM reservaciones
		WHERE (TIMESTAMPDIFF(MINUTE, fecha, reservaciones.fecha_inicio)  < 1440)
		AND (TIMESTAMPDIFF(MINUTE, fecha, reservaciones.fecha_inicio)  > -1440)
		AND anulado=0 AND (habitacion_id=id_habitacion) LIMIT 1;
	ELSEIF estado ='O' THEN
		SELECT TIMESTAMPDIFF(MINUTE, reservaciones.fecha_fin , fecha) 
    	INTO numeroHoras
    	FROM reservaciones
		WHERE (TIMESTAMPDIFF(MINUTE, reservaciones.fecha_fin , fecha)  > 0)
		AND anulado=0 AND (habitacion_id=id_habitacion) LIMIT 1;
	END IF;

    RETURN numeroHoras;
END//
DELIMITER ;

-- Volcando estructura para función hotel.obtener_estado_habitacion
DELIMITER //
CREATE FUNCTION `obtener_estado_habitacion`(id_habitacion INT, fecha_hora_actual DATETIME) RETURNS char(1) CHARSET latin1 COLLATE latin1_swedish_ci
BEGIN
    DECLARE numeroMinutos INT DEFAULT 0;
    DECLARE estadoActual CHAR(1);

    -- Obtiene el estado actual de la habitación
    SELECT estado INTO estadoActual 
    FROM habitaciones 
    WHERE id = id_habitacion;

    -- Verifica si el estado es 'D' (Disponible)
    IF estadoActual = 'D' THEN
        SELECT COUNT(r.id)
        INTO numeroMinutos
        FROM reservaciones r
        JOIN habitaciones h ON r.habitacion_id = h.id
        WHERE h.id = id_habitacion 
          AND r.anulado = 0
          AND r.estado='creada'
          AND TIMESTAMPDIFF(MINUTE, fecha_hora_actual, r.fecha_inicio) < (
            SELECT tarifa * 60 FROM habitaciones WHERE id = id_habitacion
          )
        LIMIT 1;

        -- Si hay una reservación próxima en menos tiempo del que dura una estancia, devuelve 'R'
        IF numeroMinutos > 0 THEN
            RETURN 'R';
        ELSE
            RETURN 'D';
        END IF;

    -- Verifica si el estado es 'O' (Ocupada)
    ELSEIF estadoActual = 'O' THEN
        SELECT TIMESTAMPDIFF(MINUTE, r.fecha_fin, fecha_hora_actual)
        INTO numeroMinutos
        FROM reservaciones r
        WHERE r.habitacion_id = id_habitacion 
          AND r.anulado = 0
          AND TIMESTAMPDIFF(MINUTE, r.fecha_fin, fecha_hora_actual) > 0
        LIMIT 1;

        -- Si ha pasado más de un minuto desde la fecha_fin de la reservación, devuelve 'S'
        IF numeroMinutos IS NOT NULL AND numeroMinutos > 1 THEN
            RETURN 'S';
        ELSE
            RETURN 'O';
        END IF;

    ELSE
        RETURN estadoActual;
    END IF;
END//
DELIMITER ;

-- Volcando estructura para función hotel.obtener_opcion_pago
DELIMITER //
CREATE FUNCTION `obtener_opcion_pago`(`id_documento` INT,
	`tipo_doc` VARCHAR(255),
	`metodo_pago` VARCHAR(255)
) RETURNS float
BEGIN
    DECLARE monto FLOAT;
    
    SELECT monto INTO monto
    FROM opciones_pagos
    WHERE tipo_documento = tipo_doc AND metodo = metodo_pago AND documento_id = id_documento
    LIMIT 1;

    RETURN monto;
END//
DELIMITER ;

-- Volcando estructura para función hotel.obtener_reservacion_proxima
DELIMITER //
CREATE FUNCTION `obtener_reservacion_proxima`(id_habitacion INT, fecha_hora_actual DATETIME) RETURNS int(11)
BEGIN
    DECLARE idReservacion INT DEFAULT 0;

        SELECT r.id
        INTO idReservacion
        FROM reservaciones r
        JOIN habitaciones h ON r.habitacion_id = h.id
        WHERE h.id = id_habitacion 
          AND r.anulado = 0
          AND r.estado='creada'
          AND TIMESTAMPDIFF(MINUTE, fecha_hora_actual, r.fecha_inicio) < (
            SELECT tarifa * 60 FROM habitaciones WHERE id = id_habitacion
          )
        LIMIT 1;

        
        RETURN idReservacion;
END//
DELIMITER ;

-- Volcando estructura para tabla hotel.opciones_pagos
CREATE TABLE IF NOT EXISTS `opciones_pagos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `apertura_id` int(10) unsigned DEFAULT NULL,
  `tipo_documento` varchar(255) NOT NULL,
  `documento_id` int(11) NOT NULL,
  `metodo` varchar(255) NOT NULL,
  `monto` float(8,2) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `opciones_pagos_apertura_id_foreign` (`apertura_id`),
  CONSTRAINT `opciones_pagos_apertura_id_foreign` FOREIGN KEY (`apertura_id`) REFERENCES `apertura_caja` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` float(8,2) NOT NULL,
  `precio_venta` float(8,2) NOT NULL,
  `existencia` float(8,2) NOT NULL,
  `es_servicio` tinyint(1) NOT NULL,
  `fecha_ingreso` datetime NOT NULL,
  `anulado` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.proveedores
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nit` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.reservaciones
CREATE TABLE IF NOT EXISTS `reservaciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `habitacion_id` int(10) unsigned NOT NULL,
  `cliente_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `total` float(8,2) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `numero_adultos` int(11) NOT NULL,
  `numero_ninos` int(11) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `pagado` tinyint(1) DEFAULT 0,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `reservaciones_habitacion_id_foreign` (`habitacion_id`),
  KEY `reservaciones_cliente_id_foreign` (`cliente_id`),
  KEY `reservaciones_user_id_foreign` (`user_id`),
  CONSTRAINT `reservaciones_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `reservaciones_habitacion_id_foreign` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`),
  CONSTRAINT `reservaciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla hotel.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para vista hotel.rptfacturas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `rptfacturas` (
	`fecha` DATE NULL,
	`numFactura` INT(11) NOT NULL,
	`nit` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`cliente` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`total` DOUBLE(19,2) NULL,
	`usuario` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista hotel.rptgastos
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `rptgastos` (
	`id` INT(10) UNSIGNED NOT NULL,
	`fecha` DATE NOT NULL,
	`gasto` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`efectivo` DOUBLE(19,2) NULL,
	`tarjeta` DOUBLE(19,2) NULL,
	`total` FLOAT(8,2) NOT NULL,
	`proveedor` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`tipogasto` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`usuario` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci'
) ENGINE=MyISAM;

-- Volcando estructura para tabla hotel.tipogastos
CREATE TABLE IF NOT EXISTS `tipogastos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para vista hotel.transacciones_caja
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `transacciones_caja` (
	`fecha` DATETIME NULL,
	`tipo` VARCHAR(14) NULL COLLATE 'utf8mb4_general_ci',
	`razon` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`documentoId` INT(10) UNSIGNED NULL,
	`totalEfectivo` DOUBLE(19,2) NULL,
	`totalTarjeta` DOUBLE(19,2) NULL,
	`totalTransferencia` DOUBLE(19,2) NULL,
	`totalCheque` DOUBLE(19,2) NULL,
	`total` DOUBLE(19,2) NULL,
	`apertura_id` INT(10) UNSIGNED NULL,
	`idReservacion` INT(10) UNSIGNED NULL,
	`reservacionPagada` VARCHAR(2) NULL COLLATE 'utf8mb4_general_ci',
	`anulado` TINYINT(4) NULL
) ENGINE=MyISAM;

-- Volcando estructura para tabla hotel.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int(10) unsigned DEFAULT NULL,
  `anulado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_email_unique` (`email`),
  KEY `usuarios_rol_id_foreign` (`rol_id`),
  CONSTRAINT `usuarios_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para vista hotel.vdetalle_hospedaje
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vdetalle_hospedaje` (
	`id` INT(10) UNSIGNED NOT NULL,
	`hospedaje_id` INT(10) UNSIGNED NULL,
	`producto_id` INT(10) UNSIGNED NULL,
	`cantidad` FLOAT(8,2) NOT NULL,
	`costo` FLOAT(8,2) NOT NULL,
	`precio_venta` FLOAT(8,2) NOT NULL,
	`descuento` FLOAT(8,2) NOT NULL,
	`subtotal` DOUBLE(19,2) NOT NULL,
	`pagado` TINYINT(1) NOT NULL,
	`descripcion` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`servicio` TINYINT(1) NOT NULL
) ENGINE=MyISAM;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `cajas`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `cajas` AS SELECT ap.id AS id_apertura,ar.id AS id_arqueo, ap.user_id, full_name AS usuario, ap.fecha AS fecha_apertura, ap.observaciones,
ap.monto, CASE WHEN ci.id IS NOT NULL THEN 'Cierre' WHEN ar.id IS NOT NULL THEN 'Arqueo' 
ELSE 'Apertura' END AS estado, ar.fecha AS fecha_arqueo,ar.monto AS monto_arqueo ,ap.anulado,
ci.fecha AS fecha_cierre, ci.monto_sistema , CASE 
        WHEN EXISTS (SELECT 1 FROM cierre_caja ci_sub WHERE ci_sub.arqueo_id = ar.id AND ci_sub.anulado=0) THEN 1 
        ELSE 0 
    END AS existe_cierre,
ci.observaciones AS observacionesCierre,
CASE WHEN EXISTS (SELECT 1 FROM arqueo_caja ar_sub WHERE ar_sub.apertura_id = ap.id AND ar_sub.anulado=0) AND ap.anulado=0 THEN 1 
   ELSE 0 
END AS aplicaCierre
FROM apertura_caja ap
LEFT JOIN arqueo_caja ar ON ap.id = ar.apertura_id
LEFT JOIN cierre_caja ci ON ar.id = ci.arqueo_id
LEFT JOIN usuarios u 	 ON ap.user_id = u.id ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `rptfacturas`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `rptfacturas` AS SELECT DATE(f.fecha_registro) AS fecha, f.num_factura AS numFactura, f.nit, f.nombre_facturado AS cliente, 
SUM((d.cantidad * d.precio_venta) - d.descuento) AS total, u.full_name AS usuario
FROM facturas f 
INNER JOIN detalle_facturas d ON f.id = d.factura_id
INNER JOIN usuarios u ON u.id = f.user_id
WHERE f.anulado = 0
GROUP BY f.id, f.fecha_registro, f.num_factura, f.nit, f.nombre_facturado, u.full_name ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `rptgastos`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `rptgastos` AS SELECT 
    g.id, 
    g.fecha, 
    g.descripcion AS gasto, 
    SUM(CASE WHEN op.metodo = 'EFE' THEN op.monto ELSE 0 END) AS efectivo,
    SUM(CASE WHEN op.metodo = 'TAR' THEN op.monto ELSE 0 END) AS tarjeta,
    g.monto AS total,
    p.nombre AS proveedor,
    t.tipo AS tipogasto, 
    u.full_name AS usuario
FROM 
    gastos g 
INNER JOIN 
    proveedores p ON p.id = g.proveedor_id
INNER JOIN 
    tipogastos t ON t.id = g.tipo_gasto_id
INNER JOIN 
    usuarios u ON u.id = g.user_id 
INNER JOIN 
    opciones_pagos op ON g.id = op.documento_id
WHERE 
    op.tipo_documento = 'FG' 
    AND g.anulado = 0 
GROUP BY 
    g.id, 
    g.fecha, 
    g.descripcion, 
    g.monto,
    p.nombre, 
    t.tipo, 
    u.full_name ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `transacciones_caja`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `transacciones_caja` AS SELECT 
  CASE pd.tipo_documento WHEN 'FH' THEN f.fecha_registro
  WHEN 'FG' THEN g.fecha
  END AS fecha, 
  CASE pd.tipo_documento WHEN 'FH' THEN 'FACT HOSPEDAJE'
  WHEN 'FG' THEN 'FACT GASTO'
  WHEN 'R' THEN 'RESERVACION'
  WHEN 'FC' THEN 'FACT COMPRA'
  END AS tipo,
  CASE pd.tipo_documento WHEN 'FH' THEN f.nombre_facturado
  WHEN 'FG' THEN p.nombre
  END AS razon,
  COALESCE(h.id, f.id, g.id) AS documentoId, -- El id del hospedaje, factura o gasto
  SUM(CASE WHEN pd.metodo = 'EFE' THEN pd.monto ELSE 0 END) AS totalEfectivo,
  SUM(CASE WHEN pd.metodo = 'TAR' THEN pd.monto ELSE 0 END) AS totalTarjeta,
  SUM(CASE WHEN pd.metodo = 'TRA' THEN pd.monto ELSE 0 END) AS totalTransferencia,
  SUM(CASE WHEN pd.metodo = 'CHE' THEN pd.monto ELSE 0 END) AS totalCheque,
  SUM(pd.monto) AS total,
  pd.apertura_id,
  COALESCE(r.id, h.reservacion_id) AS idReservacion,   
  CASE 
    WHEN r.pagado = 1 OR h.reservacion_id IS NOT NULL AND EXISTS (SELECT 1 FROM reservaciones r2 WHERE r2.id = h.reservacion_id AND r2.pagado = 1) 
    THEN 'Sí' ELSE 'No' 
  END AS reservacionPagada, 
  CASE pd.tipo_documento WHEN 'FH' THEN f.anulado
  WHEN 'FG' THEN g.anulado
  END AS anulado
FROM opciones_pagos pd
LEFT JOIN hospedajes h ON pd.tipo_documento = 'H' AND pd.documento_id = h.id
LEFT JOIN facturas f ON pd.tipo_documento = 'FH' AND pd.documento_id = f.num_factura
LEFT JOIN gastos g ON pd.tipo_documento = 'FG' AND pd.documento_id = g.id
LEFT JOIN proveedores p ON g.proveedor_id = p.id
LEFT JOIN reservaciones r ON pd.tipo_documento = 'R' AND pd.documento_id = r.id

GROUP BY pd.tipo_documento, pd.documento_id, pd.apertura_id ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vdetalle_hospedaje`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vdetalle_hospedaje` AS SELECT d.id, hospedaje_id, producto_id, cantidad, d.costo, d.precio_venta, d.descuento, 
	(d.cantidad * d.precio_venta) -d.descuento AS subtotal ,d.pagado, p.nombre AS descripcion, p.es_servicio AS servicio
 	FROM detalle_hospedajes  d
	INNER JOIN productos p ON d.producto_id = p.id ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
