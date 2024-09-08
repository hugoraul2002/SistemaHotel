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
  export interface MetodoPago {
    metodo: string;
    monto: number;
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

  export interface HabitacionRecepcion {
    id: number;
    nombre: string;
    clase: string;
    estado: string;
    numMinutos: number;
    tarifa: number;
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

  export interface Hospedaje{
    id: number;
    cliente: Cliente;
    habitacion: Habitacion;
    reservacion?: Reservacion;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRegistro: Date;
    total: number;
    monto_descuento: number;
    monto_penalidad: number;
  }

  export interface AperturaCaja {
    id: number;
    userId: number;
    fecha: Date;
    monto: number;
    observaciones: string;
    user: Usuario;
    anulado: boolean;
    arqueoCaja?: ArqueoCaja;
  }

  export interface ArqueoCaja {
    id: number;
    aperturaId: number;
    userId: number;
    fecha: Date;
    monto: number;
    observaciones: string;
    anulado: boolean;
  }

  export interface TipoGasto{
    id: number;
    tipo: string;
    anulado: boolean;
  }

  export interface Proveedor{
    id: number;
    nit: string;
    nombre: string;
    telefono: string;
    direccion: string;
    email: string;
    anulado: boolean;
  }

  export interface Gasto{
    id: number;
    userId: number;
    tipoGastoId: number;
    proveedorId: number;
    descripcion: string;
    proveedor: Proveedor;
    tipoGasto: TipoGasto;
    fecha: Date;
    monto: number;
    anulado: boolean;
  }

  export interface OpcionPago {
    id: number;
    aperturaId: number;
    tipoDocumento: string;
    documentoId: number;
    metodo: string;
    monto: number;
    fecha: Date;
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
  export interface TipoGastoProps {
    editar: boolean;
    id: number;
    onHide: () => void;
    visible: boolean;
    onSave: (tipoGasto: TipoGasto) => void;
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
  export interface ProveedorDialogProps {
    editar: boolean;
    id: number;
    onHide: () => void;
    visible: boolean;
    onSave: (proveedor:Proveedor) => void;
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