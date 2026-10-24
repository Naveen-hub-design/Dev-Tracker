import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/projects`
    : '/api/projects',
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

const DEMO_PROJECTS = [
  {
    _id: '1',
    id: '1',
    name: 'DevTrack Dashboard',
    description: 'Full-stack developer productivity dashboard with GitHub, LeetCode, and HackerRank integrations. Real-time analytics, job match scoring, and achievement tracking.',
    image: null,
    status: 'completed',
    techStack: ['React', 'Vite', 'Tailwind CSS', 'Express', 'SQLite', 'Recharts'],
    startDate: '2025-11-15',
    updatedAt: '2026-07-20',
    completion: 95,
    githubUrl: 'https://github.com/Naveen-hub-design/Dev-Tracker',
    liveUrl: null,
    features: ['Authentication', 'Dashboard Analytics', 'Multi-platform Integration', 'Job Match Scoring'],
    challenges: ['HackerRank API rate limiting', 'CORS configuration for multiple origins'],
    futureImprovements: ['Real-time WebSocket updates', 'Mobile app version', 'Team collaboration features'],
    contributors: ['Naveen'],
    milestones: [
      { date: '2025-11-15', label: 'Project Started' },
      { date: '2025-12-01', label: 'Auth System Complete' },
      { date: '2026-01-10', label: 'GitHub Integration' },
      { date: '2026-03-15', label: 'LeetCode + HackerRank' },
      { date: '2026-06-01', label: 'Premium Dashboard Redesign' },
      { date: '2026-07-20', label: 'Deployed to Production' },
    ],
  },
  {
    _id: '2',
    id: '2',
    name: 'E-Commerce Platform',
    description: 'Full-featured e-commerce platform with product catalog, cart management, secure checkout, and admin dashboard for inventory management.',
    image: null,
    status: 'in_progress',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    startDate: '2026-03-01',
    updatedAt: '2026-07-18',
    completion: 72,
    githubUrl: 'https://github.com/Naveen-hub-design/ecommerce-app',
    liveUrl: null,
    features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'Admin Panel'],
    challenges: ['Payment integration complexity', 'Inventory synchronization'],
    futureImprovements: ['Recommendation engine', 'Multi-vendor support', 'Progressive Web App'],
    contributors: ['Naveen', 'Priya'],
    milestones: [
      { date: '2026-03-01', label: 'Project Started' },
      { date: '2026-04-10', label: 'Product Catalog Complete' },
      { date: '2026-05-20', label: 'Cart & Checkout' },
      { date: '2026-07-18', label: 'Admin Dashboard' },
    ],
  },
];

export async function fetchProjects() {
  try {
    const res = await API.get('/');
    const data = res.data;
    if (Array.isArray(data) && data.length > 0) {
      // Ensure each project has both id and _id
      return data.map((p) => ({ ...p, id: p.id || p._id }));
    }
    return DEMO_PROJECTS;
  } catch (err) {
    console.warn('Using cached projects fallback:', err.message);
    return DEMO_PROJECTS;
  }
}

export async function fetchProjectById(id) {
  try {
    const res = await API.get(`/${id}`);
    const data = res.data;
    return { ...data, id: data.id || data._id };
  } catch (err) {
    return DEMO_PROJECTS.find((p) => p.id === id || p._id === id) || null;
  }
}

export async function createProject(projectData) {
  const res = await API.post('/', projectData);
  const data = res.data;
  return { ...data, id: data.id || data._id };
}

export async function updateProject(id, projectData) {
  const res = await API.put(`/${id}`, projectData);
  const data = res.data;
  return { ...data, id: data.id || data._id };
}

export async function deleteProject(id) {
  const res = await API.delete(`/${id}`);
  return res.data;
}
