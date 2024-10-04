import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bitacora_anulaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('factura_id')
        .unsigned()
        .references('id')
        .inTable('facturas')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.string('motivo').notNullable()
      table.dateTime('fecha').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
