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
import { ReservacionService } from '../../services/ReservacionService';
import { InputSwitch } from 'primereact/inputswitch';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface ReservacionDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (data: Reservacion, editar: boolean) => void;
  onDelete: (id: number) => void;
  habitaciones: Habitacion[];
  clientes: Cliente[];
  mostrarToast: (detalle: string, tipo: "success" | "info" | "warn" | "error") => void;
  idReservacion?: number; // ID de la reservación para editar
}

export const ReservacionDialog: React.FC<ReservacionDialogProps> = ({ visible, onHide, onSave, onDelete, habitaciones, clientes, mostrarToast, idReservacion }) => {
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
  const [estado, setEstado] = useState<string>('creada');
  const [anulado, setAnulado] = useState<boolean>(false);

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

  useEffect(() => {
    if (idReservacion) {
      ReservacionService.getById(idReservacion).then((data) => {
        console.log(data);
        const habitacion = habitaciones.find((h) => h.id === data.habitacion.id);
        const cliente = clientes.find((c) => c.id === data.cliente.id);
        setAnulado(data.anulado ==1 ? true : false);
        setSelectedHabitacion(habitacion!);
        setSelectedClient(cliente!);
        setFechaInicio(dayjs(data.fechaInicio).add(6, 'hours').toDate());
        setFechaFin(dayjs(data.fechaFin).add(6, 'hours').toDate());
        setTotal(data.total);
        setEstado(data.estado);
        setObservaciones(data.observaciones || '');
        setNumeroAdultos(data.numeroAdultos);
        setNumeroNinos(data.numeroNinos);
      }).catch(() => {
        mostrarToast('Error al cargar la reservación', 'error');
      });
    } else {
      resetForm();
    }
  }, [idReservacion, visible]);

  const resetForm = () => {
    setSelectedHabitacion(null);
    setSelectedClient(null);
    setAnulado(false);
    setFechaInicio(null);
    setFechaFin(null);
    setObservaciones('');
    setEstado('creada');
    setNumeroAdultos(1);
    setNumeroNinos(0);
    setTotal(0);
  };

  const handleSave = () => {
    if (!selectedHabitacion || !selectedClient || fechaInicio == null || fechaFin == null || !total || numeroAdultos < 1) {
      mostrarToast('Todos los campos son obligatorios', 'warn');
      return;
    }

    const nuevaReservacion: Reservacion = {
      id: idReservacion || 0,
      habitacion: selectedHabitacion,
      cliente: selectedClient,
      usuario: {} as Usuario,
      total: total,
      estado: estado,
      fechaInicio,
      fechaFin,
      fechaRegistro: new Date(),
      numeroAdultos,
      numeroNinos,
      observaciones,
      anulado: false,
    };

    onSave(nuevaReservacion, idReservacion ? true : false);
  };

  const confirmarAnulacion = (id: number) => {
    confirmDialog({
      message: '¿Estás seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => onDelete(id),
      reject: () => mostrarToast('Se canceló la anulación.', 'info'),
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-info',
      rejectClassName: 'p-button-danger'
    });
  };
  return (
    <Sidebar visible={visible} position="right" header={idReservacion ? "Editar Reservación" : "Nueva Reservación"} modal onHide={onHide}>
      <ConfirmDialog />
      <div className="p-fluid">
        {/* Campos del formulario */}
        {idReservacion && (<div className="field flex justify-end">
          <div>
            <label htmlFor="anulado">{anulado ? 'Anulado' : 'Anular'}</label>
          </div>
          <div className="ml-2">
            <InputSwitch checked={anulado} disabled={anulado || estado !== 'creada'} onChange={(e) => {if (e.value === true) confirmarAnulacion(idReservacion!); }} />
          </div>
        </div>)}
        <div className="field">
          <label htmlFor="habitacion">Habitación</label>
          <Dropdown
            disabled={anulado}
            filter
            id="habitacion"
            value={selectedHabitacion}
            options={habitaciones}
            onChange={(e) => { setSelectedHabitacion(e.value); setTotal(e.value.precio); }}
            optionLabel="nombre"
            placeholder="Seleccione una habitación"
          />
          {selectedHabitacion && (
            <div className="field">
              <label htmlFor="precio">Tarifa - Total</label>
              <div className="flex">
                <InputText id="tarifa" value={selectedHabitacion.tarifa.toString() + " h"} disabled />
                <InputText disabled={anulado} id="precio" type='number' value={total.toString()} onChange={(e) => setTotal(parseFloat(e.target.value))} />
              </div>
            </div>
          )}
        </div>
        {selectedHabitacion && (
          <div className="field flex items-center">
            <div className="p-field">
              <label htmlFor="capacidad">Capacidad</label>
              <InputText id="capacidad" value={selectedHabitacion.numeroPersonas.toString()} disabled />
            </div>
            <div className="p-field">
              <label htmlFor="adultos">Adultos</label>
              <Dropdown
                disabled={anulado}
                id="adultos"
                value={numeroAdultos}
                options={adultosOptions}
                onChange={(e) => setNumeroAdultos(e.value)}
              />
            </div>
            <div className="p-field">
              <label htmlFor="ninos">Niños</label>
              <Dropdown
                disabled={anulado}
                id="ninos"
                value={numeroNinos}
                options={ninosOptions}
                onChange={(e) => setNumeroNinos(e.value)}
              />
            </div>
          </div>
        )}
        <div className="field">
          <label htmlFor="cliente">Cliente</label>
          <Dropdown
            disabled={anulado}
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
          <Calendar disabled={anulado} showIcon id="fechaInicio" value={fechaInicio} onChange={(e) => { setFechaInicio(e.value); setFechaFin(dayjs(e.value).add(selectedHabitacion?.tarifa ?? 4, 'hours').toDate()); }} showTime hourFormat="24" dateFormat="dd/mm/yy" locale='es' placeholder="Seleccione fecha y hora de inicio" minDate={dayjs().toDate()} maxDate={dayjs().add(31, 'days').toDate()} touchUI />
          {!fechaInicio && <small className="p-error">Seleccione una fecha</small>}
        </div>

        <div className="field">
          <label htmlFor="fechaFin">Fecha y Hora de Fin</label>
          <Calendar disabled={anulado} showIcon id="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.value)} showTime hourFormat="24" locale='es' dateFormat="dd/mm/yy" minDate={dayjs(fechaInicio).add(selectedHabitacion?.tarifa ?? 4, 'hours').toDate()} touchUI />
        </div>

        <div className="field">
          <label htmlFor="observaciones">Observaciones</label>
          <InputText disabled={anulado} id="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Opcional" />
        </div>

        <div className="flex justify-content-end mt-2">
          <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
          <Button disabled={anulado} label={idReservacion ? "Actualizar" : "Guardar"} icon="pi pi-check" onClick={handleSave} />
        </div>
      </div>
    </Sidebar>
  );
};
