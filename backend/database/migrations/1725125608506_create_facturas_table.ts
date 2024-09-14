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
      table.integer('numFactura').notNullable()
      table.string('nit').notNullable()
      table.string('nombreFacturado').notNullable()
      table.string('direccionFacturado').notNullable()
      table.string('numeroFel').nullable()
      table.string('serieFel').nullable()
      table.string('autorizacionFel').nullable()
      table.datetime('emisionFel').nullable()
      table.datetime('certificacionFel').nullable()
      table.datetime('fechaRegistro').notNullable()
      table.float('total').notNullable()
      table.boolean('anulado').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
