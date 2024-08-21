import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import ArqueoCaja from './arqueo_caja.js'

export default class AperturaCaja extends BaseModel {
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

  @hasOne(() => ArqueoCaja, {
    foreignKey: 'aperturaId',
  })
  declare cliente: HasOne<typeof ArqueoCaja>
}
