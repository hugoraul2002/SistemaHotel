import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Gasto from '#models/gasto'
export default class Proveedor extends BaseModel {
  static table = 'proveedores'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nit: string

  @column()
  declare nombre: string

  @column()
  declare telefono: string

  @column()
  declare direccion: string

  @column()
  declare email: string

  @column()
  declare anulado: boolean

  @hasMany(() => Gasto, {
    foreignKey: 'proveedorId',
  })
  declare gastos: HasMany<typeof Gasto>
}
