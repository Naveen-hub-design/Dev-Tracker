import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('devtrack_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch { /* ignore */ }
  }
  return req;
});

export async function fetchMyCodeforces() {
  const res = await API.get('/codeforces/me');
  return res.data;
}

export async function fetchCodeforcesByHandle(handle) {
  const res = await API.get(`/codeforces/${handle}`);
  return res.data;
}

export async function refreshCodeforces() {
  const res = await API.post('/profile/refresh/codeforces');
  return res.data;
}
