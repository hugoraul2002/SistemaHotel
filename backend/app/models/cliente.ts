import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Reservacion from '#models/reservacion'
export default class Cliente extends BaseModel {
  static table = 'clientes'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare tipoDocumento: string

  @column()
  declare numDocumento: string

  @column()
  declare nombre: string

  @column()
  declare telefono: string

  @column()
  declare direccion: string

  @column()
  declare activo: boolean

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Reservacion, {
    foreignKey: 'clienteId',
  })
  declare reservaciones: HasMany<typeof Reservacion>
}
