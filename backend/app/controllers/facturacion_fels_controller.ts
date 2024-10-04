import type { HttpContext } from '@adonisjs/core/http'
import * as fs from 'node:fs'
import * as path from 'node:path'
import env from '#start/env'
import * as soap from 'soap'
import * as xml2js from 'xml2js'
import Factura from '#models/factura'
import DetalleFactura from '#models/detalle_factura'
import Hospedaje from '#models/hospedaje'
import DetalleHospedaje from '#models/detalle_hospedaje'
import { DateTime } from 'luxon'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import Habitacion from '#models/habitacion'
import BitacoraAnulacion from '#models/bitacora_anulacion'
import Producto from '#models/producto'
import HojaVidaProducto from '#models/hoja_vida_producto'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename)
interface ItemFactura {
  TrnLiNum: number
  TrnArtCod: string
  TrnArtNom: string // nombre del producto
  TrnCan: number // cantidad
  TrnVUn: number // precio de venta
  TrnUniMed: string // unidad de medida (UNI)
  TrnVDes: number // descuento
  TrnArtBienSer: 'S' | 'B' // S si es servicio, B si no lo es
  TrnArtImpAdiCod: 0
  TrnArtImpAdiUniGrav: 0
}

export default class FacturacionFelController {
  private wsdlUrlConsultaNIT: string | undefined = env.get('wsdlUrlConsultaNIT')
  private wsdUrlFactura: string | undefined = env.get('wsdUrlFactura')
  private wsdUrlAnulacion: string | undefined = env.get('wsdUrlAnulacion')
  private cliente: string | undefined = env.get('CLIENTE_FEL')
  private usuario: string | undefined = env.get('USUARIO_FEL')
  private clave: string | undefined = env.get('CLAVE_FEL')
  private numEstablecimiento: string | undefined = env.get('ESTABLECIMIENTO_FEL')
  async consultarNIT({ params, response }: HttpContext) {
    const receptorId = params.nit

    try {
      const soapClient = await soap.createClientAsync(this.wsdlUrlConsultaNIT!)

      const args = {
        Cliente: this.cliente,
        Usuario: this.usuario,
        Clave: this.clave,
        Receptorid: receptorId,
      }

      const resultado: any = await new Promise((resolve, reject) => {
        soapClient.ReceptorInfo.ReceptorInfoSoapPort.Execute(args, (err: any, result: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })

      // Extraer la cadena XML contenida en el resultado
      const xml = resultado?.Informacion

      if (!xml) {
        return response.status(500).json({
          success: false,
          message: 'No se recibió información válida desde el servicio SOAP',
        })
      }

      // Usar xml2js para convertir el XML a JSON
      const parser = new xml2js.Parser()
      const parsedResult = await parser.parseStringPromise(xml)

      // Extraer los campos NIT, NOMBRE y DIRECCION
      const receptorInfo = parsedResult?.RECEPTOR
      if (!receptorInfo) {
        const errores = parsedResult?.Errores
        const error = errores?.Error?.[0]
        return response.status(200).json({
          success: false,
          error: error['_'],
          codigoError: error['$']['Codigo'],
        })
      }
      const nit = receptorInfo?.NIT?.[0] || ''
      const nombre = receptorInfo?.NOMBRE?.[0] || ''
      const direccion = receptorInfo?.DIRECCION?.[0] || ' '

      // Retornar la respuesta con los datos extraídos
      return response.status(200).json({
        success: true,
        data: {
          nit,
          nombre,
          direccion,
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al consumir el servicio SOAP',
        error: error.message,
      })
    }
  }

  async facturar({ request, response }: HttpContext) {
    const { cliente, usuario, clave, nitemisor, xmldoc } = request.only([
      'cliente',
      'usuario',
      'clave',
      'nitemisor',
      'xmldoc',
    ])

    try {
      // Crear el cliente SOAP para la facturación
      const soapClient = await soap.createClientAsync(this.wsdUrlFactura!)

      // Definir los parámetros que se enviarán en la petición
      const args = {
        Cliente: cliente,
        Usuario: usuario,
        Clave: clave,
        Nitemisor: nitemisor,
        Xmldoc: xmldoc,
      }

      // Ejecutar la función SOAP usando Promesas
      const resultado: any = await new Promise((resolve, reject) => {
        soapClient.Documento.DocumentoSoapPort.Execute(args, (err: any, result: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })

      // Extraer la cadena XML contenida en el resultado
      const xml = resultado?.Respuesta

      if (!xml) {
        return response.status(500).json({
          success: false,
          message: 'No se recibió información válida desde el servicio SOAP',
        })
      }

      // Usar xml2js para convertir el XML a JSON
      const parser = new xml2js.Parser()
      const parsedResult = await parser.parseStringPromise(xml)

      // Manejo de error basado en el ejemplo de XML de error
      const errores = parsedResult?.Errores
      if (errores) {
        const error = errores?.Error?.[0]
        return response.status(500).json({
          success: false,
          error: error['_'],
          codigoError: error['$']['Codigo'],
        })
      }

      // Manejo de respuesta correcta basado en el ejemplo de XML exitoso
      const DTE = parsedResult?.DTE
      if (!DTE) {
        return response.status(500).json({
          success: false,
          error: 'Formato de respuesta no esperado',
        })
      }

      const fechaEmision = DTE['$']['FechaEmision']
      const fechaCertificacion = DTE['$']['FechaCertificacion']
      const numeroAutorizacion = DTE['$']['NumeroAutorizacion']
      const serie = DTE['$']['Serie']
      const numero = DTE['$']['Numero']
      const xmlDTE = DTE?.Xml?.[0] || ''
      const pdfDTE = DTE?.Pdf?.[0] || ''

      // Retornar la respuesta con los datos extraídos
      return response.status(200).json({
        success: true,
        data: {
          fechaEmision,
          fechaCertificacion,
          numeroAutorizacion,
          serie,
          numero,
          xmlDTE,
          pdfDTE,
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al consumir el servicio SOAP',
        error: error.message,
      })
    }
  }

  async facturarHospedaje(xmldoc: string, numFactura: number) {
    try {
      // Crear el cliente SOAP para la facturación
      const soapClient = await soap.createClientAsync(this.wsdUrlFactura!)

      // Definir los parámetros que se enviarán en la petición
      const args = {
        Cliente: this.cliente,
        Usuario: this.usuario,
        Clave: this.clave,
        Nitemisor: this.cliente,
        Xmldoc: xmldoc,
      }

      // Ejecutar la función SOAP usando Promesas
      const resultado: any = await new Promise((resolve, reject) => {
        soapClient.Documento.DocumentoSoapPort.Execute(args, (err: any, result: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
      // Extraer la cadena XML contenida en el resultado
      const xml = resultado?.Respuesta

      if (!xml) {
        return {
          success: false,
          message: 'No se recibió información válida desde el servicio SOAP',
        }
      }
      const parser = new xml2js.Parser()
      const parsedResult = await parser.parseStringPromise(xml)

      const DTE = parsedResult?.DTE
      if (!DTE) {
        return {
          success: false,
          error: 'Formato de respuesta no esperado',
        }
      }

      const fechaEmision = DTE['$']['FechaEmision']
      const fechaCertificacion = DTE['$']['FechaCertificacion']
      const numeroAutorizacion = DTE['$']['NumeroAutorizacion']
      const serie = DTE['$']['Serie']
      const numero = DTE['$']['Numero']

      const factura = await Factura.findByOrFail('numFactura', numFactura)
      factura.numeroFel = numero
      factura.autorizacionFel = numeroAutorizacion
      factura.serieFel = serie
      await factura.save()
      // Guardar el XML en la carpeta `xmlFel` con el número de factura
      const filePath = path.join(__dirname, '..', 'xmlFel', `${numFactura}.xml`)
      fs.writeFileSync(filePath, xml, 'utf8')

      return {
        success: true,
        message: 'Hospedaje facturado correctamente',
      }
    } catch (error) {
      console.log('Error al consumir el servicio SOAP:', error)
      console.error('Error al facturar hospedaje:', error)
    }
  }

  async registraFacturaFromHospedaje({ request, response }: HttpContext) {
    try {
      const hospedajeId = request.input('hospedajeId')
      const detalles = await DetalleHospedaje.query().where('hospedajeId', hospedajeId)

      const { nit, nombre, direccion, fecha, usuarioId } = request.only([
        'nit',
        'nombre',
        'direccion',
        'fecha',
        'usuarioId',
      ])

      let total = 0
      for (const detalle of detalles) {
        total += detalle.precioVenta * detalle.cantidad - detalle.descuento
      }

      const numFactura = await Factura.getNextNumFactura()

      // Crear factura
      const factura = await Factura.create({
        hospedajeId: hospedajeId,
        nit: nit,
        numFactura: numFactura,
        userId: usuarioId,
        nombreFacturado: nombre,
        direccionFacturado: direccion,
        total: total,
        fechaRegistro: fecha,
        anulado: false,
      })

      const detallesFactura: DetalleFactura[] = await Promise.all(
        detalles.map(async (detalle) => {
          const detalleFactura = await DetalleFactura.create({
            facturaId: factura.id,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            costo: detalle.costo,
            descuento: detalle.descuento,
            precioVenta: detalle.precioVenta,
          })
          await detalleFactura.load('producto')
          return detalleFactura
        })
      )

      const hospedaje = await Hospedaje.query().where('id', hospedajeId).first()
      if (hospedaje) {
        hospedaje.facturado = true
        await hospedaje.save()
        const habitacion = await Habitacion.query().where('id', hospedaje.habitacionId).first()
        if (habitacion) {
          habitacion.estado = 'D'
          await habitacion.save()
        }
      }

      // Datos generales de la factura
      const datosGenerales = {
        TrnEstNum: this.numEstablecimiento,
        TipTrnCod: 'FACT',
        TrnNum: 444 + factura.id,
        TrnFec: fecha.split(' ')[0],
        MonCod: 'GTQ',
        TrnBenConNIT: nit,
        TrnExp: 0,
        TrnExento: 0,
        TrnFraseTipo: 0,
        TrnEscCod: 0,
        TrnEFACECliNom: nombre,
        TrnEFACECliDir: direccion.trim(),
      }

      const items: ItemFactura[] = detallesFactura.map((detalle, index) => ({
        TrnLiNum: index + 1,
        TrnArtCod: detalle.producto?.codigo,
        TrnArtNom: detalle.producto?.nombre,
        TrnCan: detalle.cantidad,
        TrnVUn: detalle.precioVenta,
        TrnUniMed: 'UNI',
        TrnVDes: detalle.descuento,
        TrnArtBienSer: detalle.producto?.esServicio ? 'S' : 'B',
        TrnArtImpAdiCod: 0,
        TrnArtImpAdiUniGrav: 0,
      }))

      const builder = new xml2js.Builder({ headless: true })
      const xmlDoc = builder.buildObject({
        stdTWS: {
          $: { xmlns: 'FEL' },
          TrnEstNum: datosGenerales.TrnEstNum,
          TipTrnCod: datosGenerales.TipTrnCod,
          TrnNum: datosGenerales.TrnNum,
          TrnFec: datosGenerales.TrnFec,
          MonCod: datosGenerales.MonCod,
          TrnBenConNIT: datosGenerales.TrnBenConNIT,
          TrnExp: datosGenerales.TrnExp,
          TrnExento: datosGenerales.TrnExento,
          TrnFraseTipo: datosGenerales.TrnFraseTipo,
          TrnEscCod: datosGenerales.TrnEscCod,
          TrnEFACECliNom: datosGenerales.TrnEFACECliNom,
          TrnEFACECliDir: datosGenerales.TrnEFACECliDir,
          stdTWSD: {
            'stdTWS.stdTWSCIt.stdTWSDIt': items.map((item) => ({
              TrnLiNum: item.TrnLiNum,
              TrnArtCod: item.TrnArtCod,
              TrnArtNom: item.TrnArtNom,
              TrnCan: item.TrnCan,
              TrnVUn: item.TrnVUn,
              TrnUniMed: item.TrnUniMed,
              TrnVDes: item.TrnVDes,
              TrnArtBienSer: item.TrnArtBienSer,
              TrnArtImpAdiCod: item.TrnArtImpAdiCod,
              TrnArtImpAdiUniGrav: item.TrnArtImpAdiUniGrav,
            })),
          },
        },
      })

      // Registrar la facturación
      const certificar = await this.facturarHospedaje(xmlDoc, numFactura)
      if (certificar?.success) {
        return response.status(200).json({
          success: true,
          message: 'Facturación registrada exitosamente',
          numFactura: numFactura,
        })
      }
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al registrar la facturación',
        error: error.message,
      })
    }
  }

  async extraerPDF({ params, response }: HttpContext) {
    try {
      // Ruta del archivo XML generado previamente (ubicado en xmlFel)
      const numFactura = params.numFactura
      const filePath = path.join(__dirname, '..', 'xmlFel', `${numFactura}.xml`)

      // Verificar si el archivo XML existe
      if (!fs.existsSync(filePath)) {
        return response.status(404).json({
          success: false,
          message: 'Archivo XML no encontrado',
        })
      }

      // Leer el archivo XML
      const xmlData = fs.readFileSync(filePath, 'utf8')

      // Convertir el XML a JSON usando xml2js
      const parser = new xml2js.Parser()
      const parsedResult = await parser.parseStringPromise(xmlData)

      // Extraer el PDF en base64 del XML
      const pdfBase64 = parsedResult?.DTE?.Pdf?.[0]
      if (!pdfBase64) {
        return response.status(404).json({
          success: false,
          message: 'El PDF no se encontró en el XML',
        })
      }

      // Decodificar el base64 si es necesario y enviarlo como respuesta
      const pdfBuffer = Buffer.from(pdfBase64, 'base64')

      // Devolver el PDF en la respuesta (enviándolo como archivo PDF)
      response.header('Content-Type', 'application/pdf')
      response.header('Content-Disposition', `attachment; filename="Factura_${numFactura}.pdf"`)
      return response.send(pdfBuffer)
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al procesar el archivo XML',
        error: error.message,
      })
    }
  }

  async anularFactura({ request, response }: HttpContext) {
    const data = request.only([
      'idFactura',
      'numAutorizacion',
      'motivoAnulacion',
      'idUsuario',
      'fechaAnulacion',
    ])

    try {
      const soapClient = await soap.createClientAsync(this.wsdUrlAnulacion!)

      const args = {
        Cliente: this.cliente,
        Usuario: this.usuario,
        Clave: this.clave,
        Nitemisor: this.cliente,
        Numautorizacionuuid: data.numAutorizacion,
        Motivoanulacion: data.motivoAnulacion,
      }
      const resultado: any = await new Promise((resolve, reject) => {
        soapClient.Anulacion.AnulacionSoapPort.Execute(args, (err: any, result: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
      // Extraer la cadena XML contenida en el resultado
      const xml = resultado?.Respuesta

      if (!xml) {
        return response.status(500).json({
          success: false,
          message: 'No se recibió información válida desde el servicio SOAP',
        })
      }

      // Usar xml2js para convertir el XML a JSON
      const parser = new xml2js.Parser()
      const parsedResult = await parser.parseStringPromise(xml)

      // Extraer los campos NIT, NOMBRE y DIRECCION
      const receptorInfo = parsedResult?.DTE
      if (!receptorInfo) {
        const errores = parsedResult?.Errores
        const error = errores?.Error?.[0]
        return response.status(200).json({
          success: false,
          error: error['_'],
          codigoError: error['$']['Codigo'],
        })
      }

      const factura = await Factura.findOrFail(data.idFactura)
      factura.anulado = true
      factura.save()

      await BitacoraAnulacion.create({
        facturaId: data.idFactura,
        userId: data.idUsuario,
        motivo: data.motivoAnulacion,
        fecha: data.fechaAnulacion,
      })

      // logica para regresar productos al inventario al anular
      const detalles: DetalleFactura[] = await DetalleFactura.query().where(
        'facturaId',
        data.idFactura
      )

      for (const detalle of detalles) {
        const producto = await Producto.findOrFail(detalle.productoId)
        if (!producto.esServicio) {
          const existenciaAnterior = producto.existencia
          producto.existencia += detalle.cantidad
          await producto.save()

          await HojaVidaProducto.create({
            costo: detalle.costo,
            userId: data.idUsuario,
            productoId: producto.id,
            existenciaAnterior: existenciaAnterior,
            cantidad: detalle.cantidad,
            existenciaActual: existenciaAnterior + detalle.cantidad,
            fecha: data.fechaAnulacion,
            tipo: 'AFH',
            movimientoId: data.idFactura,
            detalle:
              'Anulación de factura ' + factura.numFactura + ' por motivo: ' + data.motivoAnulacion,
          })
        }
      }

      // Retornar la respuesta con los datos extraídos
      return response.status(200).json({
        success: true,
        data: {
          mensaje: 'Factura anulada',
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al consumir el servicio SOAP',
        error: error.message,
      })
    }
  }
}
