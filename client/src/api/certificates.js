import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/certificates`
    : '/api/certificates',
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

export async function fetchCertificates() {
  try {
    const res = await API.get('/');
    const data = res.data;
    if (Array.isArray(data) && data.length > 0) {
      return data.map((c) => ({ ...c, id: c.id || c._id }));
    }
  } catch (err) {
    console.warn('Falling back to local certificates:', err.message);
  }

  try {
    const raw = localStorage.getItem('devtrack_certificates');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  return [];
}

export async function addCertificate(certData) {
  try {
    const res = await API.post('/', certData);
    const data = res.data;
    return { ...data, id: data.id || data._id };
  } catch (err) {
    console.warn('Saving certificate locally:', err.message);
    return { ...certData, id: Date.now().toString() };
  }
}

export async function editCertificate(id, updates) {
  try {
    const res = await API.put(`/${id}`, updates);
    const data = res.data;
    return { ...data, id: data.id || data._id };
  } catch (err) {
    console.warn('Updating certificate locally:', err.message);
    return { ...updates, id };
  }
}

export async function removeCertificate(id) {
  try {
    await API.delete(`/${id}`);
    return true;
  } catch (err) {
    console.warn('Deleting certificate locally:', err.message);
    return true;
  }
}
