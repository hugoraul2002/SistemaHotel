import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Factura from '#models/factura'
import User from '#models/user'
export default class BitacoraAnulacion extends BaseModel {
  static table = 'bitacora_anulaciones'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare facturaId: number

  @column()
  declare userId: number

  @column()
  declare motivo: string

  @column()
  declare fecha: DateTime

  @belongsTo(() => Factura, {
    foreignKey: 'facturaId',
  })
  declare factura: BelongsTo<typeof Factura>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
