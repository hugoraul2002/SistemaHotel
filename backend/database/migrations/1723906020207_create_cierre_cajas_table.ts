import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cierre_caja'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('arqueo_id')
        .unsigned()
        .references('id')
        .inTable('arqueo_caja')
        .onDelete('CASCADE')
      table.dateTime('fecha').notNullable()
      table.float('monto_sistema').notNullable()
      table.string('observaciones').notNullable()
      table.boolean('anulado').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
