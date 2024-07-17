import vine from '@vinejs/vine'

export const clienteValidator = vine.compile(
  vine.object({
    user_id: vine.number().positive().nullable(),
    tipo_documento: vine.string().in(['NIT', 'CUI', 'IDE']),
    num_documento: vine.string().minLength(2),
    nombre: vine.string().minLength(3),
    telefono: vine.string().minLength(8),
    direccion: vine.string(),
  })
)
