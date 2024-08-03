import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Habitacion from '#models/habitacion'
import User from '#models/user'
import Cliente from '#models/cliente'

export default class Reservacion extends BaseModel {
  static table = 'reservaciones'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare habitacionId: number

  @column()
  declare clienteId: number

  @column()
  declare userId: number

  @column()
  declare total: number

  @column()
  declare estado: string

  @column()
  declare fechaInicio: Date

  @column()
  declare fechaFin: Date

  @column()
  declare fechaRegistro: DateTime

  @column()
  declare observaciones: string

  @column()
  declare anulado: boolean

  @belongsTo(() => Habitacion, {
    foreignKey: 'habitacionId',
  })
  declare habitacion: BelongsTo<typeof Habitacion>

  @belongsTo(() => Cliente, {
    foreignKey: 'clienteId',
  })
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare usuario: BelongsTo<typeof User>
}
