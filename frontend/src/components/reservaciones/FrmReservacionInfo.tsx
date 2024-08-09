import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Reservacion } from '../../types/types';
import dayjs from 'dayjs';

interface ReservacionInfoDialogProps {
  visible: boolean;
  onHide: () => void;
  reservacion: Reservacion | null;
}

const mapEstadoToColor = (estado: string) => {
  switch (estado) {
    case 'creada':
      return '#575757'; 
    case 'confirmada':
      return '#56AB9E'; 
    case 'recepcionada':
      return '#1E1B72'; 
    case 'ausente':
      return '#C69853'; 
    case 'anulada':
      return '#AB1B1B'; 
    default:
      return '#E2E3E5'; 
  }
};

export const ReservacionInfoDialog: React.FC<ReservacionInfoDialogProps> = ({ visible, onHide, reservacion }) => {
  if (!reservacion) return null;

  const estadoColor = mapEstadoToColor(reservacion.estado);

  return (
    <Dialog visible={visible} style={{ width: '50vw' }} header="Información de Reservación" modal onHide={onHide}>
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="habitacion">Habitación</label>
          <InputText id="habitacion" value={reservacion.habitacion.nombre} disabled className="w-full" />
        </div>

        <div className="field">
          <label htmlFor="cliente">Cliente</label>
          <InputText id="cliente" value={reservacion.cliente.nombre} disabled className="w-full" />
        </div>

        <div className="field">
          <label htmlFor="total">Total</label>
          <InputText id="total" value={"Q. " + reservacion.habitacion.precio.toString()} disabled className="w-full" />
        </div>

        <div className="field">
          <label htmlFor="estado">Estado</label>
          <InputText id="estado" value={reservacion.estado} disabled className="w-full" style={{ color: estadoColor }} />
        </div>

        <div className="field">
          <label htmlFor="fechaInicio">Fecha y Hora de Inicio</label>
          <Calendar id="fechaInicio" value={dayjs(reservacion.fechaInicio).add(6,'hour').toDate()} showTime hourFormat="24" locale='es' disabled className="w-full" />
        </div>

        <div className="field">
          <label htmlFor="fechaFin">Fecha y Hora de Fin</label>
          <Calendar id="fechaFin" value={dayjs(reservacion.fechaFin).add(6,'hour').toDate()} showTime hourFormat="24" locale='es' disabled className="w-full" />
        </div>

        <div className="field">
          <label htmlFor="observaciones">Observaciones</label>
          <InputText id="observaciones" value={reservacion.observaciones} disabled className="w-full" />
        </div>
      </div>
    </Dialog>
  );
};
