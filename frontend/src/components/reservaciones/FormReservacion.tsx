import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Reservacion, Habitacion, Cliente } from '../../types/types';
import { addLocale } from 'primereact/api';
import { Nullable } from 'primereact/ts-helpers';
import { Usuario } from '../../types/types';
import { Sidebar } from 'primereact/sidebar';
import dayjs from 'dayjs';

interface ReservacionDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (data: Reservacion) => void;
  habitaciones: Habitacion[];
  clientes: Cliente[];
  mostrarToast: (detalle: string, tipo: "success" | "info" | "warn" | "error") => void;
}

export const ReservacionDialog: React.FC<ReservacionDialogProps> = ({ visible, onHide, onSave, habitaciones, clientes, mostrarToast }) => {
  const [selectedHabitacion, setSelectedHabitacion] = useState<Habitacion | null>(null);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Nullable<Date>>(null);
  const [fechaFin, setFechaFin] = useState<Nullable<Date>>(null);
  const [total, setTotal] = useState<number>(0);
  const [observaciones, setObservaciones] = useState<string>('');
  const [numeroAdultos, setNumeroAdultos] = useState<number>(1);
  const [numeroNinos, setNumeroNinos] = useState<number>(0);
  const [adultosOptions, setAdultosOptions] = useState<number[]>([]);
  const [ninosOptions, setNinosOptions] = useState<number[]>([]);

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  useEffect(() => {
    if (selectedHabitacion) {
      const maxPersonas = selectedHabitacion.numeroPersonas;
      setAdultosOptions(Array.from({ length: maxPersonas }, (_, i) => i + 1));
      setNumeroAdultos(1);
      setNumeroNinos(0);
    }
  }, [selectedHabitacion]);

  useEffect(() => {
    if (selectedHabitacion) {
      const maxPersonas = selectedHabitacion.numeroPersonas;
      setNinosOptions(Array.from({ length: maxPersonas - numeroAdultos + 1 }, (_, i) => i));
      setNumeroNinos(0);
    }
  }, [numeroAdultos, selectedHabitacion]);

  const handleSave = () => {
    if (!selectedHabitacion || !selectedClient || fechaInicio == null || fechaFin == null || !total || numeroAdultos < 1) {
      mostrarToast('Todos los campos son obligatorios', 'warn');
      return;
    }

    const nuevaReservacion: Reservacion = {
      id: 0,
      habitacion: selectedHabitacion,
      cliente: selectedClient,
      usuario: {} as Usuario,
      total: total,
      estado: 'creada',
      fechaInicio,
      fechaFin,
      fechaRegistro: new Date(),
      numeroAdultos,
      numeroNinos,
      observaciones,
      anulado: false,
    };

    onSave(nuevaReservacion);
  };

  useEffect(() => {
    if (visible) {
      setSelectedHabitacion(null);
      setSelectedClient(null);
      setFechaInicio(null);
      setFechaFin(null);
      setObservaciones('');
      setNumeroAdultos(1);
      setNumeroNinos(0);
    }
  }, [visible]);

  return (
    <Sidebar visible={visible} position="right" header="Nueva Reservación" modal onHide={onHide}>
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="habitacion">Habitación</label>
          <Dropdown
            filter
            id="habitacion"
            value={selectedHabitacion}
            options={habitaciones}
            onChange={(e) => { setSelectedHabitacion(e.value); setTotal(e.value.precio) }}
            optionLabel="nombre"
            placeholder="Seleccione una habitación"
          />
          {selectedHabitacion && (
            <div className="field">
              <label htmlFor="precio">Tarifa - Total</label>
              <div className="flex">
                <InputText id="tarifa" value={selectedHabitacion.tarifa.toString() + " h"} disabled />
                <InputText id="precio" type='number' value={total.toString()} onChange={(e) => setTotal(parseFloat(e.target.value))} />
              </div>
            </div>
          )}
        </div>
        {selectedHabitacion && (
          <div className="field flex align-items-center">
            <div className="p-field">
              <label htmlFor="capacidad">Capacidad</label>
              <InputText id="capacidad" value={selectedHabitacion.numeroPersonas.toString()} disabled />
            </div>
            <div className="p-field">
              <label htmlFor="adultos">Adultos</label>
              <Dropdown
                id="adultos"
                value={numeroAdultos}
                options={adultosOptions}
                onChange={(e) => setNumeroAdultos(e.value)}
              // placeholder="Número de adultos"
              />
            </div>
            <div className="p-field">
              <label htmlFor="ninos">Niños</label>
              <Dropdown
                id="ninos"
                value={numeroNinos}
                options={ninosOptions}
                onChange={(e) => setNumeroNinos(e.value)}
              // placeholder="Número de niños"
              />
            </div>
          </div>
        )}
        <div className="field">
          <label htmlFor="cliente">Cliente</label>
          <Dropdown
            filter
            id="cliente"
            value={selectedClient}
            options={clientes}
            optionLabel="nombre"
            placeholder="Seleccione un cliente"
            onChange={(e) => setSelectedClient(e.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="fechaInicio">Fecha y Hora de Inicio</label>
          <Calendar showIcon id="fechaInicio" value={fechaInicio} onChange={(e) => { setFechaInicio(e.value); setFechaFin(dayjs(e.value).add(selectedHabitacion?.tarifa ?? 4, 'hours').toDate()) }} showTime hourFormat="24" dateFormat="dd/mm/yy" locale='es' placeholder="Seleccione fecha y hora de inicio" minDate={dayjs().toDate()} maxDate={dayjs().add(31, 'days').toDate()} touchUI />
          {!fechaInicio && <small className="p-error">Seleccione una fecha</small>}
        </div>

        <div className="field">
          <label htmlFor="fechaFin">Fecha y Hora de Fin</label>
          <Calendar showIcon id="fechaFin" value={fechaFin} onChange={(e) => { setFechaFin(e.value) }} showTime hourFormat="24" locale='es' dateFormat="dd/mm/yy" minDate={dayjs(fechaInicio).add(selectedHabitacion?.tarifa ?? 4, 'hours').toDate() ?? dayjs().toDate()} maxDate={dayjs().add(31, 'days').toDate()} touchUI />
          {!fechaFin && <small className="p-error">Seleccione una fecha</small>}
        </div>

        <div className="field">
          <label htmlFor="observaciones">Observaciones</label>
          <InputText
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Escriba observaciones"
          />
        </div>

        <div className="flex justify-content-end pt-4">
          <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
          <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
        </div>
      </div>
    </Sidebar>
  );
};
