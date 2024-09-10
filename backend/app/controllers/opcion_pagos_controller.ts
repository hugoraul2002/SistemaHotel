import type { HttpContext } from '@adonisjs/core/http'
import OpcionPago from '#models/opcion_pago'

export default class OpcionPagosController {
  async index({ response }: HttpContext) {
    const pagos = await OpcionPago.all()
    return response.ok(pagos)
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'apertura_caja_id',
        'tipo_documento',
        'documento_id',
        'metodo',
        'monto',
        'fecha',
      ])
      const pago = await OpcionPago.create(data)
      return response.created(pago)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating payment option', error })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const pago = await OpcionPago.findOrFail(params.id)
      return response.ok(pago)
    } catch (error) {
      return response.notFound({ message: 'Payment option not found', error })
    }
  }
}
