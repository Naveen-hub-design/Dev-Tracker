import axios from 'axios';

const demoGitHub = {
  username: 'arun-dev',
  avatar: 'https://avatars.githubusercontent.com/u/9919',
  public_repos: 18,
  followers: 42,
  totalCommits: 342,
  repos: [
    { name: 'devtrack-dashboard', stars: 87, language: 'JavaScript', updatedAt: '2 days ago' },
    { name: 'ecommerce-app', stars: 34, language: 'React', updatedAt: '5 days ago' },
    { name: 'dsa-solutions', stars: 22, language: 'JavaScript', updatedAt: 'today' },
    { name: 'portfolio-site', stars: 15, language: 'CSS', updatedAt: '1 week ago' },
    { name: 'node-api-boilerplate', stars: 11, language: 'Python', updatedAt: '3 days ago' },
  ],
  languages: { JavaScript: 52, React: 28, CSS: 12, Python: 8 },
  commitActivity: [38, 45, 52, 61, 72, 74],
};

export async function fetchGitHubProfile(username) {
  try {
    const res = await axios.get(`/api/github/${username}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('GitHub user not found');
    }
    console.warn('GitHub API failed, using demo data');
    return { ...demoGitHub, username };
  }
}

export { demoGitHub };
