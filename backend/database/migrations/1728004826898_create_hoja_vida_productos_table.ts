import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hoja_vida_productos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('producto_id')
        .unsigned()
        .references('id')
        .inTable('productos')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.date('fecha').notNullable()
      table.string('tipo').notNullable()
      table.integer('movimiento_id').unsigned()
      table.float('existencia_anterior').notNullable()
      table.float('cantidad').notNullable()
      table.float('existencia_actual').notNullable()
      table.string('detalle').nullable()
      table.float('costo').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
