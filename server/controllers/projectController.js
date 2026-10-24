const Project = require('../models/Project');

const SAMPLE_PROJECTS = [
  {
    name: 'DevTrack Dashboard',
    description: 'Full-stack developer productivity dashboard with GitHub, LeetCode, and HackerRank integrations. Real-time analytics, job match scoring, and achievement tracking.',
    image: null,
    status: 'completed',
    techStack: ['React', 'Vite', 'Tailwind CSS', 'Express', 'SQLite', 'Recharts'],
    startDate: '2025-11-15',
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
    name: 'E-Commerce Platform',
    description: 'Full-featured e-commerce platform with product catalog, cart management, secure checkout, and admin dashboard for inventory management.',
    image: null,
    status: 'in_progress',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    startDate: '2026-03-01',
    completion: 72,
    githubUrl: 'https://github.com/Naveen-hub-design/ecommerce-app',
    liveUrl: null,
    features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'Admin Panel'],
    challenges: ['Payment integration complexity', 'Inventory synchronization'],
    futureImprovements: ['Recommendation engine', 'Multi-vendor support', 'Progressive Web App'],
    contributors: ['Naveen'],
    milestones: [
      { date: '2026-03-01', label: 'Project Started' },
      { date: '2026-04-10', label: 'Product Catalog Complete' },
      { date: '2026-05-20', label: 'Cart & Checkout' },
      { date: '2026-07-18', label: 'Admin Dashboard' },
    ],
  },
  {
    name: 'DSA Solutions Repository',
    description: 'Comprehensive collection of Data Structures and Algorithms solutions with complexity analysis, visual explanations, and test cases.',
    image: null,
    status: 'in_progress',
    techStack: ['Python', 'JavaScript', 'C++'],
    startDate: '2025-08-10',
    completion: 65,
    githubUrl: 'https://github.com/Naveen-hub-design/dsa-solutions',
    liveUrl: null,
    features: ['200+ Solutions', 'Complexity Analysis', 'Visual Explanations', 'Test Cases'],
    challenges: ['Maintaining consistency across languages', 'Creating clear explanations'],
    futureImprovements: ['Interactive visualizations', 'Difficulty-based progression', 'Mock interview mode'],
    contributors: ['Naveen'],
    milestones: [
      { date: '2025-08-10', label: 'Repository Created' },
      { date: '2025-12-01', label: '100 Solutions Milestone' },
      { date: '2026-06-15', label: 'Language Expansion' },
    ],
  },
  {
    name: 'Portfolio Website',
    description: 'Personal portfolio showcasing projects, skills, and blog posts with modern design, dark mode, and responsive layout.',
    image: null,
    status: 'completed',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Netlify'],
    startDate: '2025-06-01',
    completion: 100,
    githubUrl: 'https://github.com/Naveen-hub-design/portfolio-site',
    liveUrl: 'https://naveen-dev.com',
    features: ['Responsive Design', 'Dark Mode', 'Blog System', 'Contact Form'],
    challenges: ['Cross-browser compatibility', 'Performance optimization'],
    futureImprovements: ['MDX blog support', 'RSS feed', 'Analytics integration'],
    contributors: ['Naveen'],
    milestones: [
      { date: '2025-06-01', label: 'Project Started' },
      { date: '2025-07-15', label: 'Design Complete' },
      { date: '2025-08-01', label: 'Deployed' },
    ],
  },
];

const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    let projects = await Project.find({ userId });

    // Auto-seed if user has no projects yet
    if (projects.length === 0) {
      for (const sample of SAMPLE_PROJECTS) {
        await Project.create({ ...sample, userId });
      }
      projects = await Project.find({ userId });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching projects' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching project' });
  }
};

const createProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const project = await Project.create({
      ...req.body,
      userId,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body
    );
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const result = await Project.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.changes === 0) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting project' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
