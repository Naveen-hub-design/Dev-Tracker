import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGitHub } from './useGitHub';
import { useLeetCode } from './useLeetCode';
import { useHackerRank } from './useHackerRank';
import { useProjects } from './useProjects';

const DEFAULT_PORTFOLIO = {
  personal: { name: '', title: 'Full Stack Developer', email: '', location: '', linkedin: '', github: '', portfolio: '', bio: '', avatar: '' },
  skills: { languages: [], frameworks: [], databases: [], tools: [] },
  projects: [],
  codingProfiles: {
    github: { username: '', stars: 0, repos: 0, commits: 0, followers: 0 },
    leetcode: { username: '', solved: 0, easy: 0, medium: 0, hard: 0 },
    hackerrank: { username: '', solved: 0, badge: '' },
  },
  achievements: [],
};

function deriveSkills(languages, repos) {
  const langs = Object.keys(languages || {});
  const fw = new Set(); const db = new Set(); const tl = new Set();
  repos?.forEach((r) => {
    const n = (r.name || '').toLowerCase(); const l = (r.language || '').toLowerCase();
    if (n.includes('react') || l === 'react') fw.add('React');
    if (n.includes('node') || l === 'javascript') fw.add('Node.js');
    if (n.includes('next')) fw.add('Next.js');
    if (n.includes('express')) fw.add('Express.js');
    if (n.includes('spring') || l === 'java') fw.add('Spring Boot');
    if (n.includes('django')) fw.add('Django');
    if (n.includes('tailwind') || n.includes('css')) fw.add('Tailwind CSS');
    if (n.includes('mongodb')) db.add('MongoDB');
    if (n.includes('postgres') || n.includes('sql')) db.add('PostgreSQL');
    if (n.includes('mysql')) db.add('MySQL');
    if (n.includes('redis')) db.add('Redis');
    if (n.includes('docker')) tl.add('Docker');
    if (n.includes('aws')) tl.add('AWS');
  });
  if (langs.includes('JavaScript')) fw.add('JavaScript');
  if (langs.includes('TypeScript')) fw.add('TypeScript');
  if (langs.includes('Python')) fw.add('Python');
  if (langs.includes('Java')) fw.add('Java');
  if (langs.includes('C++')) fw.add('C++');
  if (langs.includes('HTML')) fw.add('HTML');
  if (langs.includes('CSS')) fw.add('CSS');
  tl.add('Git'); tl.add('GitHub');
  const codeLangs = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'];
  return {
    languages: [...new Set([...langs, ...Array.from(fw).filter((f) => codeLangs.includes(f))])],
    frameworks: Array.from(fw).filter((f) => !codeLangs.includes(f)),
    databases: Array.from(db),
    tools: Array.from(tl),
  };
}

export function usePortfolio() {
  const { user } = useAuth();
  const { data: gh, loading: ghL } = useGitHub();
  const { data: lc, loading: lcL } = useLeetCode();
  const { data: hr, loading: hrL } = useHackerRank();
  const { allProjects, loading: pL } = useProjects();
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [theme, setTheme] = useState('modern');
  const [darkMode, setDarkMode] = useState(false);
  const loading = ghL || lcL || hrL || pL;

  useEffect(() => {
    if (!user && !gh && !lc) return;
    const personal = {
      name: user?.name || gh?.profile?.name || lc?.username || '',
      title: 'Full Stack Developer', email: user?.email || '', location: '',
      linkedin: '', github: gh?.username || '', portfolio: '', bio: '',
      avatar: gh?.avatar || gh?.profile?.avatar || '',
    };
    const skills = deriveSkills(gh?.languages, gh?.repos);
    const projects = (allProjects || []).filter((x) => x.status !== 'archived').slice(0, 6).map((x) => ({
      name: x.name, description: x.description, technologies: x.techStack || [],
      githubUrl: x.githubUrl || '', liveUrl: x.liveUrl || '',
    }));
    const stars = (gh?.repos || []).reduce((a, r) => a + (r.stars || 0), 0);
    const codingProfiles = {
      github: { username: gh?.username || '', stars, repos: gh?.public_repos || 0, commits: gh?.totalCommits || 0, followers: gh?.followers || 0 },
      leetcode: { username: lc?.username || '', solved: lc?.total || 0, easy: lc?.easy || 0, medium: lc?.medium || 0, hard: lc?.hard || 0 },
      hackerrank: { username: hr?.username || '', solved: hr?.totalSolved || 0, badge: hr?.hackerBadge || '' },
    };
    const achievements = [];
    if (stars >= 10) achievements.push(`${stars} GitHub Stars`);
    if (codingProfiles.leetcode.solved >= 50) achievements.push(`${codingProfiles.leetcode.solved} LeetCode Problems Solved`);
    if (codingProfiles.hackerrank.solved >= 50) achievements.push(`${codingProfiles.hackerrank.solved} HackerRank Problems Solved`);
    if (gh?.totalCommits >= 100) achievements.push(`${gh.totalCommits} GitHub Commits`);
    achievements.push('DevTrack Certified Developer');
    setPortfolio((prev) => ({ ...prev, personal, skills, projects, codingProfiles, achievements }));
  }, [user, gh, lc, hr, allProjects]);

  const updatePersonal = useCallback((field, value) => {
    setPortfolio((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  }, []);

  return { portfolio, theme, darkMode, loading, updatePersonal, setTheme, setDarkMode };
}
