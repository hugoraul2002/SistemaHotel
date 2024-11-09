import type { HttpContext } from '@adonisjs/core/http'
import PagoTransaccion from '#models/pago_transaccion'
import env from '#start/env'
import CryptoJS from 'crypto-js'
import Reservacion from '#models/reservacion'

export default class PagoTransaccionsController {
  private CLAVE_CRYPTO: string | undefined = env.get('CLAVE_CRYPTO')
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

      const pago = await PagoTransaccion.create(data)
      return response.status(201).json({ idHash: this.encryptIdPago(pago.id) })
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
      const pago = await PagoTransaccion.findOrFail(this.decryptIdPago(id))
      const data = request.input('checkoutId')
      pago.checkoutId = data
      await pago.save()
      return response.status(200).json(pago)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error updating payment', error })
    }
  }

  async verificarTransaccion({ request, response }: HttpContext) {
    try {
      const data = request.only(['idHash', 'fechaPagado'])
      const id = this.decryptIdPago(data.idHash)

      // Verifica si la transacción ya fue verificada
      const pago = await PagoTransaccion.find(id)

      if (!pago) {
        return response.status(200).json({ success: false, message: 'Registro no encontrado.' })
      }

      if (pago.estado === 'Pagado') {
        return response
          .status(200)
          .json({ success: false, message: 'Pago anteriormente verificado.', pago })
      }
      // Actualiza el estado de la transacción
      pago.estado = 'Pagado'
      pago.fechaPagado = data.fechaPagado
      await pago.save()

      // Actualiza el estado de la reservacion
      const reservacion = await Reservacion.findOrFail(pago.reservacionId)
      reservacion.estado = 'creada'
      reservacion.pagado = true
      await reservacion.save()

      await pago.load('reservacion')
      await pago.reservacion.load('habitacion')
      await pago.reservacion.load('cliente')

      return response
        .status(200)
        .json({ success: true, message: 'Pago verificado correctamente.', pago })
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error updating payment', error })
    }
  }

  // Encripta el ID con AES y luego convierte a Base64 URL-safe
  encryptIdPago = (idPago: number) => {
    const encrypted = CryptoJS.AES.encrypt(idPago.toString(), this.CLAVE_CRYPTO!).toString()
    // Reemplaza '/' con '_', '+' con '-'
    return encrypted.replace(/\//g, '_').replace(/\+/g, '-')
  }

  async encriptarId({ request, response }: HttpContext) {
    const id = this.encryptIdPago(request.input('id'))
    return response.status(200).json({ id })
  }

  // Desencripta el ID luego de revertir la codificación URL-safe
  decryptIdPago = (encryptedIdPago: string) => {
    // Reemplaza '_' con '/', '-' con '+'
    const base64Id = encryptedIdPago.replace(/_/g, '/').replace(/-/g, '+')
    const bytes = CryptoJS.AES.decrypt(base64Id, this.CLAVE_CRYPTO!)
    return Number.parseInt(bytes.toString(CryptoJS.enc.Utf8), 10)
  }
}
