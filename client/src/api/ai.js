import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/ai`
    : '/api/ai',
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

export async function sendAIChat(message, history = []) {
  const res = await API.post('/chat', { message, history });
  return res.data;
}

export async function scanResumeATS(jobDescription, resumeOverride = null) {
  const res = await API.post('/ats-match', {
    jobDescription,
    resumeOverride,
  });
  return res.data;
}
