import type { HttpContext } from '@adonisjs/core/http'
import AperturaCaja from '#models/apertura_caja'
import db from '@adonisjs/lucid/services/db'
export default class AperturaCajasController {
  async index({ response }: HttpContext) {
    const aperturas = await AperturaCaja.query()
      .where('anulado', false)
      .preload('user')
      .preload('arqueoCaja')
    console.log(aperturas)
    return response.status(200).json(aperturas)
  }

  async aperturaActiva({ params, response }: HttpContext) {
    try {
      const data =
        await db.rawQuery(`SELECT * FROM Cajas WHERE estado COLLATE utf8mb4_unicode_ci = 'Apertura' AND anulado=0 AND user_id = ${params.id}
      `)

      if (data[0].length > 0) {
        return response.status(200).json({ aperturaActiva: true, data: data[0][0] })
      }
      return response.status(200).json({ aperturaActiva: false })
    } catch (error) {
      response.status(500).json({ message: 'Error fetching apertura de caja activa', error })
    }
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
