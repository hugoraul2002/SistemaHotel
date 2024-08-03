import vine from '@vinejs/vine'

export const rolValidator = vine.compile(
  vine.object({
    nombre: vine.string().minLength(2),
  })
)
