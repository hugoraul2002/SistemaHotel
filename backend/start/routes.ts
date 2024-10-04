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
const FacturasController = () => import('#controllers/facturas_controller')
const ProductosController = () => import('#controllers/productos_controller')
const DetalleHospedaje = () => import('#controllers/detalle_hospedajes_controller')
const HospedajesController = () => import('#controllers/hospedajes_controller')
const ClientesController = () => import('#controllers/clientes_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const RolsController = () => import('#controllers/rols_controller')
const NivelesController = () => import('#controllers/nivels_controller')
const HabitacionsController = () => import('#controllers/habitacions_controller')
const ReservacionsController = () => import('#controllers/reservacions_controller')
const ClaseHabitacionsController = () => import('#controllers/clase_habitacions_controller')
const AperturaCajasController = () => import('#controllers/apertura_cajas_controller')
const ArqueoCajasController = () => import('#controllers/arqueo_cajas_controller')
const CierreCajasController = () => import('#controllers/cierre_cajas_controller')
const GastosController = () => import('#controllers/gastos_controller')
const TiposGastosController = () => import('#controllers/tipogastos_controller')
const ProveedoresController = () => import('#controllers/proveedors_controller')
const FacturacionFelController = () => import('#controllers/facturacion_fels_controller')
const OpcionPagosController = () => import('#controllers/opcion_pagos_controller')
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

// Rutas de usuarios
router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.post('/store', [UsersController, 'store'])
    router.get('/:id', [UsersController, 'show'])
    router.put('/update/:id', [UsersController, 'update'])
    router.put('/updateAnulado/:id', [UsersController, 'updateAnulado'])
  })
  .prefix('usuarios')
  .use(middleware.auth())

// Rutas de clientes
router
  .group(() => {
    router.post('/', [ClientesController, 'index'])
    router.post('/store', [ClientesController, 'store'])
    router.get('/:id', [ClientesController, 'show'])
    router.put('/update/:id', [ClientesController, 'update'])
    router.put('/updateActivo/:id', [ClientesController, 'updateActivo'])
  })
  .prefix('clientes')
  .use(middleware.auth())

// Rutas de roles
router
  .group(() => {
    router.get('/', [RolsController, 'index'])
    router.post('/store', [RolsController, 'store'])
    router.get('/:id', [RolsController, 'show'])
    router.post('/update/:id', [RolsController, 'update'])
  })
  .prefix('roles')
  .use(middleware.auth())

// Rutas de niveles
router
  .group(() => {
    router.get('/', [NivelesController, 'index'])
    router.post('/store', [NivelesController, 'store'])
    router.get('/:id', [NivelesController, 'show'])
    router.put('/update/:id', [NivelesController, 'update'])
    router.put('/updateAnulado/:id', [NivelesController, 'updateAnulado'])
    router.delete('/:id', [NivelesController, 'destroy'])
  })
  .prefix('nivel')
  .use(middleware.auth())

// Rutas de reservaciones
router
  .group(() => {
    router.get('/', [ReservacionsController, 'index'])
    router.post('/store', [ReservacionsController, 'store'])
    router.get('/:id', [ReservacionsController, 'show'])
    router.put('/update/:id', [ReservacionsController, 'update'])
    router.put('/updateAnulado/:id', [ReservacionsController, 'updateAnulado'])
    router.delete('/:id', [ReservacionsController, 'destroy'])
  })
  .prefix('reservaciones')
  .use(middleware.auth())

// Rutas de habitaciones
router
  .group(() => {
    router.get('/', [ClaseHabitacionsController, 'index'])
    router.post('/store', [ClaseHabitacionsController, 'store'])
    router.get('/:id', [ClaseHabitacionsController, 'show'])
    router.put('/update/:id', [ClaseHabitacionsController, 'update'])
    router.put('/updateAnulado/:id', [ClaseHabitacionsController, 'updateAnulado'])
    router.delete('/:id', [ClaseHabitacionsController, 'destroy'])
  })
  .prefix('claseHabitacion')
  .use(middleware.auth())

// Rutas de habitaciones
router
  .group(() => {
    router.get('/', [HabitacionsController, 'index'])
    router.get('/recepcion/:id', [HabitacionsController, 'recepcion'])
    router.get('/salidas/:id', [HabitacionsController, 'habitacionesSalidas'])
    router.get('/getReservacionProxima/:idHabitacion', [
      HabitacionsController,
      'getReservacionProxima',
    ])
    router.post('/store', [HabitacionsController, 'store'])
    router.get('/:id', [HabitacionsController, 'show'])
    router.put('/update/:id', [HabitacionsController, 'update'])
    router.put('/updateAnulado/:id', [HabitacionsController, 'updateAnulado'])
    router.delete('/:id', [HabitacionsController, 'destroy'])
  })
  .prefix('habitaciones')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [HospedajesController, 'index'])
    router.post('/store', [HospedajesController, 'store'])
    router.get('/:id', [HospedajesController, 'show'])
    router.get('/activo/:id', [HospedajesController, 'activoByIdHabitacion'])
    router.put('/update/:id', [HospedajesController, 'update'])
    // router.put('/updateAnulado/:id', [HospedajesController, 'updateAnulado'])
  })
  .prefix('hospedajes')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [DetalleHospedaje, 'index'])
    router.post('/store', [DetalleHospedaje, 'store'])
    router.get('/:id', [DetalleHospedaje, 'show'])
    router.get('/hospedaje/:id', [DetalleHospedaje, 'detallesByIdHospedaje'])
    router.put('/update/:id', [DetalleHospedaje, 'update'])
    router.post('/delete', [DetalleHospedaje, 'destroy'])
  })
  .prefix('detalleHospedajes')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/', [ProductosController, 'index']),
      router.post('/store', [ProductosController, 'store']),
      router.get('/:id', [ProductosController, 'show']),
      router.put('/update/:id', [ProductosController, 'update']),
      router.put('/updateActivo/:id', [ProductosController, 'updateActivo'])
  })
  .prefix('productos')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/', [AperturaCajasController, 'index'])
    router.post('/store', [AperturaCajasController, 'store'])
    router.get('/:id', [AperturaCajasController, 'show'])
    router.get('/activa/:id', [AperturaCajasController, 'aperturaActiva'])
    router.put('/update/:id', [AperturaCajasController, 'update'])
    router.put('/updateAnulado/:id', [AperturaCajasController, 'updateAnulado'])
  })
  .prefix('aperturaCaja')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [ArqueoCajasController, 'index'])
    router.post('/store', [ArqueoCajasController, 'store'])
    router.get('/:id', [ArqueoCajasController, 'show'])
    router.put('/update/:id', [ArqueoCajasController, 'update'])
  })
  .prefix('arqueoCaja')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [CierreCajasController, 'index'])
    router.post('/store', [CierreCajasController, 'store'])
    router.get('/:id', [CierreCajasController, 'show'])
    router.get('/transaccionesCierre/:idApertura', [CierreCajasController, 'transaccionesCierre'])
    router.get('/encabezadoCierre/:idApertura', [CierreCajasController, 'encabezadoCierre'])
    router.put('/update/:id', [CierreCajasController, 'update'])
    router.put('/updateAnulado/:id', [CierreCajasController, 'updateAnulado'])
  })
  .prefix('cierreCaja')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/', [TiposGastosController, 'index'])
    router.post('/store', [TiposGastosController, 'store'])
    router.get('/:id', [TiposGastosController, 'show'])
    router.put('/update/:id', [TiposGastosController, 'update'])
    router.put('/updateAnulado/:id', [TiposGastosController, 'updateAnulado'])
  })
  .prefix('tiposGastos')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/', [GastosController, 'index'])
    router.post('/store', [GastosController, 'store'])
    router.get('/:id', [GastosController, 'show'])
    router.post('/reporteGastos', [GastosController, 'reporteGastos'])
    router.put('/update/:id', [GastosController, 'update'])
    router.put('/updateAnulado/:id', [GastosController, 'updateAnulado'])
  })
  .prefix('gastos')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/', [ProveedoresController, 'index'])
    router.post('/store', [ProveedoresController, 'store'])
    router.get('/:id', [ProveedoresController, 'show'])
    router.put('/update/:id', [ProveedoresController, 'update'])
    router.put('/updateAnulado/:id', [ProveedoresController, 'updateActivo'])
  })
  .prefix('proveedores')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/consultaNit/:nit', [FacturacionFelController, 'consultarNIT'])
    router.get('/extraerPDF/:numFactura', [FacturacionFelController, 'extraerPDF'])
    router.post('/facturar/', [FacturacionFelController, 'facturar'])
    router.post('/facturarHospedaje/', [FacturacionFelController, 'registraFacturaFromHospedaje']),
      router.post('/anularFactura/', [FacturacionFelController, 'anularFactura'])
  })
  .prefix('fel')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/reporteFactura/', [FacturasController, 'reporteFactura'])
    router.post('/anularFactura/', [FacturasController, 'updateAnulado'])
  })
  .prefix('facturas')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [OpcionPagosController, 'index'])
    router.post('/store', [OpcionPagosController, 'store'])
    router.get('/:id', [OpcionPagosController, 'show'])
    router.get('/documento/:tipo/:id', [OpcionPagosController, 'getByDocumento'])
  })
  .prefix('opcionPago')
  .use(middleware.auth())
