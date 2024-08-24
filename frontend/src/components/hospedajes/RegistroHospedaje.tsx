import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Cliente, Habitacion, Reservacion } from '../../types/types';
import { HabitacionService } from '../../services/HabitacionService';
import { ReservacionService } from '../../services/ReservacionService';
import { ClienteService } from '../../services/ClienteService';
import { HospedajeService } from '../../services/HospedajeService';
import dayjs from 'dayjs';
import { Dropdown } from 'primereact/dropdown';
import { addLocale } from 'primereact/api';
import { Toast } from 'primereact/toast';

interface RegistrarHospedajeProps {
  idReserva?: number;
}

const RegistrarHospedaje: React.FC<RegistrarHospedajeProps> = () => {
  const toast = useRef<Toast>(null);
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fechaInicio, setFechaInicio] = useState<Nullable<Date>>(null);
  const [fechaFin, setFechaFin] = useState<Nullable<Date>>(null);
  const [total, setTotal] = useState<number>(0);
  const [montoDescuento, setMontoDescuento] = useState<number>(0);
  const [montoPenalidad, setMontoPenalidad] = useState<number>(0);
  const [esReservada, setEsReservada] = useState(false);
  const [reservacion, setReservacion] = useState<Reservacion | null>(null);
  const [numeroDocumento, setNumeroDocumento] = useState<string>('');
  const navigate = useNavigate();
  const { idHabitacion } = useParams();
  const [status, setStatus] = useState('');

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
    if (idHabitacion) {
      const fetchHabitacion = async () => {
        try {
          const response = await HabitacionService.getReservacionProxima(Number(idHabitacion));
          if (response) {
            setHabitacion(response.habitacion);
            setStatus(response.info.estado);
            const clientes = await ClienteService.getAll();
            setClientes(clientes);

            if (response.info.estado === 'R') {
              setEsReservada(true);
              const reservacion = await ReservacionService.getById(Number(response.info.idReservacion));
              setReservacion(reservacion);
              setNumeroDocumento(reservacion.cliente.numDocumento);
              setFechaInicio(dayjs(reservacion.fechaInicio).add(6, 'hours').toDate());
              setFechaFin(dayjs(reservacion.fechaFin).add(6, 'hours').toDate());
              setCliente(reservacion.cliente);
              setTotal(reservacion.total);
            } else {
              setTotal(response.habitacion.precio);
            }
          }
        } catch (error) {
          console.error('Error fetching habitacion:', error);
        }
      };

      fetchHabitacion();
    }
  }, [idHabitacion]);

  useEffect(() => {
    // Calcula el total cada vez que cambian montoDescuento, montoPenalidad o habitacion
    if (habitacion) {
      const nuevoTotal = habitacion.precio - montoDescuento + montoPenalidad;
      setTotal(nuevoTotal);
    }
  }, [montoDescuento, montoPenalidad, habitacion]);

  const mostrarToast = (detalle: string, tipo: "success" | "info" | "warn" | "error") => {
    toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
  };

  const handleRegister = async () => {
    try {
      const newHospedaje = {
        id: 0,
        reservacion: reservacion || undefined,
        cliente: cliente!,
        habitacion: habitacion!,
        fechaInicio: fechaInicio!,
        fechaFin: fechaFin!,
        fechaRegistro: new Date(),
        total: total,
        monto_descuento: montoDescuento,
        monto_penalidad: montoPenalidad,
      };

      const response = await HospedajeService.create(newHospedaje);
      if (response) {
        mostrarToast('Hospedaje registrado', 'success');
        setTimeout(() => {
          navigate('/checkin');
        }, 1000);
      }
    } catch (error) {
      console.error('Error registering hospedaje:', error);
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Panel header="Información de la Habitación" className="mb-3">
        {habitacion && (
          <div>
            <h4>{habitacion.nombre}</h4>
            <p>Precio: {habitacion.precio}</p>
            <p>Tarifa: {habitacion.tarifa} h</p>
            <p>Estado: {habitacion.estado === 'O' ? 'Ocupada' : 'Disponible'}</p>
          </div>
        )}
      </Panel>

      <div className="grid">
        <div className="col-6">
          <Panel header="Información del Cliente" className="mb-3">
            {reservacion ? (
              <div>
                <h4>{cliente!.nombre}</h4>
                <p>Tipo de Documento: {cliente!.tipoDocumento}</p>
                <p>Número de Documento: {numeroDocumento}</p>
                <p>Teléfono: {cliente!.telefono}</p>
                <p>Dirección: {cliente!.direccion}</p>
              </div>
            ) : (
              <div className="field">
                <label htmlFor="cliente" className="mr-3">Cliente</label>
                <Dropdown
                  filter
                  id="cliente"
                  value={cliente}
                  options={clientes}
                  optionLabel="nombre"
                  placeholder="Seleccione un cliente"
                  onChange={(e) => { setCliente(e.value); setNumeroDocumento(e.value.numDocumento) }}
                />
                {cliente && <div>
                  <p>Tipo de Documento: {cliente!.tipoDocumento}</p>
                  <p>Número de Documento: {numeroDocumento}</p>
                  <p>Teléfono: {cliente!.telefono}</p>
                  <p>Dirección: {cliente!.direccion}</p>
                </div>}
              </div>
            )}
          </Panel>
        </div>

        <div className="col-6">
          <Panel header="Información del Hospedaje" className="mb-3">
            <div className="p-field mt-3">
              <label htmlFor="fechaInicio" className="mr-3">Fecha Inicio</label>
              <Calendar
                hourFormat="24" dateFormat="dd/mm/yy" locale='es'
                id="fechaInicio"
                value={fechaInicio} touchUI
                onChange={(e) => { setFechaInicio(e.value); setFechaFin(dayjs(e.value).add(habitacion?.tarifa ?? 4, 'hours').toDate()); }}
                showTime
                disabled={esReservada}
                minDate={dayjs().toDate()}
              />
            </div>
            <div className="p-field mt-3">
              <label htmlFor="fechaFin" className="mr-3">Fecha Fin</label>
              <Calendar hourFormat="24" dateFormat="dd/mm/yy" locale='es' id="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.value)} showTime disabled />
            </div>
            <div className="p-field mt-3">
              <label htmlFor="montoPenalidad" className="mr-3">Monto Penalidad</label>
              <InputText type="number" id="montoPenalidad" value={montoPenalidad} onChange={(e) => setMontoPenalidad(Number(e.target.value))} />
            </div>
            <div className="p-field mt-3">
              <label htmlFor="montoDescuento" className="mr-3">Monto Descuento</label>
              <InputText type="number" id="montoDescuento" value={montoDescuento} onChange={(e) => setMontoDescuento(Number(e.target.value))} />
            </div>
            <div className="p-field mt-3">
              <h4>Total: Q. {total}</h4>
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="text-center">
        <Button label="Registrar" icon="pi pi-check" className="p-button-success" onClick={handleRegister} />
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => navigate('/checkin')} />
      </Panel>
    </div>
  );
}

export default RegistrarHospedaje;
