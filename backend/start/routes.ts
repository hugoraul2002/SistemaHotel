/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ClientesController = () => import('#controllers/clientes_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const RolsController = () => import('#controllers/rols_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Rutas de autenticación
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/registerCliente', [AuthController, 'registerCliente'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('auth')

router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.post('/store', [UsersController, 'store'])
    router.get('/:id', [UsersController, 'show'])
    router.put('/update/:id', [UsersController, 'update'])
    router.put('/updateAnulado/:id', [UsersController, 'updateAnulado'])
  })
  .prefix('usuarios')

// Rutas de clientes
router
  .group(() => {
    router.get('/', [ClientesController, 'index'])
    router.post('/store', [ClientesController, 'store'])
    router.get('/:id', [ClientesController, 'show'])
    router.post('/update/:id', [ClientesController, 'update'])
  })
  .prefix('clientes')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [RolsController, 'index'])
    router.post('/store', [RolsController, 'store'])
    router.get('/:id', [RolsController, 'show'])
    router.post('/update/:id', [RolsController, 'update'])
  })
  .prefix('roles')
