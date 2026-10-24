import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
}

export async function reviewCodeWithAI({ code, language, problemTitle, testInput }) {
  const res = await axios.post(
    `${API_BASE}/api/ai/code-review`,
    { code, language, problemTitle, testInput },
    getHeaders()
  );
  return res.data;
}
