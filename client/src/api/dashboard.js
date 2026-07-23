import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/dashboard`
    : '/api/dashboard',
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('devtrack_user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      req.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return req;
});

export async function fetchDashboard() {
  const res = await API.get('/');
  return res.data;
}
