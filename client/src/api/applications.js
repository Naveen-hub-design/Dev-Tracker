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

export async function fetchApplications() {
  const res = await axios.get(`${API_BASE}/api/applications`, getHeaders());
  return res.data;
}

export async function createApplication(data) {
  const res = await axios.post(`${API_BASE}/api/applications`, data, getHeaders());
  return res.data;
}

export async function updateApplication(id, data) {
  const res = await axios.put(`${API_BASE}/api/applications/${id}`, data, getHeaders());
  return res.data;
}

export async function updateApplicationStatus(id, status) {
  const res = await axios.patch(`${API_BASE}/api/applications/${id}/status`, { status }, getHeaders());
  return res.data;
}

export async function deleteApplication(id) {
  const res = await axios.delete(`${API_BASE}/api/applications/${id}`, getHeaders());
  return res.data;
}
