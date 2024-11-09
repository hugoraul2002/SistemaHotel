import { apiRequest } from '../helpers/clienteAxios';
import dayjs from 'dayjs';
import { me } from './AuthService';
import { fechaActual } from '../helpers/formatDate';

const reporteFactura = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        const reportData = {
            fechaInicio: dayjs(data.fechaInicio).subtract(6, 'hour').format('YYYY-MM-DD'),
            fechaFin: dayjs(data.fechaFin).subtract(6, 'hour').format('YYYY-MM-DD'),
        };
        const response = await apiRequest.post(`/facturas/reporteFactura/`, reportData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
}

const anularFactura = async (data: any) => {
    try {
        const user = await me();
        
        const dataAnulacion = {
            facturaId: data.idFactura,
            userId: user.id,
            motivo: data.motivoAnulacion,
            fecha: fechaActual(),
        };
        console.log(data);
        const token = localStorage.getItem('token');
        const response = await apiRequest.post(`/facturas/anularFactura/`, dataAnulacion, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error annulling factura:', error);
        throw error;
    }
}

const getTicketFactura = async (idFactura: number, numFactura: string) => {
    try {
        console.log(idFactura, numFactura)
      const token = localStorage.getItem('token');
      
      // Verifica que el token exista antes de hacer la solicitud
      if (!token) {
        throw new Error('No se encontró un token de autenticación.');
      }
  
      // Realiza la solicitud al API para generar y descargar el ticket en formato PDF
      const response = await apiRequest.get(`/facturas/generarTicket/${idFactura}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob', // Para recibir el PDF en formato binario
      });
  
      // Verifica si la respuesta contiene datos válidos
      if (!response.data) {
        throw new Error('No se recibió el archivo PDF.');
      }
  
      // Crea un objeto Blob con los datos del PDF
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfURL = window.URL.createObjectURL(pdfBlob);
  
      // Crear un enlace dinámico para descargar o abrir el PDF
      const link = document.createElement('a');
      link.href = pdfURL;
      link.setAttribute('download', `Factura_${numFactura}.pdf`); // Nombre del archivo PDF
      document.body.appendChild(link);
      link.click();
  
      // Elimina el enlace después de hacer clic
      link.remove();
  
  
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }



export { reporteFactura, anularFactura, getTicketFactura };
