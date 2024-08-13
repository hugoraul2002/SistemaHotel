export interface Usuario {
    id: number;
    full_name: string;
    email: string;
    rol: Rol;
    password: string;    
  }

  export interface UserCliente {
  full_name: string;
  email: string;
    password: string;
   nombre: string;
    tipo_documento: string;
    num_documento: string;
    telefono: string;
    direccion: string;

  }

  export interface Rol {
    id: number;
    nombre: string;
  }

  export interface Nivel {
    id: number;
    nombre: string;
    anulado: boolean;
  }

  export interface ClaseHabitacion {
    id: number;
    nombre: string;
    anulado: boolean;
  }

  export interface Habitacion {
    id: number;
    nombre: string;
    precio: number;
    tarifa: number;
    estado: string;
    numeroPersonas: number;
    anulado: boolean;
    nivel: Nivel;
    claseHabitacion: ClaseHabitacion;
  }

  export interface Cliente{
    id: number;
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    telefono: string;
    direccion: string;
    activo: boolean;
    usuario: Usuario;
  }

  export interface Reservacion {
    id: number;
    habitacion: Habitacion;
    cliente: Cliente;
    usuario: Usuario;
    total: number;
    estado: string;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRegistro: Date;
    numeroAdultos: number;
    numeroNinos: number;
    observaciones: string;
    anulado: boolean;
  }

  export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    costo: number;
    precioVenta: number;
    existencia: number;
    esServicio: boolean;
    fechaIngreso: Date;
    anulado: boolean;
  }

  //INTERFACES PARA PROPS DE COMPONENTES
  export interface HabitacionDialogProps {
    editar: boolean;
    id: number;
    onHide: () => void;
    visible: boolean;
    onSave: (habitacion: Habitacion) => void;
  }
  
  export interface NivelDialogProps {
    editar: boolean;
    id: number;
    onHide: () => void;
    visible: boolean;
    onSave: (nivel: Nivel) => void;
  }

  export interface FormClaseHabitacionProps {
    editar: boolean;
    id: number;
    onHide: () => void;
    visible: boolean;
    onSave: (claseHabitacion: ClaseHabitacion) => void;
  }

  export interface UsuarioDialogProps {
    editar: boolean;
    id: number;
    onHide: () => void;
    visible: boolean;
    onSave: (usuario: Usuario) => void;
  }

  export interface ClienteDialogProps {
    editar: boolean;
    id: number;
    onHide: () => void;
    visible: boolean;
    onSave: (cliente: Cliente) => void;
  }

  export interface CalendarEvent {
    start: Date;
    end: Date;
    title: string;
    style: {
      backgroundColor: string;
    };
    reservacion: Reservacion;
  }

  export type LayoutConfig = {
    theme: string;
};