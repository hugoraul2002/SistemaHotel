import axios from 'axios';
import { UsuarioCliente } from '../helpers/validators/Validadores';
import { Usuario } from '../types/types';

const API_URL = 'http://localhost:3333/auth';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user:Usuario;
}

// interface MeResponse {
//   id: string;
//   username: string;
//   email: string;
// }

const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  return response.data;
};

const registerCliente = async (data: UsuarioCliente): Promise<AuthResponse> => {
  console.log(data);
  const response = await axios.post<AuthResponse>(`${API_URL}/registerCliente`, data);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);}    
  return response.data;
};

const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);
    console.log(response.data);
    localStorage.setItem('auth', JSON.stringify(response.data.user));
  }
  return response.data;
};

const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontro token.');

  await axios.post(`${API_URL}/logout`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  localStorage.removeItem('token');
  localStorage.removeItem('auth');
};

const me = async (): Promise<Usuario> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontro token.');

  const response = await axios.get<Usuario>(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export { register, login, logout, me , registerCliente};
