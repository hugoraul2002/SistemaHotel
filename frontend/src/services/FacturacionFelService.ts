import axios from 'axios';
import {  formatDateTimeFormat2 } from '../helpers/formatDate';
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

export default {consultaNit , facturar , facturarHospedaje, reporteFactura}