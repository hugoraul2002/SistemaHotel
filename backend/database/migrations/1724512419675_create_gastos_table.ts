import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gastos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table
        .integer('tipo_gasto_id')
        .unsigned()
        .references('id')
        .inTable('tipogastos')
        .onDelete('CASCADE')
      table
        .integer('proveedor_id')
        .unsigned()
        .references('id')
        .inTable('proveedores')
        .onDelete('CASCADE')
      table.string('descripcion').notNullable()
      table.float('monto').notNullable()
      table.date('fecha').notNullable()
      table.boolean('anulado').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
