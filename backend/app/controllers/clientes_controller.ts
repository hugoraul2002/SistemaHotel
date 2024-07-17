import { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'
import { clienteValidator } from '#validators/cliente'

export default class ClientesController {
  async index({ response }: HttpContext) {
    try {
      const clientes = await Cliente.all()
      return response.ok(clientes)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching clients', error })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(clienteValidator)
      const cliente = await Cliente.create(data)
      return response.created(cliente)
    } catch (error) {
      return response.internalServerError({ message: 'Error creating client', error })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      return response.ok(cliente)
    } catch (error) {
      return response.notFound({ message: 'Client not found', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      const data = request.only([
        'userId',
        'tipoDocumento',
        'numDocumento',
        'nombre',
        'telefono',
        'direccion',
        'activo',
      ])
      cliente.merge(data)
      await cliente.save()
      return response.ok(cliente)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating client', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      await cliente.delete()
      return response.ok({ message: 'Client deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Error deleting client', error })
    }
  }
}
