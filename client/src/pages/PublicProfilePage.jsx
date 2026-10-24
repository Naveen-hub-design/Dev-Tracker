import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile } from '../api/public';
import BadgeModal from '../components/badge/BadgeModal';
import {
  Github,
  Code2,
  Trophy,
  Award,
  ExternalLink,
  Flame,
  CheckCircle,
  Share2,
  Copy,
  Check,
  Star,
  GitBranch,
  Shield,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import Button from '../components/ui/Button';

function ScoreRing({ score = 0, size = 110, strokeWidth = 9 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          fill="transparent"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums leading-none">
          {score}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 mt-1">/ 100</span>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const { identifier } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await getPublicProfile(identifier);
        if (isMounted) setData(res);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Developer profile not found');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [identifier]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center animate-pulse mb-4">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading developer profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Profile Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            No developer registered with identifier &ldquo;{identifier}&rdquo;.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/">
              <Button variant="primary" size="sm">Go to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, score, platforms, projects, certificates, streaks } = data;
  const primaryHandle = user.githubUsername || user.codeforcesUsername || user.leetcodeUsername || user.name;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              DevTrack
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBadgeModalOpen(true)}
              className="hidden sm:inline-flex"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              README Badge
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </Button>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Get Your Profile <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Developer Identity */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md ring-4 ring-white dark:ring-slate-800">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full shadow">
                  <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 dark:fill-blue-400" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                    Verified Developer
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {user.githubUsername && (
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" /> @{user.githubUsername}
                    </a>
                  )}
                  {user.codeforcesUsername && (
                    <a
                      href={`https://codeforces.com/profile/${user.codeforcesUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> CF: {user.codeforcesUsername}
                    </a>
                  )}
                  {user.leetcodeUsername && (
                    <a
                      href={`https://leetcode.com/${user.leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-yellow-600 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5 text-yellow-500" /> LC: {user.leetcodeUsername}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50">
                    <Sparkles className="w-3.5 h-3.5" />
                    {score.companyLevel}
                  </span>
                  {streaks?.longest > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
                      <Flame className="w-3.5 h-3.5" />
                      {streaks.longest} Day Streak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Score Ring Display */}
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 self-start md:self-auto">
              <ScoreRing score={score.developerScore} />
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Placement Score</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  Top Tier Readiness
                </p>
                <button
                  onClick={() => setBadgeModalOpen(true)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1"
                >
                  Embed README Badge <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* GitHub Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">GitHub Activity</h3>
                    <p className="text-[11px] text-slate-400">Open Source &amp; Commits</p>
                  </div>
                </div>
              </div>

              {platforms.github ? (
                <div className="grid grid-cols-3 gap-2 text-center py-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100">{platforms.github.commits}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">Commits</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100">{platforms.github.stars}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">Stars</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100">{platforms.github.repos}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">Repos</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-4">No GitHub account linked.</p>
              )}
            </div>

            {platforms.github?.languages && Object.keys(platforms.github.languages).length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">Top Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(platforms.github.languages).slice(0, 4).map((lang) => (
                    <span key={lang} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LeetCode Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">LeetCode DSA</h3>
                    <p className="text-[11px] text-slate-400">Data Structures &amp; Algorithms</p>
                  </div>
                </div>
              </div>

              {platforms.leetcode ? (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{platforms.leetcode.solved}</span>
                    <span className="text-xs font-semibold text-slate-400">Problems Solved</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      <p className="text-sm font-bold">{platforms.leetcode.easy}</p>
                      <p className="text-[10px]">Easy</p>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                      <p className="text-sm font-bold">{platforms.leetcode.medium}</p>
                      <p className="text-[10px]">Medium</p>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                      <p className="text-sm font-bold">{platforms.leetcode.hard}</p>
                      <p className="text-[10px]">Hard</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-4">No LeetCode account linked.</p>
              )}
            </div>

            {platforms.leetcode?.acceptanceRate > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Acceptance Rate</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{platforms.leetcode.acceptanceRate}%</span>
              </div>
            )}
          </div>

          {/* Codeforces Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Codeforces CP</h3>
                    <p className="text-[11px] text-slate-400">Contest Rating &amp; Ranks</p>
                  </div>
                </div>
              </div>

              {platforms.codeforces ? (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                        {platforms.codeforces.rating || 'Unrated'}
                      </span>
                      <span className="text-xs font-semibold text-blue-500 capitalize ml-2">
                        {platforms.codeforces.rank}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Peak: {platforms.codeforces.maxRating || platforms.codeforces.rating}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Contest Problems Solved</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{platforms.codeforces.solved} solved</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-4">No Codeforces account linked.</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>HackerRank</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {platforms.hackerrank ? `${platforms.hackerrank.solved} solved` : 'Not connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Projects Section */}
        {projects && projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Featured Projects</h2>
                <p className="text-xs text-slate-500">Verified portfolio repositories and deployments</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">{projects.length} Projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{proj.name}</h3>
                      {proj.stars > 0 && (
                        <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> {proj.stars}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                        {proj.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(proj.techStack || []).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" /> Repository
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certificates && certificates.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Verified Certifications</h2>
                <p className="text-xs text-slate-500">Official technical credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{cert.name}</p>
                    <p className="text-xs text-slate-400">{cert.issuer}</p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        Verify Credential <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GitHub README Badge Embed Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Display your DevTrack badge on GitHub</h3>
            <p className="text-xs text-blue-100 max-w-lg">
              Embed this live, auto-updating stats card into your GitHub profile README.md to impress recruiters and fellow developers.
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50 border-0 shrink-0 shadow-md"
            onClick={() => setBadgeModalOpen(true)}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            Get README Badge
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-400">
        <p>Powered by <span className="font-bold text-slate-700 dark:text-slate-300">DevTrack</span> — Developer Productivity &amp; Career Placement Readiness</p>
      </footer>

      {/* Badge Modal */}
      <BadgeModal
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        username={primaryHandle}
        profileUrl={window.location.href}
      />
    </div>
  );
}
