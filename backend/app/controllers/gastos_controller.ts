import { HttpContext } from '@adonisjs/core/http'
import Gasto from '#models/gasto'
import db from '@adonisjs/lucid/services/db'

export default class GastosController {
  async index({ request, response }: HttpContext) {
    try {
      const anulados = request.input('anulados')
      const fecha = request.input('fecha') // Suponiendo que `fecha` es tipo string o Date
      const opcion = request.input('opcion')
      const userId = request.input('userId')
      let gastos: Gasto[] = []

      // Convertimos la fecha de la request a un objeto de tipo Date
      const inputDate = new Date(fecha)
      const inputMonth = inputDate.getMonth() + 1 // getMonth() devuelve de 0 a 11, sumamos 1 para obtener el mes real
      const inputYear = inputDate.getFullYear()

      if (opcion === 1) {
        gastos = await Gasto.query()
          .where('anulado', anulados)
          .whereRaw('MONTH(fecha) = ? AND YEAR(fecha) = ?', [inputMonth, inputYear])
          .preload('usuario')
          .preload('proveedor')
          .preload('tipoGasto')
      } else {
        gastos = await Gasto.query()
          .where('anulado', anulados)
          .where('userId', userId)
          .whereRaw('MONTH(fecha) = ? AND YEAR(fecha) = ?', [inputMonth, inputYear]) // Mismo filtro de fecha
          .preload('usuario')
          .preload('proveedor')
          .preload('tipoGasto')
      }

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
      console.log(data)
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

  async reporteGastos({ request, response }: HttpContext) {
    try {
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin')
      console.log(fechaInicio, fechaFin)
      const gastos = await db.rawQuery(`
        SELECT * FROM rptGastos WHERE fecha >= '${fechaInicio}' AND fecha <= '${fechaFin}'
      `)
      response.status(200).json(gastos[0])
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching gastos', error })
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
