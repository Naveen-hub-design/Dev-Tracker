import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/ai`
    : '/api/ai',
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

export async function startMockInterview({ role = 'frontend', level = 'mid' }) {
  const res = await API.post('/interview/start', { role, level });
  return res.data;
}

export async function submitInterviewAnswer({ role, level, questionNumber, question, answer, history }) {
  const res = await API.post('/interview/evaluate', {
    role,
    level,
    questionNumber,
    question,
    answer,
    history,
  });
  return res.data;
}

export async function finishMockInterview({ role, level, exchanges }) {
  const res = await API.post('/interview/finish', { role, level, exchanges });
  return res.data;
}
