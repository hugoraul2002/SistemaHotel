export interface Usuario {
    id: number;
    full_name: string;
    email: string;
    rol: Rol;
    password: string;    
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
    estado: string;
    anulado: boolean;
    nivel: Nivel;
    claseHabitacion: ClaseHabitacion;
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


  export type LayoutConfig = {
    theme: string;
};