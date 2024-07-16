import { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'

export default class ClientesController {
  async index({}: HttpContext) {
    return 'Hello World'
  }

  async store({ request }: HttpContext) {}

  async show({}: HttpContext) {
    return 'Hello World'
  }

  async update({}: HttpContext) {
    return 'Hello World'
  }

  async destroy({}: HttpContext) {
    return 'Hello World'
  }
}
