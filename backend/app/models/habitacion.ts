import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Nivel from '#models/nivel'
import ClaseHabitacion from '#models/clase_habitacion'
import Reservacion from '#models/reservacion'
export default class Habitacion extends BaseModel {
  static table = 'habitaciones'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare nivelId: number

  @column()
  declare claseHabitacionId: number

  @column()
  declare precio: number

  @column()
  declare tarifa: number

  @column()
  declare estado: string

  @column()
  declare anulado: boolean

  @belongsTo(() => Nivel, {
    foreignKey: 'nivelId',
  })
  declare nivel: BelongsTo<typeof Nivel>

  @belongsTo(() => ClaseHabitacion, {
    foreignKey: 'claseHabitacionId',
  })
  declare claseHabitacion: BelongsTo<typeof ClaseHabitacion>

  @hasMany(() => Reservacion, {
    foreignKey: 'habitacionId',
  })
  declare reservaciones: HasMany<typeof Reservacion>
}
