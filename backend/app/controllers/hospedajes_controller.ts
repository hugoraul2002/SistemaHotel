import type { HttpContext } from '@adonisjs/core/http'
import Hospedaje from '#models/hospedaje'
import Habitacion from '#models/habitacion'
import Reservacion from '#models/reservacion'
import DetalleHospedaje from '#models/detalle_hospedaje'

export default class HospedajesController {
  async index({ response }: HttpContext) {
    try {
      const hospedajes = await Hospedaje.query()
        .preload('habitacion')
        .preload('cliente')
        .preload('usuario')
        .preload('reservacion')
      return response.ok(hospedajes)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodgings', error })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'habitacionId',
      'clienteId',
      'userId',
      'reservacionId',
      'fechaInicio',
      'fechaFin',
      'fechaRegistro',
      'total',
      'montoPenalidad',
      'montoDescuento',
    ])
    console.log(data)
    try {
      const hospedaje = await Hospedaje.create(data)
      await DetalleHospedaje.create({
        hospedajeId: hospedaje.id,
        productoId: 1,
        cantidad: 1,
        costo: 1,
        precioVenta: data.total,
      })
      const habitacion = await Habitacion.findOrFail(data.habitacionId)
      habitacion.estado = 'O'
      await habitacion.save()

      if (data.reservacionId) {
        const reservacion = await Reservacion.findOrFail(data.reservacionId)
        reservacion.estado = 'recepcionada'
        await reservacion.save()
      }
      return response.created(hospedaje)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error creating lodging', error })
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    try {
      const hospedaje = await Hospedaje.query()
        .where('id', id)
        .preload('habitacion')
        .preload('cliente')
      return response.ok(hospedaje)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodging', error })
    }
  }

  async activoByIdHabitacion({ params, response }: HttpContext) {
    const { id } = params
    try {
      const hospedaje = await Hospedaje.query()
        .where('habitacionId', id)
        .where('facturado', false)
        .preload('habitacion')
        .preload('cliente')
        .first()
      return response.ok(hospedaje)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodging', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const data = request.only([
      'habitacionId',
      'clienteId',
      'userId',
      'reservacionId',
      'fechaInicio',
      'fechaFin',
      'fechaRegistro',
      'total',
      'montoPenalidad',
      'montoDescuento',
      'facturado',
    ])
    try {
      const hospedaje = await Hospedaje.findOrFail(id)
      hospedaje.merge(data)
      await hospedaje.save()
      return response.ok(hospedaje)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating lodging', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    try {
      const hospedaje = await Hospedaje.findOrFail(id)
      await hospedaje.delete()
      return response.ok({ message: 'Lodging deleted' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting lodging', error })
    }
  }
  // async updateAnulado({ params, response }: HttpContext) {
  //   const { id } = params
  //   try {
  //     const hospedaje = await Hospedaje.findOrFail(id)
  //     hospedaje.anulado = !hospedaje.anulado
  //     await hospedaje.save()
  //     return response.ok(hospedaje)
  //   } catch (error) {
  //     return response.internalServerError({ message: 'Error updating lodging', error })
  //   }
  // }
}
