import axios from 'axios';
import { getToken } from '../utils/token';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export async function fetchMyCodeChef() {
  const res = await API.get('/codechef/me');
  return res.data;
}

export async function fetchCodeChefByUsername(username) {
  const res = await API.get(`/codechef/${encodeURIComponent(username)}`);
  return res.data;
}

export async function updateCodeChefUsername(username) {
  const res = await API.put('/codechef/username', { username });
  return res.data;
}

export async function refreshCodeChef() {
  const res = await API.post('/codechef/refresh');
  return res.data;
}
