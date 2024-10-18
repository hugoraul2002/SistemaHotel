import { apiRequest } from '../helpers/clienteAxios';
import { fechaActual, formatDateTimeFormat2 } from '../helpers/formatDate';
import { me } from '../services/AuthService';

const consultaNit = async (nit: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.get(`/fel/consultaNit/${nit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching NIT:', error);
        throw error;
    }
}

const facturar = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.post(`/fel/facturar/`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error during facturation:', error);
        throw error;
    }
}

const facturarHospedaje = async (data: any) => {
    try {
        const user = await me();
        const fecha = fechaActual();
        data = { ...data, fecha, usuarioId: user.id };
        console.log(data);
        const token = localStorage.getItem('token');
        const response = await apiRequest.post(`/fel/facturarHospedaje/`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error during hospedaje facturation:', error);
        throw error;
    }
}


const reporteFactura = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.post(`/fel/reporteFactura/`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error generating factura report:', error);
        throw error;
    }
}

const getPDF = async (numFactura: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.get(`/fel/extraerPDF/${numFactura}`, {
            headers: { 'Authorization': `Bearer ${token}` },
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
        throw error;
    }
}

const anularFacturaFel = async (data: any) => {
    try {
        const user = await me();
        data = { ...data, fechaAnulacion: fechaActual(), idUsuario: user.id };
        console.log(data);
        const token = localStorage.getItem('token');
        const response = await apiRequest.post(`/fel/anularFactura/`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error annulling factura:', error);
        throw error;
    }
}

export default { consultaNit, facturar, facturarHospedaje, reporteFactura, getPDF, anularFacturaFel };
