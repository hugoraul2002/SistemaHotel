import type { HttpContext } from '@adonisjs/core/http'
import ClaseHabitacion from '#models/clase_habitacion'
import { claseHabitacionValidator } from '#validators/clase_habitacion'
export default class ClaseHabitacionsController {
  async index({ response }: HttpContext) {
    const claseHabitacions = await ClaseHabitacion.query().where('anulado', false)
    return response.status(200).json(claseHabitacions)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(claseHabitacionValidator)
    const claseHabitacion = await ClaseHabitacion.create(data)
    return response.status(201).json(claseHabitacion)
  }

  async show({ params, response }: HttpContext) {
    const claseHabitacion = await ClaseHabitacion.query()
      .where('id', params.id)
      .where('anulado', false)
      .firstOrFail()
    return response.status(200).json(claseHabitacion)
  }

  async update({ params, request, response }: HttpContext) {
    const claseHabitacion = await ClaseHabitacion.findOrFail(params.id)
    const data = await request.validateUsing(claseHabitacionValidator)
    claseHabitacion.merge(data)
    await claseHabitacion.save()
    return response.status(200).json(claseHabitacion)
  }

  async updateAnulado({ params, request, response }: HttpContext) {
    const claseHabitacion = await ClaseHabitacion.findOrFail(params.id)
    claseHabitacion.anulado = request.input('anulado')
    await claseHabitacion.save()
    return response.status(200).json(claseHabitacion)
  }

  async destroy({ params, response }: HttpContext) {
    const claseHabitacion = await ClaseHabitacion.findOrFail(params.id)
    claseHabitacion.anulado = true
    await claseHabitacion.save()
    return response.status(204).json(null)
  }
}
