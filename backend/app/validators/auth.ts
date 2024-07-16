import vine from '@vinejs/vine'

const password = vine.string().minLength(8)

export const registrerValidator = vine.compile(
  vine.object({
    full_name: vine.string(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').select('id').where('email', value).first()
        return !user
      }), // Add a comma here
    password,
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password,
  })
)
