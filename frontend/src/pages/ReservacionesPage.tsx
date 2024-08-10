import { useState, useEffect, useRef } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { ReservacionService } from '../services/ReservacionService';
import { HabitacionService } from '../services/HabitacionService';
import { ClienteService } from '../services/ClienteService';
import { Reservacion } from '../types/types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ReservacionDialog } from '../components/reservaciones/FormReservacion'; 
import { ReservacionInfoDialog } from '../components/reservaciones/FrmReservacionInfo'; 
import { CalendarEvent } from '../types/types';
import { AxiosError } from 'axios';
dayjs.locale('es');
const localizer = dayjsLocalizer(dayjs);

const ReservacionesPage = () => {
  const toast = useRef<Toast>(null);
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [selectedReservacion, setSelectedReservacion] = useState<Reservacion | null>(null);
  const [habitaciones, setHabitaciones] = useState([]);
  const [clientes, setClientes] = useState([]);

  const fetchReservaciones = async () => {
    try {
      const data = await ReservacionService.getAll();
      setReservaciones(data);
    } catch (error) {
      console.error('Error fetching reservaciones:', error);
    }
  };

  const fetchHabitaciones = async () => {
    try {
      const data = await HabitacionService.getAll();
      setHabitaciones(data);
    } catch (error) {
      console.error('Error fetching habitaciones:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const data = await ClienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  useEffect(() => {
    fetchReservaciones();
    fetchHabitaciones();
    fetchClientes();
  }, []);

  useEffect(() => {
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
    
    const mappedEvents = reservaciones.map((reservacion) => ({      
      start: dayjs(reservacion.fechaInicio).add(6,'hour').toDate(),
      end: dayjs(reservacion.fechaFin).add(6,'hour').toDate(),
      title: dayjs(reservacion.fechaInicio).add(6,'hour').format('HH:mm') + "  " + reservacion.habitacion.nombre + " "  + reservacion.habitacion.claseHabitacion.nombre + "  " + reservacion.cliente.nombre,
      style: {
        fontSize: '0.6rem',
        backgroundColor: mapEstadoToColor(reservacion.estado),
      },
      reservacion
    }));
    setEvents(mappedEvents);
  }, [reservaciones]);

  const mostrarToast = (detalle: string, tipo: "success" | "info" | "warn" | "error") => {
    toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
  };

  const handleCreateReservacion = async (data: Reservacion) => {
    try {
      await ReservacionService.create(data);
      mostrarToast('Reservación creada', 'success');
      fetchReservaciones();
      setDialogVisible(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 409) {
        mostrarToast('Ya existe una reservación en esas fechas, intentelo nuevamente.', 'warn');
      } else {
        mostrarToast('Error creando reservación', 'error');
        }
    }
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedReservacion(event.reservacion);
    console.log(event.reservacion);
    setInfoDialogVisible(true);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: event.style,
    };
  };

  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Sin eventos',
    showMore: (total: number) => `+${total} más`,
  };

  const colorLegend = [
    { color: '#575757', label: 'Creada' },
    { color: '#56AB9E', label: 'Confirmada' },
    { color: '#1E1B72', label: 'Recepcionada' },
    { color: '#C69853', label: 'Ausente' },
    { color: '#AB1B1B', label: 'Anulada' }
  ];

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Toast ref={toast} position="top-left"/>
      <div className="flex flex-wrap space-x-4">
        <Button size='small' label="Nueva" severity='info' icon="pi pi-plus" onClick={() => setDialogVisible(true)} />
        {colorLegend.map((legend) => (
          <div key={legend.label} className="flex items-center space-x-2">
            <div style={{ backgroundColor: legend.color }} className="w-4 h-4 rounded-full"></div>
            <span>{legend.label}</span>
          </div>
        ))}
      </div>
      <div className="w-full md:w-3/4 lg:w-2/3" style={{ height: '100vh', width:'90vw' }}>
        <Calendar
        
          events={events}
          startAccessor="start"
          endAccessor="end"
          localizer={localizer}
          messages={messages}
          eventPropGetter={eventStyleGetter}
          className="bg-white shadow rounded-lg p-4"
          onSelectEvent={handleEventSelect}
        />
      </div>
      <ReservacionDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSave={handleCreateReservacion}
        habitaciones={habitaciones}
        clientes={clientes}
        mostrarToast={mostrarToast}
      />
      <ReservacionInfoDialog
        visible={infoDialogVisible}
        onHide={() => setInfoDialogVisible(false)}
        reservacion={selectedReservacion}
      />
    </div>
  );
};

export default ReservacionesPage;
