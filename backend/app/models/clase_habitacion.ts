import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Habitacion from '#models/user'

export default class ClaseHabitacion extends BaseModel {
  static table = 'clases_habitaciones'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare anulado: boolean

  @hasMany(() => Habitacion, {
    foreignKey: 'clasHabitacionId',
  })
  declare habitaciones: HasMany<typeof Habitacion>
}
