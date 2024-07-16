import vine from '@vinejs/vine'

export const clienteValidator = vine.compile(
  vine.object({
    tipoDocumento: vine.string().in(['NIT', 'CUI', 'IDE']),
    numDocumento: vine.string(),
    nombre: vine.string().minLength(3),
    telefono: vine.string().minLength(8),
  })
)
