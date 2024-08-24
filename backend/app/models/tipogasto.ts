import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Gasto from '#models/gasto'

export default class Tipogasto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipo: string

  @column()
  declare anulado: boolean

  @hasMany(() => Gasto, {
    foreignKey: 'tipoGastoId',
  })
  declare gastos: HasMany<typeof Gasto>
}
