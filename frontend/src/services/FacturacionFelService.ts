import axios from 'axios';
import {  fechaActual, formatDateTimeFormat2 } from '../helpers/formatDate';
import {me} from '../services/AuthService';
const API_URL = 'http://localhost:3333/fel';


const consultaNit = async (nit: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/consultaNit/${nit}`,{
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
}

const facturar = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/facturar/`,data,{
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
}

 const  facturarHospedaje = async (data: any) => {
    try {
        const user = await me();
        const fecha = formatDateTimeFormat2(new Date());
        data = {...data, fecha,usuarioId:user.id};
        console.log(data);
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/facturarHospedaje/`,data,{
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
}

const reporteFactura = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/reporteFactura/`,data,{
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
}


const getPDF = async (numFactura: string) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/extraerPDF/${numFactura}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob', 
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfURL = window.URL.createObjectURL(pdfBlob);
      
      // Crear un enlace dinámico para descargar o abrir el PDF
      const link = document.createElement('a');
      link.href = pdfURL;
      link.setAttribute('download', `Factura_${numFactura}.pdf`); // Nombre del archivo PDF
      document.body.appendChild(link);
      link.click();
      link.remove();
  
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }

    const  anularFacturaFel = async (data: any) => {
      try {
          const user = await me();
          data = {...data, fechaAnulacion:fechaActual(),idUsuario:user.id};
          console.log(data);
          const token = localStorage.getItem('token');
          const response = await axios.post(`${API_URL}/anularFactura/`,data,{
              headers: { 'Authorization': `Bearer ${token}` }
          });
          return response.data;
      } catch (error) {
        console.log(error);
        console.error('Error fetching users:', error);
      }
  }


export default {consultaNit , facturar , facturarHospedaje, reporteFactura, getPDF, anularFacturaFel}