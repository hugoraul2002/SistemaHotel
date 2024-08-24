import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne, BelongsTo } from '@adonisjs/lucid/types/relations'
import ArqueoCaja from './arqueo_caja.js'
import User from '#models/user'

export default class AperturaCaja extends BaseModel {
  static table = 'apertura_caja'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare fecha: DateTime

  @column()
  declare observaciones: string

  @column()
  declare monto: number

  @column()
  declare anulado: boolean

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasOne(() => ArqueoCaja, {
    foreignKey: 'aperturaId',
  })
  declare arqueoCaja: HasOne<typeof ArqueoCaja>
}
