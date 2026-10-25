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

/**
 * Fetch weak-topic DSA recommendations and category gap analysis
 */
export async function fetchWeakTopicRecommendations(username = '') {
  const params = username ? { username } : {};
  const response = await API.get('/leetcode/recommendations/weak-topics', { params });
  return response.data?.analysis || null;
}
