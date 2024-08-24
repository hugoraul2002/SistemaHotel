import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proveedores'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nit', 255).notNullable()
      table.string('nombre', 255).notNullable()
      table.string('telefono', 255).notNullable()
      table.string('direccion', 255).notNullable()
      table.string('email', 255).notNullable()
      table.boolean('anulado').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
