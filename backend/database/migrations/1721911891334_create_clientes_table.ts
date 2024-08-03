import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clientes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.enum('tipo_documento', ['NIT', 'CUI', 'IDE']).notNullable()
      table.string('num_documento').notNullable()
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
