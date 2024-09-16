import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import DetalleFactura from '#models/detalle_factura'
import Hospedaje from '#models/hospedaje'
import User from '#models/user'

export default class Factura extends BaseModel {
  static tableName = 'facturas'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare hospedajeId: number

  @column()
  declare userId: number

  @column()
  declare numFactura: number

  @column()
  declare nit: string

  @column()
  declare nombreFacturado: string

  @column()
  declare direccionFacturado: string

  @column()
  declare numeroFel: string

  @column()
  declare serieFel: string

  @column()
  declare autorizacionFel: string

  @column()
  declare emisionFel: DateTime

  @column()
  declare certificacionFel: DateTime

  @column()
  declare fechaRegistro: DateTime

  @column()
  declare total: number

  @column()
  declare anulado: boolean

  @hasMany(() => DetalleFactura, {
    foreignKey: 'hospedajeId',
  })
  declare detalles: HasMany<typeof DetalleFactura>

  @belongsTo(() => User, {
    foreignKey: 'usuarioId',
  })
  declare usuario: BelongsTo<typeof User>

  @belongsTo(() => Hospedaje, {
    foreignKey: 'hospedajeId',
  })
  declare hospedaje: BelongsTo<typeof Hospedaje>

  // Método estático para obtener el próximo número de factura
  static async getNextNumFactura(): Promise<number> {
    // Busca el máximo número de factura
    const result = await this.query().max('num_factura as max').first()

    // Si no hay facturas, devuelve 1; de lo contrario, devuelve el máximo + 1
    return result?.$extras?.max ? result.$extras.max + 1 : 1
  }
}
