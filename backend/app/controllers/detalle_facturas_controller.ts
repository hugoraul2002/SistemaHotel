import type { HttpContext } from '@adonisjs/core/http'
import DetalleFactura from '#models/detalle_factura'
import Producto from '#models/producto'
export default class DetalleFacturasController {
  async index({ params, response }: HttpContext) {
    try {
      const { idFactura } = params
      const detalleFactura = await DetalleFactura.query()
        .where('facturaId', idFactura)
        .preload('factura')
        .preload('producto')
      return response.ok(detalleFactura)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching details', error })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'facturaId',
      'productoId',
      'cantidad',
      'costo',
      'precio',
      'descuento',
      'anulado',
    ])
    try {
      const detalleFactura = await DetalleFactura.create(data)
      return response.created(detalleFactura)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating detail', error })
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    try {
      const detalleFactura = await DetalleFactura.findOrFail(id)
      return response.ok(detalleFactura)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching detail', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const data = request.only([
      'facturaId',
      'productoId',
      'cantidad',
      'costo',
      'precio',
      'descuento',
      'anulado',
    ])
    try {
      const detalleFactura = await DetalleFactura.findOrFail(id)
      detalleFactura.merge(data)
      await detalleFactura.save()
      return response.ok(detalleFactura)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating lodging detail', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    try {
      const detalleFactura = await DetalleFactura.findOrFail(id)
      const cantidad = detalleFactura.cantidad
      const producto = await Producto.findOrFail(detalleFactura.productoId)
      await detalleFactura.delete()

      if (!producto.esServicio) {
        producto.existencia += cantidad
        await producto.save()
      }

      return response.ok({ message: 'Detalle eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting detalle', error })
    }
  }
}
