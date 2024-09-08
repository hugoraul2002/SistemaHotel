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
