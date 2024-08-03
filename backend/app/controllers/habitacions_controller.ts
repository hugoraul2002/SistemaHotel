import type { HttpContext } from '@adonisjs/core/http'
import Habitacion from '#models/habitacion'

export default class HabitacionController {
  async index({ response }: HttpContext) {
    try {
      const habitaciones = await Habitacion.query()
        .where('anulado', false)
        .preload('nivel')
        .preload('claseHabitacion')
        .preload('reservaciones')
      response.status(200).json(habitaciones)
    } catch (error) {
      response.status(500).json({ message: 'Error fetching habitaciones', error })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'nombre',
        'nivelId',
        'claseHabitacionId',
        'precio',
        'estado',
        'anulado',
      ])
      const habitacion = await Habitacion.create(data)
      response.status(201).json(habitacion)
    } catch (error) {
      response.status(500).json({ message: 'Error creating habitacion', error })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.query()
        .where('id', params.id)
        .preload('nivel')
        .preload('claseHabitacion')
        .preload('reservaciones')
        .firstOrFail()
      response.status(200).json(habitacion)
    } catch (error) {
      response.status(404).json({ message: 'Habitacion not found', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.findOrFail(params.id)
      const data = request.only([
        'nombre',
        'nivelId',
        'claseHabitacionId',
        'precio',
        'estado',
        'anulado',
      ])
      habitacion.merge(data)
      await habitacion.save()
      response.status(200).json(habitacion)
    } catch (error) {
      response.status(500).json({ message: 'Error updating habitacion', error })
    }
  }

  async updateAnulado({ params, request, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.findOrFail(params.id)
      const data = request.only(['anulado'])
      habitacion.merge(data)
      await habitacion.save()
      response.status(200).json(habitacion)
    } catch (error) {
      response.status(500).json({ message: 'Error updating habitacion', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.findOrFail(params.id)
      await habitacion.delete()
      response.status(200).json({ message: 'Habitacion deleted successfully' })
    } catch (error) {
      response.status(500).json({ message: 'Error deleting habitacion', error })
    }
  }
}
