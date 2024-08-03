import type { HttpContext } from '@adonisjs/core/http'
import Nivel from '#models/nivel'
import { nivelValidator } from '#validators/nivel'
export default class NivelesController {
  async index({ response }: HttpContext) {
    const niveles = await Nivel.query().where('anulado', false)
    return response.status(200).json(niveles)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(nivelValidator)
    const nivel = await Nivel.create(data)
    return response.status(201).json(nivel)
  }

  async show({ params, response }: HttpContext) {
    const nivel = await Nivel.query().where('id', params.id).where('anulado', false).firstOrFail()
    return response.status(200).json(nivel)
  }

  async update({ params, request, response }: HttpContext) {
    const nivel = await Nivel.findOrFail(params.id)
    const data = await request.validateUsing(nivelValidator)
    nivel.merge(data)
    await nivel.save()
    return response.status(200).json(nivel)
  }

  async updateAnulado({ params, request, response }: HttpContext) {
    const nivel = await Nivel.findOrFail(params.id)
    nivel.anulado = request.input('anulado')
    await nivel.save()
    return response.status(200).json(nivel)
  }

  async destroy({ params, response }: HttpContext) {
    const nivel = await Nivel.findOrFail(params.id)
    nivel.anulado = true
    await nivel.save()
    return response.status(204).json(null)
  }
}
