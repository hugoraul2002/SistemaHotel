import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Producto extends BaseModel {
  static table = 'productos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare costo: number

  @column()
  declare precioVenta: number

  @column()
  declare existencia: number

  @column()
  declare esServicio: boolean

  @column()
  declare fechaIngreso: DateTime

  @column()
  declare anulado: boolean
}
