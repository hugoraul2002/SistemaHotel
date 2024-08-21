import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ArqueoCaja from '#models/arqueo_caja'

export default class CierreCaja extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare arqueoId: number

  @column()
  declare usuarioId: number

  @column()
  declare fecha: DateTime

  @column()
  declare montoSistema: number

  @column()
  declare observaciones: string

  @column()
  declare anulado: boolean

  @belongsTo(() => ArqueoCaja, {
    foreignKey: 'arqueoId',
  })
  declare arqueo: BelongsTo<typeof ArqueoCaja>
}
