// authService.js
import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = 'http://localhost:3333/auth';

const register = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

const login = async (data) => {
    console.log(data);
  const response = await axios.post(`${API_URL}/login`, data);
  console.log(response);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);
  }
  console.log(response);
  return response.data;
};

const logout = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/logout`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  localStorage.removeItem('token');
  return response.data;
};

const me = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export { register, login, logout, me };
