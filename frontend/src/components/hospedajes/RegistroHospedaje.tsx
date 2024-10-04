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



const RegistrarHospedaje: React.FC = () => {
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
  const [submmiting, setSubmmiting] = useState(false);
  const { idHabitacion } = useParams();

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
            const clientes = await ClienteService.getAll(false);
            setClientes(clientes);
            console.log('clientes',clientes);
            if (response.info.estado === 'R') {
              setEsReservada(true);
              const reservacion = await ReservacionService.getById(Number(response.info.idReservacion));
              console.log('reservacion',reservacion);
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
    if (habitacion) {
      const nuevoTotal = habitacion.precio - montoDescuento + montoPenalidad;
      setTotal(nuevoTotal < 0 ? 0 : nuevoTotal);
    }
  }, [montoDescuento, montoPenalidad, habitacion]);

  const mostrarToast = (detalle: string, tipo: "success" | "info" | "warn" | "error") => {
    toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
  };

  const handleRegister = async () => {
    setSubmmiting(true);
    if (!cliente) {
      mostrarToast('Debe seleccionar un cliente.', 'warn');
      return;
    }
    if (!fechaInicio || !fechaFin) {
      mostrarToast('Las fechas de inicio y fin son obligatorias.', 'warn');
      return;
    }
    if (fechaInicio > fechaFin) {
      mostrarToast('La fecha de inicio no puede ser posterior a la fecha de fin.', 'warn');
      return;
    }
    if (montoDescuento > total) {
      mostrarToast('El monto de descuento no puede ser mayor que el total.', 'warn');
      return;
    }

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
      setSubmmiting(false);      
    } catch (error) {
      setSubmmiting(false);
      console.error('Error registering hospedaje:', error);
    }
  };

  return (
    <div className="p-4 flex flex-col space-y-3 md:flex-wrap">
      <Toast ref={toast} />

      <Panel header="Información de la Habitación" className="w-full" toggleable>
        <div className="p-field flex gap-3 w-full">
          <div className="p-field flex flex-col w-full">
            <label htmlFor="habitacionNombre">Nombre</label>
            <InputText id="habitacionNombre" w-full value={habitacion?.nombre || ''} />
          </div>
          <div className="p-field flex flex-col w-full">
            <label htmlFor="habitacionPrecio">Precio</label>
            <InputText id="habitacionPrecio" w-full value={habitacion?.precio.toString() || ''} />
          </div>
        </div>
        <div className="p-field flex gap-3 mt-1">
          <div className="p-field flex flex-col w-full">
            <label htmlFor="habitacionTarifa">Tarifa</label>
            <InputText id="habitacionTarifa" w-full value={habitacion?.tarifa.toString() + "  Horas" || ''} />
          </div>
          <div className="p-field flex flex-col w-full">
            <label htmlFor="habitacionEstado">Estado</label>
            <InputText id="habitacionEstado" w-full value={habitacion?.estado === 'O' ? 'Ocupada' : 'Disponible' || ''} />
          </div>
        </div>
      </Panel>

      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-1 flex flex-col">
          <Panel header="Información del Cliente" className="w-full flex-1 flex flex-col" toggleable>
            <div className="p-field flex flex-col w-full">
              <label htmlFor="cliente">Cliente</label>
              <Dropdown
                filter
                id="cliente"
                value={cliente}
                options={clientes}
                optionLabel="nombre"
                placeholder="Seleccione un cliente"
                onChange={(e) => { setCliente(e.value); setNumeroDocumento(e.value.numDocumento); }}
                disabled={esReservada}
              />
            </div>

            <div className="p-field flex flex-col w-full mt-3">
              <label htmlFor="tipoDocumento">Tipo de Documento</label>
              <InputText id="tipoDocumento" value={cliente && cliente.tipoDocumento} disabled={cliente === null} />
            </div>

            <div className="p-field flex flex-col w-full mt-3">
              <label htmlFor="numeroDocumento">Número de Documento</label>
              <InputText id="numeroDocumento" value={numeroDocumento} disabled={cliente === null} />
            </div>

            <div className="p-field flex flex-col w-full mt-3">
              <label htmlFor="telefono">Teléfono</label>
              <InputText id="telefono" value={cliente && cliente.telefono} disabled={cliente === null} />
            </div>

            <div className="p-field flex flex-col w-full mt-3">
              <label htmlFor="direccion">Dirección</label>
              <InputText id="direccion" value={cliente && cliente.direccion} disabled={cliente === null} />
            </div>
          </Panel>
        </div>

        <div className="flex-1 flex flex-col">
          <Panel header="Información del Hospedaje" className="w-full flex-1 flex flex-col" toggleable>
            <div className="p-field flex flex-col flex-1">
              <label htmlFor="fechaInicio">Fecha Inicio</label>
              <Calendar
                hourFormat="24"
                dateFormat="dd/mm/yy"
                locale='es'
                id="fechaInicio"
                value={fechaInicio}
                touchUI
                onChange={(e) => { setFechaInicio(e.value); setFechaFin(dayjs(e.value).add(habitacion?.tarifa ?? 4, 'hours').toDate()) }}
                showTime
                minDate={dayjs().toDate()} 
                disabled={esReservada}
              />
            </div>
            <div className="p-field flex flex-col mt-3 flex-1">
              <label htmlFor="fechaFin">Fecha Fin</label>
              <Calendar
                hourFormat="24"
                dateFormat="dd/mm/yy"
                locale='es'
                id="fechaFin"
                value={fechaFin}
                touchUI
                onChange={(e) => setFechaFin(e.value)}
                showTime
                disabled={esReservada}
              />
            </div>

            <div className="p-field flex flex-col mt-3 flex-1">
              <label htmlFor="montoDescuento">Monto de Descuento</label>
              <InputText defaultValue={0} type='number' id="montoDescuento" value={montoDescuento.toString()} onChange={(e) => setMontoDescuento(parseFloat(e.target.value === '' || Number(e.target.value) < 0 ? '0' : e.target.value))} />
            </div>
            <div className="p-field flex flex-col mt-3 flex-1">
              <label htmlFor="montoPenalidad">Monto de Penalidad</label>
              <InputText defaultValue={0} type='number' id="montoPenalidad" value={montoPenalidad.toString()} onChange={(e) => setMontoPenalidad(parseFloat(e.target.value === '' || Number(e.target.value) < 0 ? '0' : e.target.value))} />
            </div>
            <div className="p-field flex flex-col mt-3 flex-1">
              <div className='mb-1 flex align-items-center'>
              <label htmlFor="total">Total  </label>
              <small className="ml-2 bg-slate-500 px-2 py-1 bg-opacity-50  rounded-full text-xs">Precio Q. {habitacion?.precio}</small>
              </div>
              <InputText defaultValue={0} type='number' id="total" value={total.toString()} />
            </div>
            <div className="flex flex-row justify-end space-x-2 mt-3">
              <Button label="Registrar" icon="pi pi-save" className="p-button-success" onClick={handleRegister} />
              <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => navigate(-1)} />
            </div>
          </Panel>
        </div>
      </div>



    </div>
  );
};

export default RegistrarHospedaje;