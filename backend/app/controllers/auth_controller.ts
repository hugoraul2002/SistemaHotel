import { registerValidator, loginValidator, registerClienteValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Cliente from '#models/cliente'

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)

    const token = await User.accessTokens.create(user)
    return {
      token: token.value!.release(),
      user,
    }
  }

  async registerCliente({ request }: HttpContext) {
    const data = await request.validateUsing(registerClienteValidator)

    const { full_name: fullName, email, password } = data
    const {
      tipo_documento: tipoDocumento,
      num_documento: numDocumento,
      nombre,
      telefono,
      direccion,
    } = data

    const user = await User.create({ full_name: fullName, email, password, rolId: 1 })
    const clienteData = {
      user_id: user.id,
      tipoDocumento,
      numDocumento,
      nombre,
      telefono,
      direccion,
      activo: true,
    }
    await Cliente.create(clienteData)
    const token = await User.accessTokens.create(user)

    // Retorna el token y la información del usuario
    return {
      token: token.value!.release(),
      user,
    }
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    await user.load('rol')
    const token = await User.accessTokens.create(user)
    return {
      type: 'bearer',
      token: token.value!.release(),
      user,
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    await auth.check()
    await auth.user!.load('rol')
    return {
      user: auth.user!,
    }
  }
}
