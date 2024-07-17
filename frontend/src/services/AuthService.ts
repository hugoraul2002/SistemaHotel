import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;
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
}

interface MeResponse {
  id: string;
  username: string;
  email: string;
}

const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  return response.data;
};

const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  await axios.post(`${API_URL}/logout`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  localStorage.removeItem('token');
};

const me = async (): Promise<MeResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await axios.get<MeResponse>(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export { register, login, logout, me };
