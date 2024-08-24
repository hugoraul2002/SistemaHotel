import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Proveedor from '#models/proveedor'
import User from '#models/user'
import TipoGasto from '#models/tipogasto'

export default class Gasto extends BaseModel {
  static table = 'gastos'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare tipoGastoId: number

  @column()
  declare proveedorId: number

  @column()
  declare descripcion: string

  @column()
  declare monto: number

  @column()
  declare fecha: Date

  @column()
  declare anulado: boolean

  @belongsTo(() => TipoGasto, {
    foreignKey: 'tipoGastoId',
  })
  declare tipoGasto: BelongsTo<typeof TipoGasto>

  @belongsTo(() => Proveedor, {
    foreignKey: 'proveedorId',
  })
  declare proveedor: BelongsTo<typeof Proveedor>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare usuario: BelongsTo<typeof User>
}
