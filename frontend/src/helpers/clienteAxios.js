import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000', // Reemplaza con tu URL base
});
export default axiosClient;
