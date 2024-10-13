import type { HttpContext } from '@adonisjs/core/http'
import PagoTransaccion from '#models/pago_transaccion'

export default class PagoTransaccionsController {
  async store({ request, response }: HttpContext) {
    try {
      let data = request.only([
        'checkoutId',
        'descripcion',
        'reservacionId',
        'fechaRegistro',
        'fechaPagado',
        'estado',
      ])

      console.log(data)
      const pago = await PagoTransaccion.create(data)
      return response.status(201).json(pago)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error creating payment', error })
    }
  }

  async show({ params, response }: HttpContext) {
    const pago = await PagoTransaccion.query().where('id', params.id).firstOrFail()
    return response.status(200).json(pago)
  }

  async updateCheckoutId({ params, request, response }: HttpContext) {
    try {
      const id = params.id
      const pago = await PagoTransaccion.findOrFail(id)
      const data = request.input('checkoutId')
      const fechaPagado = request.input('fechaPagado')
      pago.checkoutId = data
      pago.estado = 'Pagado'
      pago.fechaPagado = fechaPagado
      await pago.save()
      return response.status(200).json(pago)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error updating payment', error })
    }
  }
}
