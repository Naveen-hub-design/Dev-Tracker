import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
});

export const getPublicProfile = async (identifier) => {
  const response = await API.get(`/public/u/${encodeURIComponent(identifier)}`);
  return response.data;
};

export const getBadgeUrl = (identifier, style = 'shield', theme = 'dark') => {
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/api/badge/${encodeURIComponent(identifier)}${style === 'card' ? '/card' : ''}?theme=${theme}`;
};
