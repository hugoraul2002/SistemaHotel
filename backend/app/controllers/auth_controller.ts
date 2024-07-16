import { registrerValidator, loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registrerValidator)
    const user = await User.create(data)

    return User.accessTokens.create(user)
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    // const token = await User.accessTokens.create(user)
    // console.log({
    //   user: user.toJSON(),
    //   token,
    // })

    // return {
    //   user: user.toJSON(),
    //   token,
    // }
    return User.accessTokens.create(user)
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    await auth.check()
    return {
      user: auth.user,
    }
  }
}
