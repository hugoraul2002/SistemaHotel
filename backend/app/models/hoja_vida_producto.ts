import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class HojaVidaProducto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productoId: number

  @column()
  declare userId: number

  @column()
  declare fecha: DateTime

  @column()
  declare tipo: string

  @column()
  declare movimientoId: number

  @column()
  declare existenciaAnterior: number

  @column()
  declare cantidad: number

  @column()
  declare existenciaActual: number

  @column()
  declare detalle: string

  @column()
  declare costo: number
}
