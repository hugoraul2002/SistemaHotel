import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Reservacion from '#models/reservacion'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PagoTransaccion extends BaseModel {
  static table = 'pago_transacciones'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare checkoutId: number

  @column()
  declare descripcion: string

  @column()
  declare reservacionId: number

  @column()
  declare fechaRegistro: DateTime

  @column()
  declare fechaPagado: DateTime

  @column()
  declare estado: string

  @belongsTo(() => Reservacion, {
    foreignKey: 'reservacionId',
  })
  declare reservacion: BelongsTo<typeof Reservacion>
}
