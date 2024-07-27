import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Modulo from '#models/modulo'

export default class Rol extends BaseModel {
  static table = 'roles'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @hasMany(() => User, {
    foreignKey: 'rolId',
  })
  declare users: HasMany<typeof User>

  @manyToMany(() => Modulo)
  declare modulos: ManyToMany<typeof Modulo>
}
