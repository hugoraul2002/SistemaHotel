import type { HttpContext } from '@adonisjs/core/http'
import AperturaCaja from '#models/apertura_caja'

export default class AperturaCajasController {
  async index({ response }: HttpContext) {
    const aperturas = await AperturaCaja.query().where('anulado', false)
    return response.status(200).json(aperturas)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['userId', 'fecha', 'observaciones', 'monto', 'anulado'])
    const apertura = await AperturaCaja.create(data)
    return response.status(201).json(apertura)
  }

  async show({ params, response }: HttpContext) {
    const apertura = await AperturaCaja.query()
      .where('id', params.id)
      .where('anulado', false)
      .firstOrFail()
    return response.status(200).json(apertura)
  }

  async update({ params, request, response }: HttpContext) {
    const apertura = await AperturaCaja.findOrFail(params.id)
    const data = request.only(['userId', 'fecha', 'observaciones', 'monto', 'anulado'])
    apertura.merge(data)
    await apertura.save()
    return response.status(200).json(apertura)
  }
  async updateAnulado({ params, request, response }: HttpContext) {
    const apertura = await AperturaCaja.findOrFail(params.id)
    apertura.anulado = request.input('anulado')
    await apertura.save()
    return response.status(200).json(apertura)
  }
}
