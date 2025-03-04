import { z } from 'zod';
export const UsuarioClienteSchema = z.object({
  full_name: z.string().min(3, { message: 'Debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico no válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }).max(20, { message: 'La contraseña debe tener menos de 20 caracteres' }),
  nombre: z.string().min(1, { message: 'El nombre del cliente es obligatorio' }),
  // tipo_documento: z.enum(['NIT', 'CUI', 'IDE'], { message: 'Tipo de documento no válido' }),
  num_documento: z.string().min(2, { message: 'El documento es obligatorio' }),
  telefono: z.string().min(8, { message: 'El teléfono debe tener al menos 8 caracteres' }),
  direccion: z.string().min(1, { message: 'La dirección es obligatoria' }),
});

export const ClienteSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre del cliente es obligatorio' }),
  num_documento: z.string().min(2, { message: 'El documento es obligatorio' }),
  telefono: z.string().min(8, { message: 'El teléfono debe tener al menos 8 caracteres' }),
  direccion: z.string().min(1, { message: 'La dirección es obligatoria' }),
  nacionalidad: z.string().min(1, { message: 'La nacionalidad es obligatoria' }),
  email: z.string().email({ message: 'Correo electrónico no válido' }),
});

export const ProveedorSchema = z.object({
  nit: z.string().min(2, { message: 'El nit es obligatorio' }),
  nombre: z.string().min(1, { message: 'El nombre del proveedor es obligatorio' }),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  email: z.string({ message: 'Correo electrónico no válido' }).optional(),
})

export const Rol = z.object({
  id: z.number().positive(),
  nombre: z.string(),
});

export const UsuarioSchema = z.object({
  full_name: z.string().min(3, { message: 'Debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico no válido' }),
  password: z.string().optional(),
  rol: Rol.refine((rol) => rol.nombre!='', { message: 'El rol es obligatorio y debe ser válido' }),
});

export const UserSchema = z.object({
  full_name: z.string().min(3, { message: 'Debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico no válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }).optional(),
  editar: z.boolean(),
  rol: z.object({
    id: z.number(),
    nombre: z.string().min(1, { message: 'El rol es obligatorio y debe ser válido' })
  }),
}).refine(data => data.password || !data.editar, {
  message: 'La contraseña es obligatoria',
  path: ['password'], 
});

export const NivelSchema = z.object({
  nombre: z.string().min(1,{message:"El nombre no puede ser vacío."})
});
export const ClaseHabitacionSchema = z.object({
  nombre: z.string().min(1,{message:"El nombre no puede ser vacío."})
});

export const HabitacionSchema = z.object({
  nombre: z.string().min(1,{message:"El nombre no puede ser vacío."}),
  precio: z.number().positive({message:"El precio debe ser mayor a 0."}),
  tarifa: z.number().positive({message:"La tarifa debe ser mayor a 0."}),
  numeroPersonas: z.number().positive({message:"El número de personas debe ser mayor a 0."}),
});

export const ReservacionSchema = z.object({
  fechaInicio: z.date(),
  fechaFin: z.date(),
  precio: z.number().positive({ message: 'El precio debe ser mayor a 0' }),
  estado: z.string().min(1, { message: 'El estado es obligatorio' }),
  numeroAdultos: z.number().positive({ message: 'El número de adultos debe ser mayor a 0' }),
  numeroNinos: z.number().positive({ message: 'El número de adultos debe ser mayor a 0' }),
  observaciones: z.string().optional(),
  anulado: z.boolean(),
});

export const ProductoSchema = z.object({
  codigo: z.string().min(1, { message: 'El código es obligatorio' }),
  nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
  costo: z.number().positive({ message: 'El costo debe ser mayor a 0' }),
  precioVenta: z.number().positive({ message: 'El precio de venta debe ser mayor a 0' }),
  existencia: z.number().positive({ message: 'La existencia debe ser mayor a 0' }),
  esServicio: z.boolean(),
});

export const TipoGastoSchema = z.object({
  tipo: z.string().min(1,{message:"El tipo de gasto no puede ser vacío."})
});

export type UsuarioCliente = z.infer<typeof UsuarioClienteSchema>;
export type UsuarioValidador = z.infer<typeof UsuarioSchema>;
export type UserValidator = z.infer<typeof UserSchema>;
export type HabitacionValidador = z.infer<typeof HabitacionSchema>;
export type ClienteValidador = z.infer<typeof ClienteSchema>;
export type NivelValidador = z.infer<typeof NivelSchema>;
export type ClaseHabitacionValidador = z.infer<typeof NivelSchema>;
export type ReservacionValidador = z.infer<typeof ReservacionSchema>;
export type ProductoValidador = z.infer<typeof ProductoSchema>;
export type TipoGastoValidador = z.infer<typeof TipoGastoSchema>;
export type ProveedorValidador = z.infer<typeof ProveedorSchema>;