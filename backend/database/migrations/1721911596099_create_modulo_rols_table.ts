import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ModuloRol extends BaseSchema {
  protected tableName = 'modulo_rol'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('rol_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.integer('modulo_id').unsigned().references('id').inTable('modulos').onDelete
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
