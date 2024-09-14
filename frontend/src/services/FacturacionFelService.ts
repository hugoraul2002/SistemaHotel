import axios from 'axios';

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

export default {consultaNit , facturar}