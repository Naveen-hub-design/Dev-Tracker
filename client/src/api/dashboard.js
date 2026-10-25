import axios from 'axios';
import { getToken } from '../utils/token';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/dashboard`
    : '/api/dashboard',
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export async function fetchDashboard() {
  const res = await API.get('/');
  return res.data;
}
