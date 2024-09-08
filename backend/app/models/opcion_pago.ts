import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AperturaCaja from '#models/apertura_caja'
export default class OpcionPago extends BaseModel {
  static table = 'opciones_pagos'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare aperturaId: number

  @column()
  declare tipoDocumento: string

  @column()
  declare documentoId: number

  @column()
  declare metodo: string

  @column()
  declare monto: number

  @column()
  declare fecha: DateTime

  @belongsTo(() => AperturaCaja, {
    foreignKey: 'aperturaId',
  })
  declare apertura: BelongsTo<typeof AperturaCaja>
}
