import type { HttpContext } from '@adonisjs/core/http'
import Producto from '#models/producto'
export default class ProductosController {
  async index({ response }: HttpContext) {
    try {
      const productos = await Producto.query().where('anulado', false)
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
    const data = request.only(['nombre', 'descripcion', 'precio', 'stock', 'activo'])
    try {
      const producto = await Producto.findOrFail(id)
      producto.merge(data)
      await producto.save()
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
}
