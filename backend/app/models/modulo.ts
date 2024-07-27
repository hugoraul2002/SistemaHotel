import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Rol from '#models/rol'

export default class Modulo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @manyToMany(() => Rol)
  declare roles: ManyToMany<typeof Rol>
}
