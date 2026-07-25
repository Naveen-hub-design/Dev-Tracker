import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGitHub } from './useGitHub';
import { useLeetCode } from './useLeetCode';
import { useHackerRank } from './useHackerRank';
import { useProjects } from './useProjects';

const DEFAULT_RESUME = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  education: [
    { college: '', degree: '', cgpa: '', year: '' },
  ],
  skills: {
    languages: [],
    frameworks: [],
    databases: [],
    tools: [],
  },
  projects: [],
  codingProfiles: {
    github: { username: '', stars: 0, repos: 0, commits: 0 },
    leetcode: { username: '', solved: 0, easy: 0, medium: 0, hard: 0 },
    hackerrank: { username: '', solved: 0, badge: '' },
  },
  achievements: [],
  experience: [
    { company: '', role: '', duration: '', description: '' },
  ],
  template: 'modern',
};

function deriveSkillsFromLanguages(languages, repos) {
  const langs = Object.keys(languages || {});
  const fwSet = new Set();
  const dbSet = new Set();
  const toolSet = new Set();

  repos?.forEach((r) => {
    const name = (r.name || '').toLowerCase();
    const lang = (r.language || '').toLowerCase();
    if (name.includes('react') || lang === 'react') fwSet.add('React');
    if (name.includes('node') || lang === 'javascript') fwSet.add('Node.js');
    if (name.includes('next')) fwSet.add('Next.js');
    if (name.includes('express')) fwSet.add('Express.js');
    if (name.includes('vue') || lang === 'vue') fwSet.add('Vue.js');
    if (name.includes('angular') || lang === 'typescript') fwSet.add('Angular');
    if (name.includes('spring') || lang === 'java') fwSet.add('Spring Boot');
    if (name.includes('django') || name.includes('python')) fwSet.add('Django');
    if (name.includes('flask')) fwSet.add('Flask');
    if (name.includes('tailwind') || name.includes('css')) fwSet.add('Tailwind CSS');
    if (name.includes('bootstrap')) fwSet.add('Bootstrap');
    if (name.includes('mongodb') || name.includes('mongo')) dbSet.add('MongoDB');
    if (name.includes('postgres') || name.includes('sql')) dbSet.add('PostgreSQL');
    if (name.includes('mysql')) dbSet.add('MySQL');
    if (name.includes('redis')) dbSet.add('Redis');
    if (name.includes('sqlite')) dbSet.add('SQLite');
    if (name.includes('docker')) toolSet.add('Docker');
    if (name.includes('kubernetes') || name.includes('k8s')) toolSet.add('Kubernetes');
    if (name.includes('aws')) toolSet.add('AWS');
    if (name.includes('firebase')) toolSet.add('Firebase');
    if (name.includes('git')) toolSet.add('Git');
    if (name.includes('ci') || name.includes('cd')) toolSet.add('CI/CD');
  });

  if (langs.includes('JavaScript')) fwSet.add('JavaScript');
  if (langs.includes('TypeScript')) fwSet.add('TypeScript');
  if (langs.includes('Python')) fwSet.add('Python');
  if (langs.includes('Java')) fwSet.add('Java');
  if (langs.includes('C++')) fwSet.add('C++');
  if (langs.includes('Go')) fwSet.add('Go');
  if (langs.includes('Rust')) fwSet.add('Rust');
  if (langs.includes('SQL')) dbSet.add('SQL');
  if (langs.includes('HTML')) fwSet.add('HTML');
  if (langs.includes('CSS')) fwSet.add('CSS');

  toolSet.add('Git');
  toolSet.add('GitHub');

  return {
    languages: [...new Set([...langs, ...Array.from(fwSet).filter((f) => ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust'].includes(f))])],
    frameworks: Array.from(fwSet).filter((f) => !['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust'].includes(f)),
    databases: Array.from(dbSet),
    tools: Array.from(toolSet),
  };
}

export function useResume() {
  const { user } = useAuth();
  const { data: ghData, loading: ghLoading } = useGitHub();
  const { data: lcData, loading: lcLoading } = useLeetCode();
  const { data: hrData, loading: hrLoading } = useHackerRank();
  const { allProjects, loading: projectsLoading } = useProjects();

  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [activeTemplate, setActiveTemplate] = useState('modern');

  const loading = ghLoading || lcLoading || hrLoading || projectsLoading;

  useEffect(() => {
    if (!user && !ghData && !lcData) return;

    const personal = {
      name: user?.name || ghData?.profile?.name || lcData?.username || '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      github: ghData?.username || '',
      portfolio: '',
      summary: '',
    };

    const skills = deriveSkillsFromLanguages(ghData?.languages, ghData?.repos);

    const projects = (allProjects || [])
      .filter((p) => p.status !== 'archived')
      .slice(0, 4)
      .map((p) => ({
        name: p.name,
        description: p.description,
        technologies: p.techStack || [],
        githubUrl: p.githubUrl || '',
        liveUrl: p.liveUrl || '',
      }));

    const codingProfiles = {
      github: {
        username: ghData?.username || '',
        stars: (ghData?.repos || []).reduce((a, r) => a + (r.stars || 0), 0),
        repos: ghData?.public_repos || 0,
        commits: ghData?.totalCommits || 0,
      },
      leetcode: {
        username: lcData?.username || '',
        solved: lcData?.total || 0,
        easy: lcData?.easy || 0,
        medium: lcData?.medium || 0,
        hard: lcData?.hard || 0,
      },
      hackerrank: {
        username: hrData?.username || '',
        solved: hrData?.totalSolved || hrData?.problemsSolved?.total || 0,
        badge: hrData?.hackerBadge || '',
      },
    };

    const stars = codingProfiles.github.stars;
    const lcSolved = codingProfiles.leetcode.solved;
    const hrSolved = codingProfiles.hackerrank.solved;
    const achievements = [];
    if (stars >= 50) achievements.push(`${stars} GitHub Stars`);
    else if (stars >= 10) achievements.push(`${stars} GitHub Stars`);
    if (lcSolved >= 100) achievements.push(`${lcSolved} LeetCode Problems Solved`);
    else if (lcSolved >= 50) achievements.push(`${lcSolved} LeetCode Problems Solved`);
    if (hrSolved >= 50) achievements.push(`${hrSolved} HackerRank Problems Solved`);
    if (ghData?.totalCommits >= 200) achievements.push(`${ghData.totalCommits} GitHub Commits`);
    achievements.push('DevTrack Certified Developer');

    setResume((prev) => ({
      ...prev,
      personal,
      skills,
      projects,
      codingProfiles,
      achievements,
    }));
  }, [user, ghData, lcData, hrData, allProjects]);

  const updatePersonal = useCallback((field, value) => {
    setResume((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  }, []);

  const updateEducation = useCallback((index, field, value) => {
    setResume((prev) => {
      const edu = [...prev.education];
      edu[index] = { ...edu[index], [field]: value };
      return { ...prev, education: edu };
    });
  }, []);

  const addEducation = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { college: '', degree: '', cgpa: '', year: '' }],
    }));
  }, []);

  const removeEducation = useCallback((index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  const updateSkills = useCallback((category, skills) => {
    setResume((prev) => ({ ...prev, skills: { ...prev.skills, [category]: skills } }));
  }, []);

  const updateExperience = useCallback((index, field, value) => {
    setResume((prev) => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: value };
      return { ...prev, experience: exp };
    });
  }, []);

  const addExperience = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', duration: '', description: '' }],
    }));
  }, []);

  const removeExperience = useCallback((index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }, []);

  const setTemplate = useCallback((t) => setActiveTemplate(t), []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    resume,
    activeTemplate,
    loading,
    updatePersonal,
    updateEducation,
    addEducation,
    removeEducation,
    updateSkills,
    updateExperience,
    addExperience,
    removeExperience,
    setTemplate,
    handlePrint,
  };
}
