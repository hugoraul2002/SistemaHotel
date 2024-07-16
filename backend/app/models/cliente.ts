import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUsuario: number

  @column()
  declare tipoDocumento: 'NIT' | 'CUI' | 'IDE'

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
}
