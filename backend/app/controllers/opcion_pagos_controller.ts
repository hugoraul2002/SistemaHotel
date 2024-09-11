import type { HttpContext } from '@adonisjs/core/http'
import OpcionPago from '#models/opcion_pago'

export default class OpcionPagosController {
  async index({ response }: HttpContext) {
    const pagos = await OpcionPago.all()
    return response.ok(pagos)
  }

  async store({ request, response }: HttpContext) {
    try {
      console.log(request.all())
      const data = request.only([
        'aperturaId',
        'tipoDocumento',
        'documentoId',
        'metodo',
        'monto',
        'fecha',
      ])
      const metodo = {
        apertura_id: data.aperturaId,
        tipo_documento: data.tipoDocumento,
        documento_id: data.documentoId,
        metodo: data.metodo,
        monto: data.monto,
        fecha: data.fecha,
      }
      const pago = await OpcionPago.create(metodo)
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

  async getByDocumento({ params, response }: HttpContext) {
    try {
      const pagos = await OpcionPago.query()
        .where('tipo_documento', params.tipo)
        .where('documento_id', params.id)
      return response.ok(pagos)
    } catch (error) {
      return response.notFound({ message: 'Payment option not found', error })
    }
  }
}
