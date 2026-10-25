import axios from 'axios';
import { getAuthHeaders } from '../utils/token';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function reviewCodeWithAI({ code, language, problemTitle, testInput }) {
  const res = await axios.post(
    `${API_BASE}/api/ai/code-review`,
    { code, language, problemTitle, testInput },
    getAuthHeaders()
  );
  return res.data;
}
