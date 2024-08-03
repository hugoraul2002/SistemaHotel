import vine from '@vinejs/vine'

export const reservacionValidator = vine.compile(
  vine.object({
    habitacionId: vine.number(),
    clienteId: vine.number(),
    userId: vine.number(),
    total: vine.number(),
    estado: vine.string().minLength(3),
    fechaInicio: vine.date(),
    fechaFin: vine.date(),
    fechaRegistro: vine.date(),
    observaciones: vine.string().minLength(3),
    anulado: vine.boolean(),
  })
)
