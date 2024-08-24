import { HttpContext } from '@adonisjs/core/http'
import Gasto from '#models/gasto'

export default class GastosController {
  async index({ response }: HttpContext) {
    try {
      const gastos = await Gasto.query()
        .where('anulado', false)
        .preload('tipoGasto')
        .preload('proveedor')
        .preload('usuario')
      return response.ok(gastos)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching expenses', error })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'userId',
        'tipoGastoId',
        'proveedorId',
        'descripcion',
        'monto',
        'fecha',
        'anulado',
      ])
      const gasto = await Gasto.create(data)
      await gasto.load('tipoGasto')
      await gasto.load('proveedor')
      await gasto.load('usuario')
      return response.created(gasto)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating expense', error })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const gasto = await Gasto.findOrFail(params.id)
      await gasto.load('tipoGasto')
      await gasto.load('proveedor')
      await gasto.load('usuario')
      return response.ok(gasto)
    } catch (error) {
      return response.notFound({ message: 'Expense not found', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const gasto = await Gasto.findOrFail(params.id)
      const data = request.only([
        'userId',
        'tipoGastoId',
        'proveedorId',
        'descripcion',
        'monto',
        'fecha',
        'anulado',
      ])
      gasto.merge(data)
      await gasto.save()
      await gasto.load('tipoGasto')
      await gasto.load('proveedor')
      await gasto.load('usuario')
      return response.ok(gasto)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating expense', error })
    }
  }

  async updateAnulado({ params, response }: HttpContext) {
    try {
      const gasto = await Gasto.findOrFail(params.id)
      gasto.anulado = !gasto.anulado
      await gasto.save()
      return response.ok(gasto)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating expense', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const gasto = await Gasto.findOrFail(params.id)
      await gasto.delete()
      return response.ok({ message: 'Expense deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting expense', error })
    }
  }
}
