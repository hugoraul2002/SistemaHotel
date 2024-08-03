import vine from '@vinejs/vine'

export const nivelValidator = vine.compile(
  vine.object({
    nombre: vine.string().minLength(3),
    anulado: vine.boolean().optional(),
  })
)
