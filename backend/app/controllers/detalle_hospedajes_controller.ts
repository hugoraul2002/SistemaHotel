import DetalleHospedaje from '#models/detalle_hospedaje'
import Producto from '#models/producto'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
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

  async detallesByIdHospedaje({ params, response }: HttpContext) {
    try {
      const habitaciones = await db.rawQuery(`
        SELECT * FROM vdetalle_hospedaje WHERE hospedaje_id= ${params.id}
      `)
      response.status(200).json(habitaciones[0])
    } catch (error) {
      response.status(500).json({ message: 'Error fetching habitaciones', error })
    }
  }

  async store({ request, response }: HttpContext) {
    console.log(request.all())
    const data = request.only([
      'hospedajeId',
      'productoId',
      'cantidad',
      'costo',
      'precioVenta',
      'descuento',
      'subtotal',
      'pagado',
    ])
    try {
      const detalleHospedaje = await DetalleHospedaje.create(data)
      const producto = await Producto.findOrFail(detalleHospedaje.productoId)
      if (!producto.esServicio) {
        producto.existencia -= detalleHospedaje.cantidad
        await producto.save()
      }
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

      const cantidad = detalleHospedaje.cantidad
      const producto = await Producto.findOrFail(detalleHospedaje.productoId)
      await detalleHospedaje.delete()

      if (!producto.esServicio) {
        producto.existencia += cantidad
        await producto.save()
      }
      return response.ok({ message: 'Lodging detail deleted' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting lodging detail', error })
    }
  }
}
