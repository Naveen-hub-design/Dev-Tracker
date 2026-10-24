import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/resume`
    : '/api/resume',
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

export async function fetchResume() {
  try {
    const res = await API.get('/');
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    console.warn('Falling back to local resume:', err.message);
  }

  try {
    const raw = localStorage.getItem('devtrack_resume');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  return null;
}

export async function saveResume(resumeData) {
  try {
    const res = await API.put('/', resumeData);
    if (res.data) {
      localStorage.setItem('devtrack_resume', JSON.stringify(res.data));
      return res.data;
    }
  } catch (err) {
    console.warn('Saving resume locally:', err.message);
    localStorage.setItem('devtrack_resume', JSON.stringify(resumeData));
    return resumeData;
  }
}
