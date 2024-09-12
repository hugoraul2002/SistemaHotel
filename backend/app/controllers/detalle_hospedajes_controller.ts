import DetalleHospedaje from '#models/detalle_hospedaje'
import type { HttpContext } from '@adonisjs/core/http'

export default class DetalleHospedajesController {
  async index({ response }: HttpContext) {
    try {
      const detalleHospedajes = await DetalleHospedaje.query()
        .preload('hospedaje')
        .preload('producto')
      return response.ok(detalleHospedajes)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodging details', error })
    }
  }

  async detallesByHospedaje({ params, response }: HttpContext) {
    try {
      const detalleHospedajes = await DetalleHospedaje.query()
        .where('hospedajeId', params.id)
        .preload('producto')
      return response.ok(detalleHospedajes)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodging details', error })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'hospedajeId',
      'productoId',
      'cantidad',
      'precio',
      'subtotal',
      'anulado',
    ])
    try {
      const detalleHospedaje = await DetalleHospedaje.create(data)
      return response.created(detalleHospedaje)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating lodging detail', error })
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    try {
      const detalleHospedaje = await DetalleHospedaje.findOrFail(id)
      return response.ok(detalleHospedaje)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodging detail', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const data = request.only([
      'hospedajeId',
      'productoId',
      'cantidad',
      'precio',
      'subtotal',
      'anulado',
    ])
    try {
      const detalleHospedaje = await DetalleHospedaje.findOrFail(id)
      detalleHospedaje.merge(data)
      await detalleHospedaje.save()
      return response.ok(detalleHospedaje)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating lodging detail', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    try {
      const detalleHospedaje = await DetalleHospedaje.findOrFail(id)
      await detalleHospedaje.delete()
      return response.ok({ message: 'Lodging detail deleted' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting lodging detail', error })
    }
  }
}
