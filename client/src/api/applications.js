import axios from 'axios';
import { getAuthHeaders } from '../utils/token';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchApplications() {
  const res = await axios.get(`${API_BASE}/api/applications`, getAuthHeaders());
  return res.data;
}

export async function createApplication(data) {
  const res = await axios.post(`${API_BASE}/api/applications`, data, getAuthHeaders());
  return res.data;
}

export async function updateApplication(id, data) {
  const res = await axios.put(`${API_BASE}/api/applications/${id}`, data, getAuthHeaders());
  return res.data;
}

export async function updateApplicationStatus(id, status) {
  const res = await axios.patch(`${API_BASE}/api/applications/${id}/status`, { status }, getAuthHeaders());
  return res.data;
}

export async function deleteApplication(id) {
  const res = await axios.delete(`${API_BASE}/api/applications/${id}`, getAuthHeaders());
  return res.data;
}
