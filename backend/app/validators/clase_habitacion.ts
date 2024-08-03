import vine from '@vinejs/vine'

export const claseHabitacionValidator = vine.compile(
  vine.object({
    nombre: vine.string().minLength(2),
    anulado: vine.boolean().optional(),
  })
)
