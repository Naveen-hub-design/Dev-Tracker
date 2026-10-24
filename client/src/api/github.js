import axios from 'axios';

const demoGitHub = {
  username: 'arun-dev',
  avatar: 'https://avatars.githubusercontent.com/u/9919',
  public_repos: 18,
  followers: 42,
  following: 15,
  bio: 'Full Stack Engineer & Open Source Enthusiast',
  location: 'Bangalore, India',
  company: 'DevTrack Org',
  totalCommits: 342,
  totalStars: 169,
  totalForks: 48,
  totalOpenIssues: 7,
  prCount: 26,
  rateLimit: {
    limit: 5000,
    remaining: 4982,
    reset: Math.floor(Date.now() / 1000) + 3600,
    authenticated: true,
  },
  repos: [
    {
      name: 'devtrack-dashboard',
      fullName: 'arun-dev/devtrack-dashboard',
      description: 'Comprehensive developer productivity tracker with live analytics & ATS resume matcher',
      stars: 87,
      forks: 24,
      openIssues: 3,
      language: 'JavaScript',
      size: 4200,
      htmlUrl: 'https://github.com/arun-dev/devtrack-dashboard',
      homepage: 'https://devtrack.io',
      license: 'MIT',
      updatedAt: '2 days ago',
    },
    {
      name: 'ecommerce-app',
      fullName: 'arun-dev/ecommerce-app',
      description: 'Production-ready headless eCommerce platform built with React, Redux & Tailwind',
      stars: 34,
      forks: 11,
      openIssues: 1,
      language: 'TypeScript',
      size: 3100,
      htmlUrl: 'https://github.com/arun-dev/ecommerce-app',
      homepage: '',
      license: 'Apache-2.0',
      updatedAt: '5 days ago',
    },
    {
      name: 'dsa-solutions',
      fullName: 'arun-dev/dsa-solutions',
      description: 'Clean, optimized solutions to 450+ LeetCode and Codeforces algorithms',
      stars: 22,
      forks: 8,
      openIssues: 0,
      language: 'C++',
      size: 1500,
      htmlUrl: 'https://github.com/arun-dev/dsa-solutions',
      homepage: '',
      license: 'MIT',
      updatedAt: 'today',
    },
    {
      name: 'portfolio-site',
      fullName: 'arun-dev/portfolio-site',
      description: 'High-performance interactive 3D developer portfolio powered by Three.js',
      stars: 15,
      forks: 3,
      openIssues: 1,
      language: 'CSS',
      size: 890,
      htmlUrl: 'https://github.com/arun-dev/portfolio-site',
      homepage: '',
      license: 'MIT',
      updatedAt: '1 week ago',
    },
    {
      name: 'node-api-boilerplate',
      fullName: 'arun-dev/node-api-boilerplate',
      description: 'Scalable Node.js & Express REST microservice scaffold with JWT & SQLite/Postgres',
      stars: 11,
      forks: 2,
      openIssues: 2,
      language: 'Python',
      size: 1200,
      htmlUrl: 'https://github.com/arun-dev/node-api-boilerplate',
      homepage: '',
      license: 'MIT',
      updatedAt: '3 days ago',
    },
  ],
  languages: { JavaScript: 45, TypeScript: 25, 'C++': 15, CSS: 10, Python: 5 },
  commitActivity: [38, 45, 52, 61, 72, 74],
  commitVelocity: {
    monthlyTrend: [38, 45, 52, 61, 72, 74],
    avgMonthly: 57,
    peakMonth: 'Current Month',
    peakCount: 74,
  },
};

export async function fetchGitHubProfile(username) {
  try {
    const base = import.meta.env.VITE_API_URL || '';
    const res = await axios.get(`${base}/api/github/${username}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('GitHub user not found');
    }
    console.warn('GitHub API failed, using demo data');
    return { ...demoGitHub, username };
  }
}

export async function fetchRateLimitStatus() {
  try {
    const base = import.meta.env.VITE_API_URL || '';
    const res = await axios.get(`${base}/api/github/rate-limit`);
    return res.data;
  } catch {
    return { limit: 60, remaining: 45, reset: Math.floor(Date.now() / 1000) + 3600, authenticated: false };
  }
}

export { demoGitHub };
