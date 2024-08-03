import vine from '@vinejs/vine'

const password = vine.string().minLength(6).maxLength(20)

export const registerValidator = vine.compile(
  vine.object({
    full_name: vine.string(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('usuarios').select('id').where('email', value).first()
        return !user
      }),
    password,
    rol_id: vine.number().positive(),
  })
)

export const registerClienteValidator = vine.compile(
  vine.object({
    full_name: vine.string(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('usuarios').select('id').where('email', value).first()
        return !user
      }),
    password,
    // user_id: vine.number().positive().nullable(),
    tipo_documento: vine.string().in(['NIT', 'CUI', 'IDE']),
    num_documento: vine.string().minLength(2),
    nombre: vine.string().minLength(3),
    telefono: vine.string().minLength(8),
    direccion: vine.string(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password,
  })
)
