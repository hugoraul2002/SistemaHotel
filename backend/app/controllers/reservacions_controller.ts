import type { HttpContext } from '@adonisjs/core/http'
import Reservacion from '#models/reservacion'

export default class ReservacionesController {
  async index({ response }: HttpContext) {
    try {
      const reservaciones = await Reservacion.query()
        // .where('estado', '!=', 'pendiente')
        .preload('habitacion', (habitacionQuery) => {
          habitacionQuery.preload('claseHabitacion')
        })
        .preload('cliente')
        .preload('usuario')
      return response.ok(reservaciones)
    } catch (error) {
      return response.internalServerError({ message: 'Error get reservaciones.', error })
    }
  }

  async create({ request, response }: HttpContext) {
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
        'numeroAdultos',
        'numeroNinos',
        'observaciones',
        'anulado',
      ])
      console.log(reservacionData)
      const reservacion = await Reservacion.create(reservacionData)
      await reservacion.load('habitacion')
      await reservacion.load('cliente')
      await reservacion.load('usuario')
      return response.created(reservacion)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating reservation', error })
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
        'numeroAdultos',
        'numeroNinos',
        'observaciones',
        'anulado',
      ])
      console.log(reservacionData)

      const existeConflicto = await Reservacion.query()
        .where('habitacionId', reservacionData.habitacionId)
        .where('anulado', false)
        .where('estado', '!=', 'pendiente')
        .where((query) => {
          query
            .whereBetween('fechaInicio', [reservacionData.fechaInicio, reservacionData.fechaFin])
            .orWhereBetween('fechaFin', [reservacionData.fechaInicio, reservacionData.fechaFin])
            .orWhere((subquery) => {
              subquery
                .where('fechaInicio', '<=', reservacionData.fechaInicio)
                .where('fechaFin', '>=', reservacionData.fechaFin)
            })
        })
        .first()

      if (existeConflicto) {
        return response.conflict({
          message: 'La habitación está ocupada en el rango de fechas seleccionado.',
        })
      }

      // Si no hay conflicto, crear la reservación
      const reservacion = await Reservacion.create(reservacionData)
      await reservacion.load('habitacion')
      await reservacion.load('cliente')
      await reservacion.load('usuario')

      return response.created(reservacion)
    } catch (error) {
      console.log(error)
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
      'numeroAdultos',
      'numeroNinos',
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

  async updateEstado({ params, request, response }: HttpContext) {
    const data = request.only(['estado'])

    try {
      const reservacion = await Reservacion.findOrFail(params.id)
      reservacion.merge(data)
      await reservacion.save()
      await reservacion.load('habitacion')
      await reservacion.load('cliente')
      await reservacion.load('usuario')
      return response.ok(reservacion)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating reservation state', error })
    }
  }

  async updateAnulado({ params, response }: HttpContext) {
    const { id } = params
    try {
      const reservacion = await Reservacion.findOrFail(id)
      reservacion.anulado = !reservacion.anulado
      await reservacion.save()
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
