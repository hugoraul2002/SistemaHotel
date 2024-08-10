import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Hospedaje extends BaseModel {
  static table = 'hospedajes'
  @column({ isPrimary: true })
  declare id: number
}
