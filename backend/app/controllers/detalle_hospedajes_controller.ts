import DetalleHospedaje from '#models/detalle_hospedaje'
import HojaVidaProducto from '#models/hoja_vida_producto'
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
        const existenciaAnterior = producto.existencia
        const datos = request.only(['fecha', 'userId', 'observaciones'])
        producto.existencia -= detalleHospedaje.cantidad
        await producto.save()

        await HojaVidaProducto.create({
          productoId: data.productoId,
          costo: data.costo,
          fecha: datos.fecha,
          userId: datos.userId,
          tipo: 'CH',
          movimientoId: data.hospedajeId,
          existenciaAnterior: existenciaAnterior,
          cantidad: data.cantidad,
          existenciaActual: existenciaAnterior - data.cantidad,
          detalle: datos.observaciones,
        })
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

  async destroy({ request, response }: HttpContext) {
    const id = request.input('id')
    try {
      const detalleHospedaje = await DetalleHospedaje.findOrFail(id)

      const cantidad = detalleHospedaje.cantidad
      const costo = detalleHospedaje.costo
      const hospedajeId = detalleHospedaje.hospedajeId
      await detalleHospedaje.delete()
      const producto = await Producto.findOrFail(detalleHospedaje.productoId)

      if (!producto.esServicio) {
        const existenciaAnterior = producto.existencia
        producto.existencia += cantidad
        await producto.save()

        const datos = request.only(['fecha', 'userId', 'observaciones'])
        await HojaVidaProducto.create({
          productoId: producto.id,
          costo: costo,
          fecha: datos.fecha,
          userId: datos.userId,
          tipo: 'ECH',
          movimientoId: hospedajeId,
          existenciaAnterior: existenciaAnterior,
          cantidad: cantidad,
          existenciaActual: existenciaAnterior + cantidad,
          detalle: datos.observaciones,
        })
      }
      return response.ok({ message: 'Lodging detail deleted' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting lodging detail', error })
    }
  }
}
