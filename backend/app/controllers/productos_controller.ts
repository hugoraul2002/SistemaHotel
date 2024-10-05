import type { HttpContext } from '@adonisjs/core/http'
import Producto from '#models/producto'
import HojaVidaProducto from '#models/hoja_vida_producto'
import db from '@adonisjs/lucid/services/db'
export default class ProductosController {
  async index({ request, response }: HttpContext) {
    try {
      const anulado = request.input('anulado', false)
      const productos = await Producto.query().where('anulado', anulado)
      return response.ok(productos)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching products', error })
    }
  }

  async getRegistrosDropDown({ response }: HttpContext) {
    try {
      const productos = await Producto.query().where('anulado', false).select('id', 'nombre')
      return response.ok(productos)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching products', error })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'codigo',
      'nombre',
      'costo',
      'precioVenta',
      'existencia',
      'esServicio',
      'fechaIngreso',
      'anulado',
    ])
    try {
      const producto = await Producto.create(data)
      const userId = request.input('userId')
      await HojaVidaProducto.create({
        costo: data.costo,
        productoId: producto.id,
        fecha: data.fechaIngreso,
        userId: userId,
        tipo: 'IS',
        movimientoId: producto.id,
        existenciaAnterior: 0,
        cantidad: data.existencia,
        existenciaActual: data.existencia,
        detalle: 'Ingreso al sistema',
      })
      return response.created(producto)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating product', error })
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    try {
      const producto = await Producto.findOrFail(id)
      return response.ok(producto)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching product', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const data = request.only([
      'codigo',
      'nombre',
      'costo',
      'precioVenta',
      'existencia',
      'esServicio',
    ])
    try {
      const producto = await Producto.findOrFail(id)
      const existenciaAnterior: number = producto.existencia
      producto.merge(data)
      await producto.save()

      if (existenciaAnterior !== data.existencia) {
        const userId = request.input('userId')
        const fecha = request.input('fecha')
        await HojaVidaProducto.create({
          costo: data.costo,
          productoId: producto.id,
          fecha: fecha,
          userId: userId,
          tipo: 'AE',
          movimientoId: producto.id,
          existenciaAnterior: existenciaAnterior,
          cantidad: Math.abs(data.existencia - existenciaAnterior),
          existenciaActual: data.existencia,
          detalle: 'Actualización de existencia',
        })
      }
      return response.ok(producto)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating product', error })
    }
  }

  async updateActivo({ params, response }: HttpContext) {
    const { id } = params
    try {
      const producto = await Producto.findOrFail(id)
      producto.anulado = !producto.anulado
      await producto.save()
      return response.ok(producto)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating product', error })
    }
  }

  async reporteHojaVida({ request, response }: HttpContext) {
    try {
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin')
      const idProducto = request.input('productoId')
      console.log(`
        SELECT * FROM rpthojavida WHERE producto_id= ${idProducto} AND fecha >= '${fechaInicio}' AND fecha <= '${fechaFin}'
      `)
      const registros = await db.rawQuery(`
        SELECT * FROM rpthojavida WHERE producto_id= ${idProducto} AND fecha >= '${fechaInicio}' AND fecha <= '${fechaFin}'
      `)
      response.status(200).json(registros[0])
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching factura', error })
    }
  }
}
