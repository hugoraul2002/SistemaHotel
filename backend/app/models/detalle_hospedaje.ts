import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Hospedaje from '#models/hospedaje'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Producto from '#models/producto'
export default class DetalleHospedaje extends BaseModel {
  static table = 'detalle_hospedajes'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare hospedajeId: number

  @column()
  declare productoId: number

  @column()
  declare cantidad: number

  @column()
  declare costo: number

  @column()
  declare precioVenta: number

  @belongsTo(() => Hospedaje, {
    foreignKey: 'hospedajeId',
  })
  declare hospedaje: BelongsTo<typeof Hospedaje>

  @belongsTo(() => Producto, {
    foreignKey: 'productoId',
  })
  declare producto: BelongsTo<typeof Producto>
}
