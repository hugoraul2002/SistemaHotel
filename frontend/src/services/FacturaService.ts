import axios from 'axios';
import dayjs from 'dayjs';
const API_URL = 'http://localhost:3333/facturas';


const reporteFactura = async (data : any) => {
    try {
        const token = localStorage.getItem('token');
        const reportData = {
            fechaInicio : dayjs(data.fechaInicio).format('YYYY-MM-DD'),
            fechaFin : dayjs(data.fechaFin).format('YYYY-MM-DD'),
        }
        const response = await axios.post(`${API_URL}/reporteFactura/`,reportData,{
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
}

export {reporteFactura}