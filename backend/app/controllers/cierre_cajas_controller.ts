import type { HttpContext } from '@adonisjs/core/http'
import CierreCaja from '#models/cierre_caja'
import db from '@adonisjs/lucid/services/db'
export default class CierreCajasController {
  async index({ response }: HttpContext) {
    const cierres = await CierreCaja.query().where('anulado', false).preload('arqueo')
    return response.status(200).json(cierres)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'arqueoId',
      'userId',
      'fecha',
      'montoSistema',
      'observaciones',
      'anulado',
    ])
    const cierre = await CierreCaja.create(data)
    return response.status(201).json(cierre)
  }

  async show({ params, response }: HttpContext) {
    const cierre = await CierreCaja.query()
      .where('id', params.id)
      .where('anulado', false)
      .preload('arqueo')
      .firstOrFail()
    return response.status(200).json(cierre)
  }

  async update({ params, request, response }: HttpContext) {
    const cierre = await CierreCaja.findOrFail(params.id)
    const data = request.only([
      'arqueoId',
      'usuarioId',
      'fecha',
      'montoSistema',
      'observaciones',
      'anulado',
    ])
    cierre.merge(data)
    await cierre.save()
    return response.status(200).json(cierre)
  }

  async updateAnulado({ params, request, response }: HttpContext) {
    const cierre = await CierreCaja.findOrFail(params.id)
    cierre.anulado = request.input('anulado')
    await cierre.save()
    return response.status(200).json(cierre)
  }

  async transaccionesCierre({ params, response }: HttpContext) {
    try {
      const habitaciones = await db.rawQuery(`
        SELECT * FROM transacciones_caja WHERE apertura_id= ${params.idApertura}
      `)
      response.status(200).json(habitaciones[0])
    } catch (error) {
      response.status(500).json({ message: 'Error fetching transacciones', error })
    }
  }

  async encabezadoCierre({ params, response }: HttpContext) {
    try {
      const habitaciones = await db.rawQuery(`
        SELECT id_apertura as idApertura,id_arqueo as idArqueo, usuario, fecha_apertura as fechaApertura, monto as montoApertura, monto_arqueo as montoArqueo, existe_cierre as existeCierre, observacionesCierre,aplicaCierre FROM cajas WHERE id_apertura= ${params.idApertura}
      `)
      response.status(200).json(habitaciones[0])
    } catch (error) {
      response.status(500).json({ message: 'Error fetching encabezado', error })
    }
  }
}
