import vine from '@vinejs/vine'

export const clienteValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    tipoDocumento: vine.string().in(['NIT', 'CUI', 'IDE']),
    numDocumento: vine.string(),
    nombre: vine.string().minLength(3),
    telefono: vine.string().minLength(8),
    direccion: vine.string(),
    activo: vine.boolean(),
  })
)
