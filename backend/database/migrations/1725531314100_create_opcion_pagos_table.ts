import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'opciones_pagos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('apertura_id')
        .unsigned()
        .references('id')
        .inTable('aperturas')
        .onDelete('CASCADE')
        .nullable()
      table.string('tipo_documento').notNullable()
      table.integer('documento_id').notNullable()
      table.string('metodo').notNullable()
      table.float('monto').notNullable()
      table.date('fecha').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
