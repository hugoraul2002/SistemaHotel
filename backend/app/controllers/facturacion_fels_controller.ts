import type { HttpContext } from '@adonisjs/core/http'
import * as soap from 'soap'
import * as xml2js from 'xml2js'

export default class FacturacionFelController {
  private wsdlUrlConsultaNIT: string =
    'http://pruebas.ecofactura.com.gt:8080/fel/areceptorinfo?wsdl'
  private wsdUrlFactura: string = 'http://pruebas.ecofactura.com.gt:8080/fel/adocumento?wsdl'
  private cliente: string = '114957703'
  private usuario: string = 'ADMIN'
  private clave: string = 'Msuper@_0822'

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
}
