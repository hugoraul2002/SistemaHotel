import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import * as soap from 'soap'
import * as xml2js from 'xml2js'
import Factura from '#models/factura'
import DetalleFactura from '#models/detalle_factura'
import Hospedaje from '#models/hospedaje'
import DetalleHospedaje from '#models/detalle_hospedaje'

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
  private wsdlUrlConsultaNIT: string =
    'http://pruebas.ecofactura.com.gt:8080/fel/areceptorinfo?wsdl'
  private wsdUrlFactura: string = 'http://pruebas.ecofactura.com.gt:8080/fel/adocumento?wsdl'
  private cliente: string | undefined = env.get('CLIENTE_FEL')
  private usuario: string | undefined = env.get('USUARIO_FEL')
  private clave: string | undefined = env.get('CLAVE_FEL')
  private numEstablecimiento: string | undefined = env.get('ESTABLECIMIENTO_FEL')
  async consultarNIT({ params, response }: HttpContext) {
    // const { cliente, usuario, clave, receptorId } = request.only([
    //   'cliente',
    //   'usuario',
    //   'clave',
    //   'receptorId',
    // ])
    const receptorId = params.nit

    try {
      // Crear el cliente SOAP
      const soapClient = await soap.createClientAsync(this.wsdlUrlConsultaNIT)

      // Definir los parámetros que se enviarán en la petición
      const args = {
        Cliente: this.cliente,
        Usuario: this.usuario,
        Clave: this.clave,
        Receptorid: receptorId,
      }

      // Ejecutar la función SOAP usando Promesas
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
      const soapClient = await soap.createClientAsync(this.wsdUrlFactura)

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

  async facturarHospedaje(xmldoc: string) {
    try {
      // Crear el cliente SOAP para la facturación
      const soapClient = await soap.createClientAsync(this.wsdUrlFactura)

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

  async registraFacturaFromHospedaje({ request, response }: HttpContext) {
    try {
      const hospedajeId = request.input('hospedajeId')
      const hospedaje = await Hospedaje.findOrFail(hospedajeId)
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
        total += detalle.precioVenta * detalle.cantidad
      }

      const numFactura = await Factura.getNextNumFactura()
      console.log(numFactura)
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
      let detallasFactura: DetalleFactura[] = []
      for (const detalle of detalles) {
        const detalleFactura = await DetalleFactura.create({
          facturaId: factura.id,
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          costo: detalle.costo,
          descuento: detalle.descuento,
          precio: detalle.precioVenta,
        })
        console.log(detalleFactura)
        await detalleFactura.load('producto')
        detallasFactura.push(detalleFactura)
      }

      const datosGenerales = {
        TrnEstNum: this.numEstablecimiento,
        TipTrnCod: 'FACT',
        TrnNum: numFactura,
        TrnFec: fecha.toISOString().substring(0, 10),
        MonCod: 'GTQ',
        TrnBenConNIT: nit,
        TrnExp: 0,
        TrnExento: 0,
        TrnFraseTipo: 0,
        TrnEscCod: 0,
        TrnEFACECliNom: nombre,
        TrnEFACECliDir: direccion,
      }
      const items: ItemFactura[] = []
      for (const [index, detalle] of detallasFactura.entries()) {
        const item: ItemFactura = {
          TrnLiNum: index + 1,
          TrnArtCod: detalle.producto?.codigo,
          TrnArtNom: detalle.producto?.nombre,
          TrnCan: detalle.cantidad,
          TrnVUn: detalle.precio,
          TrnUniMed: 'UNI',
          TrnVDes: detalle.descuento,
          TrnArtBienSer: detalle.producto?.esServicio ? 'S' : 'B',
          TrnArtImpAdiCod: 0,
          TrnArtImpAdiUniGrav: 0,
        }

        items.push(item)
      }
      //Crear el XML para la facturación
      const xmlDoc: string = ''

      //Registrar la facturación
      await this.facturarHospedaje(xmlDoc)
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al registrar la facturación',
        error: error.message,
      })
    }
  }
}
