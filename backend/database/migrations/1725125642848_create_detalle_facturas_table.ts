import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'detalle_facturas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('factura_id')
        .unsigned()
        .references('id')
        .inTable('facturas')
        .onDelete('CASCADE')
      table
        .integer('producto_id')
        .unsigned()
        .references('id')
        .inTable('productos')
        .onDelete('CASCADE')
      table.float('cantidad').notNullable()
      table.float('costo').notNullable()
      table.float('precio_venta').notNullable()
      table.float('descuento').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
