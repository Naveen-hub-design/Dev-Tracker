import axios from 'axios';

const API = axios.create({ baseURL: '/api/profile' });

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('devtrack_user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      req.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return req;
});

export async function getProfile() {
  const res = await API.get('/');
  return res.data;
}

export async function updateUsernames(data) {
  const res = await API.put('/usernames', data);
  return res.data;
}

export async function refreshGitHub() {
  const res = await API.post('/refresh/github');
  return res.data;
}

export async function refreshLeetCode() {
  const res = await API.post('/refresh/leetcode');
  return res.data;
}

export async function refreshCodeforces() {
  const res = await API.post('/refresh/codeforces');
  return res.data;
}
