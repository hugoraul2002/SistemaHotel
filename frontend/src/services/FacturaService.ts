import axios from 'axios';
import dayjs from 'dayjs';
import { me } from './AuthService';
import { fechaActual } from '../helpers/formatDate';
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

const anularFactura = async (data : any) => {
    try {
        const user = await me();
        
          const dataAnulacion = {
              facturaId: data.idFactura,
              userId: user.id,
              motivo: data.motivoAnulacion,
              fecha: fechaActual(),
          }
          console.log(data);
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/anularFactura/`,dataAnulacion,{
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.log(error);
      console.error('Error  anular:', error);
    }
}

export {reporteFactura , anularFactura}