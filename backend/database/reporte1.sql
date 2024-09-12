SELECT 
  pd.tipoDocumento,
  COALESCE(h.id, f.id, g.id) AS documentoId, -- El id del hospedaje, factura o gasto
  SUM(CASE WHEN pd.metodoPago = 'efectivo' THEN pd.monto ELSE 0 END) AS totalEfectivo,
  SUM(CASE WHEN pd.metodoPago = 'tarjeta' THEN pd.monto ELSE 0 END) AS totalTarjeta,
  SUM(pd.monto) AS total,
  
  -- Información de la reservación
  COALESCE(r.id, h.idReservacion) AS idReservacion, -- El id de la reservación (de la tabla Reservacion)
  CASE 
    WHEN r.pagado = 1 OR h.idReservacion IS NOT NULL AND EXISTS (SELECT 1 FROM Reservacion r2 WHERE r2.id = h.idReservacion AND r2.pagado = 1) 
    THEN 'Sí' ELSE 'No' 
  END AS reservacionPagada -- Indica si la reservación fue pagada

FROM PagoDetalle pd
-- Join con las tablas principales: Hospedaje, Factura y Gasto
LEFT JOIN Hospedaje h ON pd.tipoDocumento = 'hospedaje' AND pd.documentoId = h.id
LEFT JOIN Factura f ON pd.tipoDocumento = 'factura' AND pd.documentoId = f.id
LEFT JOIN Gasto g ON pd.tipoDocumento = 'gasto' AND pd.documentoId = g.id

-- Join con la tabla de Reservaciones, para obtener el idReservacion y verificar si fue pagada
LEFT JOIN Reservacion r ON pd.tipoDocumento = 'reservacion' AND pd.documentoId = r.id

GROUP BY pd.tipoDocumento, pd.documentoId;









SELECT * FROM usuarios
SELECT * FROM apertura_caja
SELECT * FROM Cajas WHERE user_id = 4 AND estado='Apertura' AND anulado=0
SELECT * FROM Cajas 
WHERE estado COLLATE utf8mb4_unicode_ci = 'Apertura' 
AND anulado = 0 
AND user_id = 4;

SELECT * FROM Cajas WHERE estado='Apertura' AND anulado=0 AND user_id = 4
-------------------------
CREATE VIEW Cajas 
AS
SELECT ap.id AS id_apertura, ap.user_id, full_name AS usuario, ap.fecha, ap.observaciones,
ap.monto, CASE WHEN ci.id IS NOT NULL THEN 'Cierre' WHEN ar.id IS NOT NULL THEN 'Arqueo' 
ELSE 'Apertura' END AS estado,ap.anulado
FROM apertura_caja ap
LEFT JOIN arqueo_caja ar ON ap.id = ar.apertura_id
LEFT JOIN cierre_caja ci ON ar.id = ci.arqueo_id
LEFT JOIN usuarios u 	 ON ap.user_id = u.id




SELECT habitaciones.id, habitaciones.nombre, obtener_estado_habitacion(habitaciones.id,NOW()) AS estado, obtenerInfoEstado(habitaciones.id,estado,NOW()) AS numMinutos, clases_habitaciones.nombre AS clase, habitaciones.tarifa
	      FROM habitaciones	INNER JOIN clases_habitaciones ON clases_habitaciones.id = habitaciones.clase_habitacion_id
	      WHERE obtener_estado_habitacion(habitaciones.id,NOW())<>'D' AND habitaciones.anulado=0 AND habitaciones.nivel_id=1






