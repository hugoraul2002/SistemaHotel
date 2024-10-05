import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Factura from '#models/factura'
import BitacoraAnulacion from '#models/bitacora_anulacion'
import DetalleFactura from '#models/detalle_factura'
import Producto from '#models/producto'
import HojaVidaProducto from '#models/hoja_vida_producto'
import PDFDocument from 'pdfkit'
import fs from 'node:fs'
interface Empresa {
  nombreComercial: string
  nombreJuridico: string
  nit: string
  direccion: string
  telefono: string
  regimenISR: string
}

export default class FacturasController {
  async index({ response }: HttpContext) {
    try {
      const hospedajes = await Factura.query().preload('usuario').preload('hospedaje')
      return response.ok(hospedajes)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching lodgings', error })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'hospedajeId',
      'userId',
      'numFactura',
      'nit',
      'nombreFacturado',
      'direccionFacturado',
      'numeroFel',
      'serieFel',
      'autorizacionFel',
      'emisionFel',
      'certificacionFel',
      'fechaRegistro',
      'anulado',
      'total',
    ])
    console.log(data)
    try {
      const factura = await Factura.create(data)
      return response.created(factura)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error creating factura', error })
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    try {
      const factura = await Factura.findOrFail(id)
      return response.ok(factura)
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching factura', error })
    }
  }

  async generarTicket({ params, response }: HttpContext) {
    const { id } = params
    const empresaData: Empresa = {
      nombreComercial: 'HOTEL MARGARITA',
      nombreJuridico: 'Super Hotel S.A.',
      nit: '123456789',
      direccion: 'Av. Principal #123, Petén, Guatemala',
      telefono: '4110-8778',
      regimenISR: 'SUJETO A PAGOS TRIMESTRALES ISR',
    }
    try {
      // Obtener factura y detalles
      const factura = await Factura.findOrFail(id)
      const detalleFactura = await DetalleFactura.query().where('facturaId', id).preload('producto')
      console.log(detalleFactura)
      // Crear nuevo documento PDF con tamaño 80mm de ancho
      const doc = new PDFDocument({
        size: [227, 841.89], // 227px ≈ 80mm, altura ajustable automáticamente
        margins: { top: 10, bottom: 10, left: 10, right: 10 },
      })

      // Definir ruta para guardar el PDF temporalmente
      const filePath = `./tickets/factura_${factura.id}.pdf`
      doc.pipe(fs.createWriteStream(filePath))

      // Añadir información de la empresa
      doc.fontSize(10).text(empresaData.nombreComercial, { align: 'center' })
      doc.text(`NIT: ${empresaData.nit}`, { align: 'center' })
      doc.text(`Dirección: ${empresaData.direccion}`, { align: 'center' })
      doc.text(`Teléfono: ${empresaData.telefono}`, { align: 'center' })
      doc.text(`Regimen ISR: ${empresaData.regimenISR}`, { align: 'center' })
      doc.moveDown()

      doc.fontSize(9).text(`Serie: ${factura.serieFel}`, { align: 'center' })
      doc.text(`DTE: ${factura.numeroFel}`, { align: 'center' })
      doc.text(`Autorizacion: ${factura.autorizacionFel}`, { align: 'center' })
      doc.moveDown()

      // Añadir información del cliente
      doc.text(`Cliente: ${factura.nombreFacturado}`)
      doc.text(`NIT Cliente: ${factura.nit}`)
      doc.text(`Dirección Cliente: ${factura.direccionFacturado}`)
      doc.moveDown()

      // Añadir detalles de la factura
      doc.fontSize(8).text('Descripcion')
      doc.text('Cant   P.Unit    Subtotal  Desc    Total')
      detalleFactura.forEach((detalle) => {
        doc.fontSize(8).text(detalle.producto.nombre) // Descripción en una línea
        // Datos debajo de la descripción
        doc.text(
          `${detalle.cantidad}      Q${detalle.precioVenta.toFixed(2)}      Q${(detalle.cantidad * detalle.precioVenta).toFixed(2)}      Q${detalle.descuento.toFixed(2)}      Q${(detalle.cantidad * detalle.precioVenta - detalle.descuento).toFixed(2)}`,
          { continued: false }
        )
        doc.moveDown(0.2)
      })

      // Total de la factura
      doc.moveDown()
      doc.fontSize(8.5).text(`Total: Q${factura.total.toFixed(2)}`, { align: 'right' })

      // Finalizar y cerrar el documento PDF
      doc.end()

      // Retornar el PDF como respuesta
      return response.download(filePath)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error generando el ticket', error })
    }
  }

  async reporteFactura({ request, response }: HttpContext) {
    try {
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin')
      const facturas = await db.rawQuery(`
        SELECT * FROM rptFacturas WHERE fecha >= '${fechaInicio}' AND fecha <= '${fechaFin}'
      `)
      response.status(200).json(facturas[0])
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching factura', error })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const data = request.only([
      'hospedajeId',
      'userId',
      'numFactura',
      'nit',
      'nombreFacturado',
      'direccionFacturado',
      'numeroFel',
      'serieFel',
      'autorizacionFel',
      'emisionFel',
      'certificacionFel',
      'fechaRegistro',
      'anulado',
      'total',
    ])
    try {
      const factura = await Factura.findOrFail(id)
      factura.merge(data)
      await factura.save()
      return response.ok(factura)
    } catch (error) {
      return response.internalServerError({ message: 'Error updating factura', error })
    }
  }

  async updateAnulado({ request, response }: HttpContext) {
    const data = request.only(['facturaId', 'motivo', 'userId', 'fecha'])
    console.log(data)
    try {
      const factura = await Factura.findOrFail(data.facturaId)
      factura.anulado = !factura.anulado
      await factura.save()

      console.log(data)
      await BitacoraAnulacion.create({
        facturaId: data.facturaId,
        userId: data.userId,
        motivo: data.motivo,
        fecha: data.fecha,
      })

      const detalles: DetalleFactura[] = await DetalleFactura.query().where(
        'facturaId',
        data.facturaId
      )

      for (const detalle of detalles) {
        const producto = await Producto.findOrFail(detalle.productoId)
        if (!producto.esServicio) {
          const existenciaAnterior = producto.existencia
          producto.existencia += detalle.cantidad
          await producto.save()

          await HojaVidaProducto.create({
            costo: detalle.costo,
            userId: data.userId,
            productoId: producto.id,
            existenciaAnterior: existenciaAnterior,
            cantidad: detalle.cantidad,
            existenciaActual: existenciaAnterior + detalle.cantidad,
            fecha: data.fecha,
            tipo: 'AFH',
            movimientoId: data.facturaId,
            detalle: 'Anulación de factura ' + factura.numFactura + ' por motivo: ' + data.motivo,
          })
        }
      }

      return response.ok(factura)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error updating lodging', error })
    }
  }
}
