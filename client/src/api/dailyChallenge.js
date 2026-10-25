import axios from 'axios';
import { getToken } from '../utils/token';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
});

// Attach JWT token from universal token resolver
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchDailyChallenge = async () => {
  const res = await API.get('/leetcode/daily');
  return res.data;
};

export const toggleDailySolve = async (notes = '') => {
  const res = await API.post('/leetcode/daily/solve', { notes });
  return res.data;
};
