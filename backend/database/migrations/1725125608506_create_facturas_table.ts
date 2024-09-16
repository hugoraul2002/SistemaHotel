import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'facturas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('hospedaje_id')
        .unsigned()
        .references('id')
        .inTable('hospedajes')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.integer('num_factura').notNullable()
      table.string('nit').notNullable()
      table.string('nombre_facturado').notNullable()
      table.string('direccion_facturado').notNullable()
      table.string('numero_fel').nullable()
      table.string('serie_fel').nullable()
      table.string('autorizacion_fel').nullable()
      table.datetime('emision_fel').nullable()
      table.datetime('certificacion_fel').nullable()
      table.datetime('fecha_registro').notNullable()
      table.float('total').notNullable()
      table.boolean('anulado').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
