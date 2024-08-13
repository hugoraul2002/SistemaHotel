import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'productos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id'),
        table.string('codigo', 255).notNullable(),
        table.string('nombre', 255).notNullable(),
        table.float('costo').notNullable(),
        table.float('precio_venta').notNullable(),
        table.float('existencia').notNullable(),
        table.boolean('es_servicio').notNullable(),
        table.dateTime('fecha_ingreso').notNullable(),
        table.boolean('anulado').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
