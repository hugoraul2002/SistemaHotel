import type { HttpContext } from '@adonisjs/core/http'
import Proveedor from '#models/proveedor'
export default class ProveedorsController {
  async index({ response }: HttpContext) {
    try {
      const proveedores = await Proveedor.query().where('anulado', false)
      return response.ok(proveedores)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching clients', error })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['nit', 'nombre', 'telefono', 'direccion', 'email', 'anulado'])
      const proveedor = await Proveedor.create(data)
      return response.created(proveedor)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating client', error })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const proveedor = await Proveedor.findOrFail(params.id)
      return response.ok(proveedor)
    } catch (error) {
      return response.notFound({ message: 'Client not found', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const proveedor = await Proveedor.findOrFail(params.id)
      const data = request.only(['nit', 'nombre', 'telefono', 'direccion', 'email', 'anulado'])
      proveedor.merge(data)
      await proveedor.save()
      return response.ok(proveedor)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating client', error })
    }
  }

  async updateActivo({ params, response }: HttpContext) {
    try {
      const proveedor = await Proveedor.findOrFail(params.id)
      proveedor.anulado = !proveedor.anulado
      await proveedor.save()
      return response.ok(proveedor)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating client', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const proveedor = await Proveedor.findOrFail(params.id)
      await proveedor.delete()
      return response.ok({ message: 'Client deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting client', error })
    }
  }
}
