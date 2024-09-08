import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Habitacion from '#models/habitacion'
import User from '#models/user'
import Cliente from '#models/cliente'
import Hospedaje from './hospedaje.js'
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
  declare fechaInicio: DateTime

  @column()
  declare fechaFin: DateTime

  @column()
  declare fechaRegistro: DateTime

  @column()
  declare numeroAdultos: number

  @column()
  declare numeroNinos: number

  @column()
  declare observaciones: string

  @column()
  declare pagado: boolean

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

  @hasOne(() => Hospedaje, {
    foreignKey: 'reservacionId',
  })
  declare hospedaje: HasOne<typeof Hospedaje>
}
