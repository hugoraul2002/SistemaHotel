import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Habitacion from '#models/habitacion'
import User from '#models/user'
import Cliente from '#models/cliente'
import Reservacion from '#models/reservacion'
import DetalleHospedaje from '#models/detalle_hospedaje'

export default class Hospedaje extends BaseModel {
  static table = 'hospedajes'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare userId: number

  @column()
  declare reservacionId: number

  @column()
  declare habitacionId: number

  @column()
  declare fechaInicio: DateTime

  @column()
  declare fechaFin: DateTime

  @column()
  declare fechaRegistro: DateTime

  @column()
  declare total: number

  @column()
  declare montoPenalidad: number

  @column()
  declare facturado: boolean

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

  @belongsTo(() => Reservacion, {
    foreignKey: 'reservacionId',
  })
  declare reservacion: BelongsTo<typeof Reservacion>

  @hasMany(() => DetalleHospedaje, {
    foreignKey: 'hospedajeId',
  })
  declare detalles: HasMany<typeof DetalleHospedaje>
}
