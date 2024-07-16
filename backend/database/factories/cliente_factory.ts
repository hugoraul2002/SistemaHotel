import factory from '@adonisjs/lucid/factories'
import Cliente from '#models/cliente'

export const ClienteFactory = factory
  .define(Cliente, async ({ faker }) => {
    return {}
  })
  .build()
