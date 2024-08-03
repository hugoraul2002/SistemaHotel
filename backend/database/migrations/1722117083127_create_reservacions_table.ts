import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('habitacion_id')
        .unsigned()
        .references('id')
        .inTable('habitaciones')
        .notNullable()
      table.integer('cliente_id').unsigned().references('id').inTable('clientes').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('usuarios').notNullable()
      table.float('total').notNullable()
      table.string('estado', 255).notNullable()
      table.datetime('fecha_inicio').notNullable()
      table.datetime('fecha_fin').notNullable()
      table.dateTime('fecha_registro').notNullable()
      table.string('observaciones').nullable()
      table.boolean('anulado').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
