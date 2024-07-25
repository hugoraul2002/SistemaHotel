import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, belongsTo } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Cliente from '#models/cliente'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Rol from '#models/rol'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare full_name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare rolId: number

  @column()
  declare anulado: boolean

  @hasOne(() => Cliente, {
    foreignKey: 'userId',
  })
  declare cliente: HasOne<typeof Cliente>

  @belongsTo(() => Rol, {
    foreignKey: 'rolId',
  })
  declare rol: BelongsTo<typeof Rol>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '2 days',
  })
}
