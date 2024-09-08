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

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
