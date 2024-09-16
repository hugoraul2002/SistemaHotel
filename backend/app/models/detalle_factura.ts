import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Factura from '#models/factura'
import Producto from '#models/producto'

export default class DetalleFactura extends BaseModel {
  static tableName = 'detalle_factura'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare facturaId: number

  @column()
  declare productoId: number

  @column()
  declare cantidad: number

  @column()
  declare costo: number

  @column()
  declare precioVenta: number

  @column()
  declare descuento: number

  @belongsTo(() => Factura, {
    foreignKey: 'facturaId',
  })
  declare factura: BelongsTo<typeof Factura>

  @belongsTo(() => Producto, {
    foreignKey: 'productoId',
  })
  declare producto: BelongsTo<typeof Producto>
}
