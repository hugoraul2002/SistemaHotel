import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pago_transacciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('checkout_id').notNullable()
      table.string('descripcion').notNullable()
      table
        .integer('reservacion_id')
        .unsigned()
        .references('id')
        .inTable('reservaciones')
        .onDelete('CASCADE')
      table.dateTime('fecha_registro').notNullable()
      table.dateTime('fecha_pagado').nullable()
      table.string('estado').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
