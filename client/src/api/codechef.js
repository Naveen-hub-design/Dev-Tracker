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
