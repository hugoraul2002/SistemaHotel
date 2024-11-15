import { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'

export default class ClientesController {
  async index({ request, response }: HttpContext) {
    try {
      const anulados = request.input('anulados', false)
      const clientes = await Cliente.query().where('activo', !anulados)
      // .preload('user')
      return response.ok(clientes)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching clients', error })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'tipo_documento',
        'num_documento',
        'nombre',
        'telefono',
        'direccion',
        'nacionalidad',
        'email',
        'activo',
      ])
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
      const numDocumento = request.input('numeroDocumento')
      const data = request.only([
        // 'userId',
        'tipoDocumento',
        'numDocumento',
        'nombre',
        'telefono',
        'direccion',
        'nacionalidad',
        'email',
        'activo',
      ])
      data.numDocumento = numDocumento
      cliente.merge(data)
      await cliente.save()
      return response.ok(cliente)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating client', error })
    }
  }

  async updateActivo({ params, response }: HttpContext) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      cliente.activo = !cliente.activo
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
