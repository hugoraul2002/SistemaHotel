import type { HttpContext } from '@adonisjs/core/http'
import AperturaCaja from '#models/apertura_caja'
export default class AperturaCajasController {
  async index({ response }: HttpContext) {
    const aperturaCajas = await AperturaCaja.query()
    return response.json(aperturaCajas)
  }

  //   async store({ request, response }: HttpContext) {
  //     try {
  //       const data = request.only(['usuario_id','monto_apertura', 'fecha_apertura'])
  //       const aperturaCaja = await AperturaCaja.create(data)
  //       return response.created(aperturaCaja)
  //     } catch (error) {
  //       return response.internalServerError({ message: 'Error creating aperturaCaja', error })
  //     }
  //   }
}
