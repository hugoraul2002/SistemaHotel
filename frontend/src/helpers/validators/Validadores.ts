import { z } from 'zod';

export const UsuarioClienteSchema = z.object({
  full_name: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico no válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  nombre: z.string().min(1, { message: 'El nombre del cliente es obligatorio' }),
  tipo_documento: z.enum(['NIT', 'CUI', 'IDE'], { message: 'Tipo de documento no válido' }),
  num_documento: z.string().min(2, { message: 'El documento es obligatorio' }),
  telefono: z.string().min(8, { message: 'El teléfono debe tener al menos 8 caracteres' }),
  direccion: z.string().min(1, { message: 'La dirección es obligatoria' }),
});

export type UsuarioCliente = z.infer<typeof UsuarioClienteSchema>;