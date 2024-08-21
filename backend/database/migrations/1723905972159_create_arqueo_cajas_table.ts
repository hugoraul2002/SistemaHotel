import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'arqueo_caja'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('apertura_id').unsigned().references('id').inTable('apertura_caja')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.dateTime('fecha').notNullable()
      table.float('monto').notNullable()
      table.boolean('anulado').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
