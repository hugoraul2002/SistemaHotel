import type { HttpContext } from '@adonisjs/core/http'
import Factura from '#models/factura'
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

  async updateAnulado({ params, response }: HttpContext) {
    const { id } = params
    try {
      const factura = await Factura.findOrFail(id)
      factura.anulado = !factura.anulado
      await factura.save()
      return response.ok(factura)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating lodging', error })
    }
  }
}