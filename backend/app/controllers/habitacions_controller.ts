import type { HttpContext } from '@adonisjs/core/http'
import Habitacion from '#models/habitacion'
import { habitacionValidator } from '#validators/habitacion'
import db from '@adonisjs/lucid/services/db'

export default class HabitacionController {
  async index({ response }: HttpContext) {
    try {
      const habitaciones = await Habitacion.query()
        .where('anulado', false)
        .preload('nivel')
        .preload('claseHabitacion')
      response.status(200).json(habitaciones)
    } catch (error) {
      response.status(500).json({ message: 'Error fetching habitaciones', error })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(habitacionValidator)
      const habitacion = await Habitacion.create(data)
      response.status(201).json(habitacion)
    } catch (error) {
      response.status(500).json({ message: 'Error creating habitacion', error })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.query()
        .where('id', params.id)
        .preload('nivel')
        .preload('claseHabitacion')
        .firstOrFail()
      response.status(200).json(habitacion)
    } catch (error) {
      response.status(404).json({ message: 'Habitacion not found', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.findOrFail(params.id)
      const data = request.only([
        'nombre',
        'nivelId',
        'claseHabitacionId',
        'precio',
        'tarifa',
        'estado',
        'numeroPersonas',
        'anulado',
      ])
      habitacion.merge(data)
      await habitacion.save()
      response.status(200).json(habitacion)
    } catch (error) {
      response.status(500).json({ message: 'Error updating habitacion', error })
    }
  }

  async updateAnulado({ params, request, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.findOrFail(params.id)
      const data = request.only(['anulado'])
      habitacion.merge(data)
      await habitacion.save()
      response.status(200).json(habitacion)
    } catch (error) {
      response.status(500).json({ message: 'Error updating habitacion', error })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.findOrFail(params.id)
      await habitacion.delete()
      response.status(200).json({ message: 'Habitacion deleted successfully' })
    } catch (error) {
      response.status(500).json({ message: 'Error deleting habitacion', error })
    }
  }

  async getHabitacionesRecepcion({ params, response }: HttpContext) {
    try {
      const habitaciones = await db.rawQuery(`
        SELECT habitaciones.id, habitaciones.nombre, obtener_estado_habitacion(habitaciones.id,NOW()) AS estado, obtenerInfoEstado(habitaciones.id,estado,NOW()) AS numMinutos, clases_habitaciones.nombre AS clase, habitaciones.tarifa
	      FROM habitaciones	INNER JOIN clases_habitaciones ON clases_habitaciones.id = habitaciones.clase_habitacion_id
	      WHERE habitaciones.anulado=0 AND habitaciones.nivel_id = ${params.id}
      `)
      response.status(200).json(habitaciones[0])
    } catch (error) {
      response.status(500).json({ message: 'Error fetching habitaciones', error })
    }
  }

  async gethabitacionesSalidas({ params, response }: HttpContext) {
    try {
      const habitaciones = await db.rawQuery(`
        SELECT habitaciones.id, habitaciones.nombre, obtener_estado_habitacion(habitaciones.id,NOW()) AS estado, obtenerInfoEstado(habitaciones.id,estado,NOW()) AS numMinutos, clases_habitaciones.nombre AS clase, habitaciones.tarifa
	      FROM habitaciones	INNER JOIN clases_habitaciones ON clases_habitaciones.id = habitaciones.clase_habitacion_id
	      WHERE (obtener_estado_habitacion(habitaciones.id,NOW()) = 'O' OR obtener_estado_habitacion(habitaciones.id,NOW()) = 'S')  AND habitaciones.anulado=0 AND habitaciones.nivel_id = ${params.id}
      `)
      response.status(200).json(habitaciones[0])
    } catch (error) {
      response.status(500).json({ message: 'Error fetching habitaciones', error })
    }
  }
  async getReservacionProxima({ params, response }: HttpContext) {
    try {
      const habitacion = await Habitacion.query()
        .where('id', params.idHabitacion)
        .preload('nivel')
        .preload('claseHabitacion')
        .firstOrFail()

      const data = await db.rawQuery(`
        SELECT  obtener_estado_habitacion(id,NOW()) AS estado, 
        CASE WHEN obtener_estado_habitacion(id,NOW())='R' THEN
        obtener_reservacion_proxima(id,NOW())
        ELSE 0 END AS idReservacion
        FROM habitaciones WHERE id= ${params.idHabitacion}
      `)
      response.status(200).json({ habitacion: habitacion, info: data[0][0] })
    } catch (error) {
      response.status(500).json({ message: 'Error fetching habitaciones', error })
    }
  }
}
