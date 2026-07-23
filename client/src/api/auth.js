import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/auth`
    : '/api/auth',
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
