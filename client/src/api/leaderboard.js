import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    const user = localStorage.getItem('devtrack_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) req.headers.Authorization = `Bearer ${parsed.token}`;
      } catch { /* ignore */ }
    }
  }
  return req;
});

export const fetchLeaderboard = async (category = 'overall') => {
  const res = await API.get(`/leaderboard?category=${encodeURIComponent(category)}`);
  return res.data;
};
