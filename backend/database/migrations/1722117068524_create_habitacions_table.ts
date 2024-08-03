import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'habitaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nombre', 255).notNullable()
      table.integer('nivel_id').unsigned().references('id').inTable('niveles').notNullable()
      table
        .integer('clase_habitacion_id')
        .unsigned()
        .references('id')
        .inTable('clases_habitaciones')
        .notNullable()
      table.float('precio').notNullable()
      table.enum('estado', ['D', 'R', 'O', 'S', 'L']).notNullable()
      table.boolean('anulado').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
