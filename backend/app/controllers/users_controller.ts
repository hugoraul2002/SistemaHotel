import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
export default class UsersController {
  async index() {
    const users = await User.query().where('anulado', false)
    return users
  }

  async store({ request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    return user
  }

  async show({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return user
  }

  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['full_name', 'email', 'password', 'rolId'])
    user.merge(data)
    await user.save()
    return user
  }

  async updateAnulado({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['anulado'])
    user.merge(data)
    await user.save()
    return user
  }

  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return { message: 'User deleted successfully' }
  }
}
