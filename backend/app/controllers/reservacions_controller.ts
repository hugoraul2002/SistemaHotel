import type { HttpContext } from '@adonisjs/core/http'
import Reservacion from '#models/reservacion'

export default class ReservacionesController {
  async index({ response }: HttpContext) {
    try {
      const reservaciones = await Reservacion.query()
        .preload('habitacion')
        .preload('cliente')
        .preload('usuario')
      return response.ok(reservaciones)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching reservations', error })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const reservacionData = request.only([
        'habitacionId',
        'clienteId',
        'userId',
        'total',
        'estado',
        'fechaInicio',
        'fechaFin',
        'fechaRegistro',
        'observaciones',
        'anulado',
      ])

      const reservacion = await Reservacion.create(reservacionData)
      await reservacion.load('habitacion')
      await reservacion.load('cliente')
      await reservacion.load('usuario')
      return response.created(reservacion)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating reservation', error })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const reservacion = await Reservacion.findOrFail(params.id)
      await reservacion.load('habitacion')
      await reservacion.load('cliente')
      await reservacion.load('usuario')
      return response.ok(reservacion)
    } catch (error) {
      return response.notFound({ message: 'Reservation not found', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const data = request.only([
      'habitacionId',
      'clienteId',
      'userId',
      'total',
      'estado',
      'fechaInicio',
      'fechaFin',
      'fechaRegistro',
      'observaciones',
      'anulado',
    ])

    try {
      const reservacion = await Reservacion.findOrFail(params.id)
      reservacion.merge(data)
      await reservacion.save()
      await reservacion.load('habitacion')
      await reservacion.load('cliente')
      await reservacion.load('usuario')
      return response.ok(reservacion)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating reservation', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const reservacion = await Reservacion.findOrFail(params.id)
      await reservacion.delete()
      return response.ok({ message: 'Reservation deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting reservation', error })
    }
  }
}
