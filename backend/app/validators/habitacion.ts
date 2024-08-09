import vine from '@vinejs/vine'

export const habitacionValidator = vine.compile(
  vine.object({
    nombre: vine.string().minLength(2),
    nivelId: vine.number().positive(),
    claseHabitacionId: vine.number().positive(),
    precio: vine.number().positive(),
    tarifa: vine.number().positive(),
    estado: vine.string().minLength(1),
    anulado: vine.boolean(),
  })
)
