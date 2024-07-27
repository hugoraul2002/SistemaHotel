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