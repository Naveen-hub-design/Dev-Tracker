import { useMemo } from 'react';
import { useGitHub } from './useGitHub';
import { useLeetCode } from './useLeetCode';
import { useHackerRank } from './useHackerRank';
import { useProjects } from './useProjects';
import { useResume } from './useResume';
import { useCertificates } from './useCertificates';
import { useGoals } from './useGoals';

function clamp(val, max = 100) {
  return Math.max(0, Math.min(max, Math.round(val)));
}

function computeGitHubScore(gh) {
  if (!gh) return { score: 0, breakdown: {} };
  const repos = gh.public_repos || 0;
  const commits = gh.totalCommits || 0;
  const stars = (gh.repos || []).reduce((a, r) => a + (r.stars || 0), 0);
  const followers = gh.followers || 0;
  const langs = Object.keys(gh.languages || {}).length;
  const activity = (gh.commitActivity || []).filter((w) => w > 0).length;

  const repoScore = clamp((repos / 15) * 100);
  const commitScore = clamp((commits / 300) * 100);
  const starScore = clamp((stars / 30) * 100);
  const followerScore = clamp((followers / 20) * 100);
  const langScore = clamp((langs / 5) * 100);
  const activityScore = clamp((activity / 12) * 100);

  const score = clamp(
    repoScore * 0.2 + commitScore * 0.25 + starScore * 0.15 +
    followerScore * 0.1 + langScore * 0.15 + activityScore * 0.15
  );

  return {
    score,
    breakdown: { repos, commits, stars, followers, languages: langs, activeWeeks: activity },
    detail: { repoScore, commitScore, starScore, followerScore, langScore, activityScore },
  };
}

function computeLeetCodeScore(lc) {
  if (!lc) return { score: 0, breakdown: {} };
  const total = lc.total || 0;
  const easy = lc.easy || 0;
  const medium = lc.medium || 0;
  const hard = lc.hard || 0;

  const totalScore = clamp((total / 300) * 100);
  const easyScore = clamp((easy / 150) * 100);
  const medScore = clamp((medium / 100) * 100);
  const hardScore = clamp((hard / 50) * 100);
  const difficultyScore = clamp(
    total > 0 ? ((easy * 1 + medium * 2 + hard * 4) / (total * 2)) * 100 : 0
  );

  const score = clamp(
    totalScore * 0.3 + easyScore * 0.1 + medScore * 0.2 + hardScore * 0.2 + difficultyScore * 0.2
  );

  return {
    score,
    breakdown: { total, easy, medium, hard },
    detail: { totalScore, easyScore, medScore, hardScore, difficultyScore },
  };
}

function computeProjectScore(projects, stats) {
  if (!projects || projects.length === 0) return { score: 0, breakdown: {} };
  const total = stats?.total || projects.length;
  const completed = stats?.completed || projects.filter((p) => p.status === 'completed').length;
  const linked = stats?.linked || projects.filter((p) => p.githubUrl).length;
  const live = projects.filter((p) => p.liveUrl).length;
  const techSet = new Set();
  projects.forEach((p) => p.techStack?.forEach((t) => techSet.add(t)));

  const totalScore = clamp((total / 6) * 100);
  const completedScore = clamp((completed / 4) * 100);
  const linkedScore = clamp((linked / 4) * 100);
  const liveScore = clamp((live / 2) * 100);
  const techScore = clamp((techSet.size / 8) * 100);

  const score = clamp(
    totalScore * 0.2 + completedScore * 0.25 + linkedScore * 0.2 + liveScore * 0.15 + techScore * 0.2
  );

  return {
    score,
    breakdown: { total, completed, linked, live, techDiversity: techSet.size },
    detail: { totalScore, completedScore, linkedScore, liveScore, techScore },
  };
}

function computeResumeScore(resume) {
  if (!resume) return { score: 0, breakdown: {} };
  const hasName = !!resume.personal?.name;
  const hasEmail = !!resume.personal?.email;
  const hasLinkedin = !!resume.personal?.linkedin;
  const hasPortfolio = !!resume.personal?.portfolio;
  const hasSummary = !!resume.personal?.summary && resume.personal.summary.length > 20;
  const hasGithub = !!resume.personal?.github;
  const totalLangs = (resume.skills?.languages || []).length;
  const totalFws = (resume.skills?.frameworks || []).length;
  const totalDbs = (resume.skills?.databases || []).length;
  const totalTools = (resume.skills?.tools || []).length;
  const totalSkills = totalLangs + totalFws + totalDbs + totalTools;

  const fields = [hasName, hasEmail, hasLinkedin, hasPortfolio, hasSummary, hasGithub];
  const fieldsScore = clamp((fields.filter(Boolean).length / fields.length) * 100);
  const skillScore = clamp((totalSkills / 12) * 100);

  const score = clamp(fieldsScore * 0.5 + skillScore * 0.5);

  return {
    score,
    breakdown: {
      hasName, hasEmail, hasLinkedin, hasPortfolio, hasSummary, hasGithub,
      languages: totalLangs, frameworks: totalFws, databases: totalDbs, tools: totalTools,
    },
  };
}

function computeAchievementScore(certs, goals) {
  const certCount = certs?.length || 0;
  const achievements = goals?.achievements || [];
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const streaks = goals?.streaks || {};
  const longest = streaks.longest || 0;

  const certScore = clamp((certCount / 4) * 100);
  const badgeScore = clamp((unlocked / 6) * 100);
  const streakScore = clamp((longest / 30) * 100);

  const score = clamp(certScore * 0.4 + badgeScore * 0.35 + streakScore * 0.25);

  return {
    score,
    breakdown: { certificates: certCount, badges: unlocked, longestStreak: longest },
  };
}

function computeSkillScore(ghData, lcData) {
  const langs = Object.keys(ghData?.languages || {});
  const repos = ghData?.repos || [];
  const hasReact = repos.some((r) => (r.name || '').toLowerCase().includes('react') || (r.language || '').toLowerCase() === 'react');
  const hasNode = repos.some((r) => (r.name || '').toLowerCase().includes('node'));
  const hasJava = repos.some((r) => (r.language || '').toLowerCase() === 'java');
  const hasPython = repos.some((r) => (r.language || '').toLowerCase() === 'python');
  const hasDocker = repos.some((r) => (r.name || '').toLowerCase().includes('docker'));

  const programming = langs.length;
  const frameworks = [hasReact, hasNode, hasJava, hasPython].filter(Boolean).length;
  const tools = [hasDocker, ghData?.totalCommits > 100].filter(Boolean).length;
  const total = programming + frameworks + tools;

  const langScore = clamp((programming / 5) * 100);
  const fwScore = clamp((frameworks / 4) * 100);
  const toolScore = clamp((tools / 3) * 100);

  const score = clamp(langScore * 0.4 + fwScore * 0.35 + toolScore * 0.25);

  return {
    score,
    breakdown: { programming, frameworks, tools, allLanguages: langs },
    detail: { langScore, fwScore, toolScore },
  };
}

function generateRecommendations(scores) {
  const recs = [];
  const { github, leetcode, projects, resume, achievements, skills } = scores;

  if (github.score < 50) {
    recs.push({ text: 'Push more commits to GitHub — aim for 3+ per week', category: 'GitHub', priority: 'high', icon: 'Github' });
    if (github.breakdown.stars < 5) recs.push({ text: 'Star-worthy repos attract recruiters — polish your READMEs', category: 'GitHub', priority: 'medium', icon: 'Github' });
    if (github.breakdown.languages < 3) recs.push({ text: 'Diversify your languages — try TypeScript, Python, or Go', category: 'GitHub', priority: 'medium', icon: 'Github' });
  }

  if (leetcode.score < 50) {
    recs.push({ text: 'Solve 50 more LeetCode problems to reach placement threshold', category: 'LeetCode', priority: 'high', icon: 'Code2' });
    if (leetcode.breakdown.hard < 5) recs.push({ text: 'Solve at least 5 Hard problems to impress interviewers', category: 'LeetCode', priority: 'high', icon: 'Code2' });
    if (leetcode.breakdown.medium < 30) recs.push({ text: 'Focus on Medium problems — they dominate coding interviews', category: 'LeetCode', priority: 'medium', icon: 'Code2' });
  }

  if (projects.score < 50) {
    recs.push({ text: 'Build 2 more full-stack projects with live deployments', category: 'Projects', priority: 'high', icon: 'FolderKanban' });
    if (projects.breakdown.techDiversity < 4) recs.push({ text: 'Use diverse tech stacks — React + Node + PostgreSQL', category: 'Projects', priority: 'medium', icon: 'FolderKanban' });
    if (projects.breakdown.live < 1) recs.push({ text: 'Deploy at least one project with a live URL', category: 'Projects', priority: 'high', icon: 'FolderKanban' });
  }

  if (resume.score < 60) {
    if (!resume.breakdown.hasLinkedin) recs.push({ text: 'Add your LinkedIn profile to your resume', category: 'Resume', priority: 'high', icon: 'FileText' });
    if (!resume.breakdown.hasPortfolio) recs.push({ text: 'Deploy your portfolio website and add the link', category: 'Resume', priority: 'high', icon: 'FileText' });
    if (!resume.breakdown.hasSummary) recs.push({ text: 'Write a compelling resume summary (3-4 sentences)', category: 'Resume', priority: 'medium', icon: 'FileText' });
  }

  if (achievements.score < 40) {
    recs.push({ text: 'Complete the AWS Cloud Practitioner certification', category: 'Achievements', priority: 'medium', icon: 'Award' });
    recs.push({ text: 'Maintain a 14+ day coding streak for badges', category: 'Achievements', priority: 'low', icon: 'Target' });
  }

  if (skills.score < 50) {
    if (skills.breakdown.frameworks < 2) recs.push({ text: 'Learn Spring Boot for backend or React for frontend', category: 'Skills', priority: 'high', icon: 'Brain' });
    if (skills.breakdown.tools < 2) recs.push({ text: 'Add Docker, CI/CD, or cloud tools to your toolkit', category: 'Skills', priority: 'medium', icon: 'Brain' });
  }

  return recs.sort((a, b) => {
    const pri = { high: 0, medium: 1, low: 2 };
    return (pri[a.priority] || 2) - (pri[b.priority] || 2);
  });
}

function getPlacementLevel(score) {
  if (score >= 85) return { level: 'Placement Ready', color: 'emerald', description: 'You are well-prepared for placement interviews!' };
  if (score >= 65) return { level: 'Advanced', color: 'blue', description: 'Strong foundation — refine weak areas to be placement ready.' };
  if (score >= 40) return { level: 'Intermediate', color: 'amber', description: 'Good progress — focus on consistency and depth.' };
  return { level: 'Beginner', color: 'slate', description: 'Building foundations — keep pushing daily.' };
}

export default function useJobReadiness() {
  const { data: ghData, loading: ghLoading } = useGitHub();
  const { data: lcData, loading: lcLoading } = useLeetCode();
  const { data: hrData, loading: hrLoading } = useHackerRank();
  const { allProjects, stats: projectStats, loading: projLoading } = useProjects();
  const { resume, loading: resumeLoading } = useResume();
  const { allCerts, stats: certStats } = useCertificates();
  const { streaks, achievements } = useGoals();

  const loading = ghLoading || lcLoading || hrLoading || projLoading || resumeLoading;

  const github = useMemo(() => computeGitHubScore(ghData), [ghData]);
  const leetcode = useMemo(() => computeLeetCodeScore(lcData), [lcData]);
  const projects = useMemo(() => computeProjectScore(allProjects, projectStats), [allProjects, projectStats]);
  const resumeScore = useMemo(() => computeResumeScore(resume), [resume]);
  const achievementsData = useMemo(() => computeAchievementScore(allCerts, { achievements, streaks }), [allCerts, achievements, streaks]);
  const skills = useMemo(() => computeSkillScore(ghData, lcData), [ghData, lcData]);

  const overallScore = useMemo(() => {
    return clamp(
      github.score * 0.2 +
      leetcode.score * 0.2 +
      projects.score * 0.2 +
      resumeScore.score * 0.15 +
      skills.score * 0.15 +
      achievementsData.score * 0.1
    );
  }, [github.score, leetcode.score, projects.score, resumeScore.score, skills.score, achievementsData.score]);

  const placementLevel = useMemo(() => getPlacementLevel(overallScore), [overallScore]);

  const scoreCategories = useMemo(() => [
    { key: 'github', label: 'GitHub', score: github.score, color: 'slate', icon: 'Github', weight: '20%', breakdown: github.breakdown },
    { key: 'leetcode', label: 'LeetCode', score: leetcode.score, color: 'amber', icon: 'Code2', weight: '20%', breakdown: leetcode.breakdown },
    { key: 'projects', label: 'Projects', score: projects.score, color: 'blue', icon: 'FolderKanban', weight: '20%', breakdown: projects.breakdown },
    { key: 'resume', label: 'Resume & Profile', score: resumeScore.score, color: 'purple', icon: 'FileText', weight: '15%', breakdown: resumeScore.breakdown },
    { key: 'skills', label: 'Skills', score: skills.score, color: 'cyan', icon: 'Brain', weight: '15%', breakdown: skills.breakdown },
    { key: 'achievements', label: 'Achievements', score: achievementsData.score, color: 'emerald', icon: 'Award', weight: '10%', breakdown: achievementsData.breakdown },
  ], [github, leetcode, projects, resumeScore, skills, achievementsData]);

  const radarData = useMemo(() => [
    { subject: 'GitHub', score: github.score },
    { subject: 'LeetCode', score: leetcode.score },
    { subject: 'Projects', score: projects.score },
    { subject: 'Resume', score: resumeScore.score },
    { subject: 'Skills', score: skills.score },
    { subject: 'Achievements', score: achievementsData.score },
  ], [github, leetcode, projects, resumeScore, skills, achievementsData]);

  const recommendations = useMemo(() => generateRecommendations({
    github, leetcode, projects, resume: resumeScore, achievements: achievementsData, skills,
  }), [github, leetcode, projects, resumeScore, achievementsData, skills]);

  const strengths = useMemo(() => {
    return scoreCategories.filter((c) => c.score >= 60).sort((a, b) => b.score - a.score);
  }, [scoreCategories]);

  const weaknesses = useMemo(() => {
    return scoreCategories.filter((c) => c.score < 50).sort((a, b) => a.score - b.score);
  }, [scoreCategories]);

  const missingSkills = useMemo(() => {
    const missing = [];
    if (skills.breakdown.frameworks < 2) missing.push('Spring Boot / Express.js');
    if (skills.breakdown.tools < 2) missing.push('Docker / CI-CD');
    if (!github?.breakdown?.activeWeeks || github.breakdown.activeWeeks < 4) missing.push('Open Source Contributions');
    if (leetcode.breakdown.hard < 5) missing.push('Hard Problem Solving');
    if (projects.breakdown.live < 1) missing.push('Live Deployments');
    return missing;
  }, [skills, github, leetcode, projects]);

  const learningPath = useMemo(() => {
    const path = [];
    if (skills.score < 40) path.push({ step: 1, title: 'Strengthen Core Skills', desc: 'Master one language deeply + learn a framework', timeline: '2-4 weeks' });
    if (projects.score < 50) path.push({ step: path.length + 1, title: 'Build Real Projects', desc: 'Create 3+ portfolio projects with live URLs', timeline: '4-6 weeks' });
    if (leetcode.score < 50) path.push({ step: path.length + 1, title: 'Practice DSA', desc: 'Solve 100+ LeetCode problems focusing on Mediums', timeline: '4-8 weeks' });
    if (resume.score < 60) path.push({ step: path.length + 1, title: 'Polish Resume', desc: 'Complete LinkedIn, portfolio, and write a strong summary', timeline: '1 week' });
    if (achievementsData.score < 40) path.push({ step: path.length + 1, title: 'Earn Certifications', desc: 'Get AWS Cloud Practitioner or similar', timeline: '2-4 weeks' });
    path.push({ step: path.length + 1, title: 'Apply & Interview', desc: 'Start applying and practice mock interviews', timeline: 'Ongoing' });
    return path;
  }, [skills, projects, leetcode, resume, achievementsData]);

  const checklist = useMemo(() => [
    { label: 'GitHub profile with 10+ repos', done: (ghData?.public_repos || 0) >= 10 },
    { label: '200+ GitHub commits', done: (ghData?.totalCommits || 0) >= 200 },
    { label: '100+ LeetCode problems solved', done: (lcData?.total || 0) >= 100 },
    { label: '5+ Medium/Hard LeetCode problems', done: ((lcData?.medium || 0) + (lcData?.hard || 0)) >= 5 },
    { label: '3+ completed projects', done: (projectStats?.completed || 0) >= 3 },
    { label: '1+ live deployed project', done: allProjects?.some((p) => p.liveUrl) },
    { label: 'LinkedIn profile linked', done: !!resume?.personal?.linkedin },
    { label: 'Portfolio website', done: !!resume?.personal?.portfolio },
    { label: 'Resume summary written', done: !!resume?.personal?.summary && resume.personal.summary.length > 20 },
    { label: '2+ programming languages', done: (skills.breakdown?.programming || 0) >= 2 },
    { label: 'At least 1 certification', done: (certStats?.total || 0) >= 1 },
    { label: '7+ day coding streak', done: (streaks?.longest || 0) >= 7 },
  ], [ghData, lcData, projectStats, allProjects, resume, skills, certStats, streaks]);

  return {
    loading,
    overallScore,
    placementLevel,
    scoreCategories,
    radarData,
    recommendations,
    strengths,
    weaknesses,
    missingSkills,
    learningPath,
    checklist,
    github: { ...github, data: ghData },
    leetcode: { ...leetcode, data: lcData },
    projects: { ...projects, data: allProjects, stats: projectStats },
    resume: resumeScore,
    skills,
    achievements: achievementsData,
  };
}
