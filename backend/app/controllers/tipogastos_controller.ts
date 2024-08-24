import type { HttpContext } from '@adonisjs/core/http'
import TipoGasto from '#models/tipogasto'
export default class TipogastosController {
  async index({ response }: HttpContext) {
    const tiposgasto = await TipoGasto.query().where('anulado', false)
    return response.status(200).json(tiposgasto)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nombre', 'anulado'])
    const tipogasto = await TipoGasto.create(data)
    return response.status(201).json(tipogasto)
  }

  async show({ params, response }: HttpContext) {
    const tipogasto = await TipoGasto.query()
      .where('id', params.id)
      .where('anulado', false)
      .firstOrFail()
    return response.status(200).json(tipogasto)
  }

  async update({ params, request, response }: HttpContext) {
    const tipogasto = await TipoGasto.findOrFail(params.id)
    const data = request.only(['nombre', 'anulado'])
    tipogasto.merge(data)
    await tipogasto.save()
    return response.status(200).json(tipogasto)
  }

  async updateAnulado({ params, request, response }: HttpContext) {
    const tipogasto = await TipoGasto.findOrFail(params.id)
    tipogasto.anulado = request.input('anulado')
    await tipogasto.save()
    return response.status(200).json(tipogasto)
  }
}
