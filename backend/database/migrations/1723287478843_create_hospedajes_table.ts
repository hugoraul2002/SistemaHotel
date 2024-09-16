import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hospedajes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id'),
        table
          .integer('cliente_id')
          .unsigned()
          .references('id')
          .inTable('clientes')
          .onDelete('CASCADE'),
        table
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('usuarios')
          .onDelete('CASCADE'),
        table
          .integer('reservacion_id')
          .unsigned()
          .references('id')
          .inTable('reservaciones')
          .onDelete('CASCADE'),
        table
          .integer('habitacion_id')
          .unsigned()
          .references('id')
          .inTable('habitaciones')
          .onDelete('CASCADE'),
        table.dateTime('fecha_inicio').notNullable(),
        table.dateTime('fecha_fin').notNullable(),
        table.dateTime('fecha_registro').notNullable(),
        table.float('total').notNullable(),
        table.float('monto_penalidad').notNullable().defaultTo(0)
      table.boolean('facturado').notNullable().defaultTo(false)
      table.boolean('anulado').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
