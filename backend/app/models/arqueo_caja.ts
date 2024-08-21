import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import AperturaCaja from './apertura_caja.js'
import CierreCaja from './cierre_caja.js'

export default class ArqueoCaja extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare aperturaId: number

  @column()
  declare usuarioId: number

  @column()
  declare fecha: DateTime

  @column()
  declare monto: number

  @column()
  declare anulado: boolean

  @belongsTo(() => AperturaCaja, {
    foreignKey: 'aperturaId',
  })
  declare apertura: BelongsTo<typeof AperturaCaja>

  @hasOne(() => CierreCaja, {
    foreignKey: 'arqueoId',
  })
  declare cierre: HasOne<typeof CierreCaja>
}
