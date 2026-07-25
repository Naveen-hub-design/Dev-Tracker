import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGitHub } from './useGitHub';
import { useLeetCode } from './useLeetCode';
import { useAuth } from '../context/AuthContext';
import { calculateJobMatchScore } from '../utils/jobMatchScore';

const ROLE_DEFINITIONS = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: 'Layout',
    color: 'blue',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Git'],
    weight: { javascript: 0.25, react: 0.25, typescript: 0.15, css: 0.1, html: 0.1, git: 0.15 },
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: 'Server',
    color: 'emerald',
    skills: ['Java', 'Spring Boot', 'SQL', 'Git', 'GitHub', 'Problem Solving'],
    weight: { java: 0.25, sql: 0.2, springBoot: 0.15, git: 0.15, github: 0.1, problemSolving: 0.15 },
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    icon: 'Layers',
    color: 'purple',
    skills: ['React', 'JavaScript', 'Java', 'SQL', 'Git', 'GitHub'],
    weight: { react: 0.15, javascript: 0.15, java: 0.15, sql: 0.15, git: 0.15, github: 0.1, problemSolving: 0.15 },
  },
  {
    id: 'java',
    title: 'Java Developer',
    icon: 'Coffee',
    color: 'amber',
    skills: ['Java', 'Spring Boot', 'SQL', 'Git', 'Problem Solving'],
    weight: { java: 0.35, springBoot: 0.2, sql: 0.15, git: 0.15, problemSolving: 0.15 },
  },
  {
    id: 'react',
    title: 'React Developer',
    icon: 'Atom',
    color: 'cyan',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Git'],
    weight: { react: 0.35, javascript: 0.25, typescript: 0.15, css: 0.1, git: 0.15 },
  },
  {
    id: 'ai',
    title: 'AI Engineer',
    icon: 'Brain',
    color: 'rose',
    skills: ['Python', 'Problem Solving', 'SQL', 'Git', 'JavaScript'],
    weight: { python: 0.3, problemSolving: 0.25, sql: 0.15, git: 0.15, javascript: 0.15 },
  },
];

function deriveSkills(githubData, leetcodeData) {
  const langs = githubData?.languages || {};
  const repos = githubData?.repos || [];
  const totalCommits = githubData?.totalCommits || 0;
  const repoCount = githubData?.public_repos || 0;
  const commitActivity = githubData?.commitActivity || [];
  const activeWeeks = commitActivity.filter((c) => c > 0).length;
  const lcTotal = leetcodeData?.total || 0;
  const lcHard = leetcodeData?.hard || 0;
  const lcMedium = leetcodeData?.medium || 0;

  const hasReact = repos.some((r) => (r.language || '').toLowerCase() === 'react' || (r.name || '').toLowerCase().includes('react'));
  const hasNode = repos.some((r) => (r.language || '').toLowerCase() === 'javascript' || (r.name || '').toLowerCase().includes('node'));
  const hasJava = repos.some((r) => (r.language || '').toLowerCase() === 'java' || (r.name || '').toLowerCase().includes('java'));
  const hasPython = repos.some((r) => (r.language || '').toLowerCase() === 'python');
  const hasTypeScript = repos.some((r) => (r.language || '').toLowerCase() === 'typescript');

  const jsPercent = langs.JavaScript || 0;
  const tsPercent = langs.TypeScript || 0;
  const cssPercent = langs.CSS || 0;
  const htmlPercent = langs.HTML || 0;

  const scale = (val, max) => Math.min(100, Math.round((val / max) * 100));

  const skillMap = {
    java: hasJava ? Math.min(100, 30 + (langs.Java || 0) * 2) : Math.min(100, langs.Java || 0),
    springBoot: hasJava && (hasNode || totalCommits > 50) ? 45 : hasJava ? 25 : 0,
    react: hasReact ? Math.min(100, 40 + jsPercent) : Math.min(100, jsPercent * 0.5),
    javascript: Math.min(100, jsPercent + (hasNode ? 20 : 0)),
    typescript: hasTypeScript ? Math.min(100, 30 + tsPercent * 2) : Math.min(100, tsPercent),
    sql: scale(repoCount + totalCommits * 0.1, 30),
    git: Math.min(100, scale(totalCommits, 300) + (activeWeeks > 4 ? 20 : 0)),
    github: Math.min(100, scale(repoCount, 10) + scale(totalCommits, 200)),
    problemSolving: Math.min(100, scale(lcTotal, 200) + (lcHard * 3)),
    css: Math.min(100, cssPercent + (hasReact ? 15 : 0)),
    html: Math.min(100, htmlPercent + 10),
    python: hasPython ? Math.min(100, 30 + (langs.Python || 0) * 2) : Math.min(100, langs.Python || 0),
  };

  return skillMap;
}

function computeRoleReadiness(skills, role) {
  let score = 0;
  const entries = Object.entries(role.weight);
  entries.forEach(([skill, weight]) => {
    score += (skills[skill] || 0) * weight;
  });
  return Math.min(100, Math.round(score));
}

function deriveSuggestions(skills, jobMatch) {
  const suggestions = [];
  if ((skills.java || 0) < 30) suggestions.push({ text: 'Learn Java fundamentals and OOP concepts', priority: 'high', category: 'Language' });
  if ((skills.springBoot || 0) < 20) suggestions.push({ text: 'Build REST APIs with Spring Boot', priority: 'high', category: 'Framework' });
  if ((skills.react || 0) < 30) suggestions.push({ text: 'Create React projects with hooks and context', priority: 'high', category: 'Framework' });
  if ((skills.typescript || 0) < 30) suggestions.push({ text: 'Add TypeScript to your JavaScript projects', priority: 'medium', category: 'Language' });
  if ((skills.problemSolving || 0) < 40) suggestions.push({ text: 'Increase LeetCode Hard problems solved', priority: 'high', category: 'Problem Solving' });
  if ((skills.python || 0) < 20) suggestions.push({ text: 'Learn Python for AI/ML engineering roles', priority: 'medium', category: 'Language' });
  if ((skills.sql || 0) < 30) suggestions.push({ text: 'Practice SQL queries and database design', priority: 'medium', category: 'Database' });
  if ((skills.git || 0) < 40) suggestions.push({ text: 'Contribute to Open Source on GitHub', priority: 'high', category: 'Open Source' });

  const breakdown = jobMatch?.breakdown || {};
  if ((breakdown.projects || 0) < 10) suggestions.push({ text: 'Build full-stack projects with React + Node.js', priority: 'high', category: 'Projects' });
  if ((breakdown.streak || 0) < 5) suggestions.push({ text: 'Maintain a consistent 7+ day coding streak', priority: 'medium', category: 'Consistency' });
  if ((skills.docker || 0) < 20) suggestions.push({ text: 'Learn Docker for containerized deployments', priority: 'low', category: 'DevOps' });

  return suggestions.sort((a, b) => {
    const pri = { high: 0, medium: 1, low: 2 };
    return (pri[a.priority] || 2) - (pri[b.priority] || 2);
  }).slice(0, 6);
}

function deriveResumeScore(skills, jobMatch, githubData) {
  const portfolio = Math.min(100, ((githubData?.public_repos || 0) * 10) + ((skills.react || 0) > 30 ? 20 : 0) + ((skills.java || 0) > 30 ? 20 : 0));
  const github = Math.min(100, Math.round((githubData?.totalCommits || 0) / 3) + (githubData?.followers || 0) * 2);
  const coding = jobMatch?.totalScore || 0;
  const overall = Math.round(portfolio * 0.3 + github * 0.35 + coding * 0.35);
  return { portfolio: Math.min(100, portfolio), github: Math.min(100, github), coding, overall };
}

export function useJobMatch() {
  const { user } = useAuth();
  const { data: ghData, loading: ghLoading } = useGitHub();
  const { data: lcData, loading: lcLoading } = useLeetCode();

  const loading = ghLoading || lcLoading;

  const jobMatch = useMemo(() => {
    if (!ghData && !lcData) return null;
    return calculateJobMatchScore(
      {
        public_repos: ghData?.public_repos,
        totalCommits: ghData?.totalCommits,
        repos: ghData?.repos,
        commitActivity: ghData?.commitActivity,
      },
      lcData
    );
  }, [ghData, lcData]);

  const skills = useMemo(() => deriveSkills(ghData, lcData), [ghData, lcData]);

  const roleReadiness = useMemo(() => {
    return ROLE_DEFINITIONS.map((role) => ({
      ...role,
      score: computeRoleReadiness(skills, role),
    }));
  }, [skills]);

  const skillList = useMemo(() => {
    const labels = {
      java: 'Java', springBoot: 'Spring Boot', react: 'React', javascript: 'JavaScript',
      typescript: 'TypeScript', sql: 'SQL', git: 'Git', github: 'GitHub',
      problemSolving: 'Problem Solving', css: 'CSS', html: 'HTML', python: 'Python',
    };
    return Object.entries(labels).map(([key, label]) => ({
      key,
      label,
      score: skills[key] || 0,
    })).sort((a, b) => b.score - a.score);
  }, [skills]);

  const suggestions = useMemo(() => deriveSuggestions(skills, jobMatch), [skills, jobMatch]);

  const resumeScore = useMemo(() => deriveResumeScore(skills, jobMatch, ghData), [skills, jobMatch, ghData]);

  const recommendedJobs = useMemo(() => {
    return roleReadiness
      .filter((r) => r.score >= 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [roleReadiness]);

  return {
    jobMatch,
    skills,
    skillList,
    roleReadiness,
    suggestions,
    resumeScore,
    recommendedJobs,
    loading,
    githubData: ghData,
    leetcodeData: lcData,
  };
}
