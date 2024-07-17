import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clientes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('idUsuario').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.enum('tipoDocumento', ['NIT', 'CUI', 'IDE']).notNullable()
      table.string('numDocumento').notNullable()
      table.string('nombre').notNullable()
      table.string('telefono').notNullable()
      table.string('direccion').notNullable()
      table.boolean('activo').notNullable().defaultTo(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
