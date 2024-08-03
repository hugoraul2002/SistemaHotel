import type { HttpContext } from '@adonisjs/core/http'
import Rol from '#models/rol'
import { rolValidator } from '#validators/rol'

export default class RolsController {
  async index({ response }: HttpContext) {
    const roles = await Rol.all()
    return response.json(roles)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(rolValidator)
    const rol = await Rol.create(data)
    return response.status(201).json(rol)
  }

  async show({ params, response }: HttpContext) {
    const rol = await Rol.query()
      .where('id', params.id)
      .preload('users')
      .preload('modulos')
      .firstOrFail()
    return response.json(rol)
  }

  async update({ params, request, response }: HttpContext) {
    const rol = await Rol.findOrFail(params.id)
    const data = request.only(['nombre'])
    rol.merge(data)
    await rol.save()
    return response.json(rol)
  }

  async destroy({ params, response }: HttpContext) {
    const rol = await Rol.findOrFail(params.id)
    await rol.delete()
    return response.status(204).json(null)
  }
}
