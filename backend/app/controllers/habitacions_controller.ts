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
        SELECT habitaciones.id, habitaciones.nombre, obtener_estado_habitacion(habitaciones.id,DATE_SUB(NOW(), INTERVAL 6 HOUR)) AS estado, obtenerInfoEstado(habitaciones.id,estado,DATE_SUB(NOW(), INTERVAL 6 HOUR)) AS numMinutos, clases_habitaciones.nombre AS clase, habitaciones.tarifa
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
        SELECT habitaciones.id, habitaciones.nombre, obtener_estado_habitacion(habitaciones.id,DATE_SUB(NOW(), INTERVAL 6 HOUR)) AS estado, obtenerInfoEstado(habitaciones.id,estado,DATE_SUB(NOW(), INTERVAL 6 HOUR)) AS numMinutos, clases_habitaciones.nombre AS clase, habitaciones.tarifa
	      FROM habitaciones	INNER JOIN clases_habitaciones ON clases_habitaciones.id = habitaciones.clase_habitacion_id
	      WHERE (obtener_estado_habitacion(habitaciones.id,DATE_SUB(NOW(), INTERVAL 6 HOUR)) = 'O' OR obtener_estado_habitacion(habitaciones.id,DATE_SUB(NOW(), INTERVAL 6 HOUR)) = 'S')  AND habitaciones.anulado=0 AND habitaciones.nivel_id = ${params.id}
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
        SELECT  obtener_estado_habitacion(id,DATE_SUB(NOW(), INTERVAL 6 HOUR)) AS estado, 
        CASE WHEN obtener_estado_habitacion(id,DATE_SUB(NOW(), INTERVAL 6 HOUR))='R' THEN
        obtener_reservacion_proxima(id,DATE_SUB(NOW(), INTERVAL 6 HOUR))
        ELSE 0 END AS idReservacion
        FROM habitaciones WHERE id= ${params.idHabitacion}
      `)
      response.status(200).json({ habitacion: habitacion, info: data[0][0] })
    } catch (error) {
      response.status(500).json({ message: 'Error fetching habitaciones', error })
    }
  }

  async habitacionesDisponiblesReservaEnLinea({ request, response }: HttpContext) {
    try {
      const { claseHabitacionId, fechaInicio, fechaFin, numPersonas } = request.only([
        'claseHabitacionId',
        'fechaInicio',
        'fechaFin',
        'numPersonas',
      ])

      // Primero obtenemos todas las habitaciones que pertenecen a la clase de habitación proporcionada
      const habitacionesDisponibles = await Habitacion.query()
        .where('clase_habitacion_id', claseHabitacionId)
        .where('anulado', false) // Excluimos las habitaciones anuladas
        .where('numero_personas', '>=', numPersonas)
        .whereNotExists((reservacionQuery) => {
          reservacionQuery
            .from('reservaciones')
            .where('reservaciones.anulado', false)
            .whereRaw('reservaciones.habitacion_id = habitaciones.id')
            .where((subquery) => {
              // Verificar que la habitación no esté reservada en el rango de fechas
              subquery
                .whereBetween('reservaciones.fecha_inicio', [fechaInicio, fechaFin])
                .orWhereBetween('reservaciones.fecha_fin', [fechaInicio, fechaFin])
                .orWhere((innerQuery) => {
                  // También incluir las reservas que abarcan completamente el rango proporcionado
                  innerQuery
                    .where('reservaciones.fecha_inicio', '<=', fechaInicio)
                    .where('reservaciones.fecha_fin', '>=', fechaFin)
                })
            })
        })
        .preload('nivel')

      const otrasHabitacionesDisponibles = await Habitacion.query()
        .where('clase_habitacion_id', claseHabitacionId)
        .where('anulado', false) // Excluimos las habitaciones anuladas
        .where('numero_personas', '<', numPersonas)
        .whereNotExists((reservacionQuery) => {
          reservacionQuery
            .from('reservaciones')
            .where('reservaciones.anulado', false)
            .whereRaw('reservaciones.habitacion_id = habitaciones.id')
            .where((subquery) => {
              // Verificar que la habitación no esté reservada en el rango de fechas
              subquery
                .whereBetween('reservaciones.fecha_inicio', [fechaInicio, fechaFin])
                .orWhereBetween('reservaciones.fecha_fin', [fechaInicio, fechaFin])
                .orWhere((innerQuery) => {
                  // También incluir las reservas que abarcan completamente el rango proporcionado
                  innerQuery
                    .where('reservaciones.fecha_inicio', '<=', fechaInicio)
                    .where('reservaciones.fecha_fin', '>=', fechaFin)
                })
            })
        })
        .preload('nivel')

      return response.ok({ habitacionesDisponibles, otrasHabitacionesDisponibles })
    } catch (error) {
      return response.internalServerError({
        message: 'Error obteniendo habitaciones disponibles',
        error,
      })
    }
  }
}
