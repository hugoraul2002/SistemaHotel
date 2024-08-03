import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Habitacion from '#models/habitacion'

export default class Nivel extends BaseModel {
  static table = 'niveles'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare anulado: boolean

  @hasMany(() => Habitacion, {
    foreignKey: 'nivelId',
  })
  declare habitaciones: HasMany<typeof Habitacion>
}
