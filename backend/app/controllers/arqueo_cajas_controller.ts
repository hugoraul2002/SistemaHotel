import type { HttpContext } from '@adonisjs/core/http'
import ArqueoCaja from '#models/arqueo_caja'

export default class ArqueoCajasController {
  async index({ response }: HttpContext) {
    const arqueos = await ArqueoCaja.query().where('anulado', false).preload('apertura')
    return response.status(200).json(arqueos)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['aperturaId', 'usuarioId', 'fecha', 'monto', 'anulado'])
    const arqueo = await ArqueoCaja.create(data)
    return response.status(201).json(arqueo)
  }

  async show({ params, response }: HttpContext) {
    const arqueo = await ArqueoCaja.query()
      .where('id', params.id)
      .where('anulado', false)
      .preload('apertura')
      .firstOrFail()
    return response.status(200).json(arqueo)
  }

  async update({ params, request, response }: HttpContext) {
    const arqueo = await ArqueoCaja.findOrFail(params.id)
    const data = request.only(['aperturaId', 'usuarioId', 'fecha', 'monto', 'anulado'])
    arqueo.merge(data)
    await arqueo.save()
    return response.status(200).json(arqueo)
  }

  async updateAnulado({ params, request, response }: HttpContext) {
    const arqueo = await ArqueoCaja.findOrFail(params.id)
    arqueo.anulado = request.input('anulado')
    await arqueo.save()
    return response.status(200).json(arqueo)
  }
}
