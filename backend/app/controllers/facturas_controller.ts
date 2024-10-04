import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Factura from '#models/factura'
import BitacoraAnulacion from '#models/bitacora_anulacion'
import DetalleFactura from '#models/detalle_factura'
import Producto from '#models/producto'
import HojaVidaProducto from '#models/hoja_vida_producto'
export default class FacturasController {
  async index({ response }: HttpContext) {
    try {
      const hospedajes = await Factura.query().preload('usuario').preload('hospedaje')
      return response.ok(hospedajes)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodgings', error })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'hospedajeId',
      'userId',
      'numFactura',
      'nit',
      'nombreFacturado',
      'direccionFacturado',
      'numeroFel',
      'serieFel',
      'autorizacionFel',
      'emisionFel',
      'certificacionFel',
      'fechaRegistro',
      'anulado',
      'total',
    ])
    console.log(data)
    try {
      const factura = await Factura.create(data)
      return response.created(factura)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error creating factura', error })
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    try {
      const factura = await Factura.findOrFail(id)
      return response.ok(factura)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching factura', error })
    }
  }

  async reporteFactura({ request, response }: HttpContext) {
    try {
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin')
      const facturas = await db.rawQuery(`
        SELECT * FROM rptFacturas WHERE fecha >= '${fechaInicio}' AND fecha <= '${fechaFin}'
      `)
      response.status(200).json(facturas[0])
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching factura', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const data = request.only([
      'hospedajeId',
      'userId',
      'numFactura',
      'nit',
      'nombreFacturado',
      'direccionFacturado',
      'numeroFel',
      'serieFel',
      'autorizacionFel',
      'emisionFel',
      'certificacionFel',
      'fechaRegistro',
      'anulado',
      'total',
    ])
    try {
      const factura = await Factura.findOrFail(id)
      factura.merge(data)
      await factura.save()
      return response.ok(factura)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating factura', error })
    }
  }

  async updateAnulado({ request, response }: HttpContext) {
    const data = request.only(['facturaId', 'motivo', 'userId', 'fecha'])
    console.log(data)
    try {
      const factura = await Factura.findOrFail(data.facturaId)
      factura.anulado = !factura.anulado
      await factura.save()

      console.log(data)
      await BitacoraAnulacion.create({
        facturaId: data.facturaId,
        userId: data.userId,
        motivo: data.motivo,
        fecha: data.fecha,
      })

      const detalles: DetalleFactura[] = await DetalleFactura.query().where(
        'facturaId',
        data.facturaId
      )

      for (const detalle of detalles) {
        const producto = await Producto.findOrFail(detalle.productoId)
        if (!producto.esServicio) {
          const existenciaAnterior = producto.existencia
          producto.existencia += detalle.cantidad
          await producto.save()

          await HojaVidaProducto.create({
            costo: detalle.costo,
            userId: data.userId,
            productoId: producto.id,
            existenciaAnterior: existenciaAnterior,
            cantidad: detalle.cantidad,
            existenciaActual: existenciaAnterior + detalle.cantidad,
            fecha: data.fecha,
            tipo: 'AFH',
            movimientoId: data.facturaId,
            detalle: 'Anulación de factura ' + factura.numFactura + ' por motivo: ' + data.motivo,
          })
        }
      }

      return response.ok(factura)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error updating lodging', error })
    }
  }
}
