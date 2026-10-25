import axios from 'axios';
import { getToken } from '../utils/token';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/auth`
    : '/api/auth',
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export async function registerUser(name, email, password) {
  const res = await API.post('/register', { name, email, password });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await API.post('/login', { email, password });
  return res.data;
}

export async function getMe() {
  const res = await API.get('/me');
  return res.data;
}

export async function changePassword(currentPassword, newPassword) {
  const res = await API.put('/change-password', { currentPassword, newPassword });
  return res.data;
}

