import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  FileSearch,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';

const SAMPLE_JDS = [
  {
    title: 'Full-Stack Developer (MERN)',
    text: `We are looking for a Full-Stack Engineer with strong experience in React, Node.js, Express, and PostgreSQL/MongoDB.
Requirements:
- 1-3 years building production web applications
- Proficient in JavaScript / TypeScript and Tailwind CSS
- Hands-on experience with RESTful APIs, JWT Authentication, and relational databases
- Knowledge of Docker, Git version control, and CI/CD pipelines
- Strong problem-solving skills and familiarity with Data Structures & Algorithms`,
  },
  {
    title: 'Frontend Engineer (React + TypeScript)',
    text: `Seeking a passionate Frontend Developer to craft responsive, accessible user interfaces.
Requirements:
- Deep expertise in React 18, Next.js, and TypeScript
- Modern CSS (Tailwind CSS, CSS Modules) and performance optimization
- State management and API integration with Axios or React Query
- Experience writing automated unit and integration tests (Jest / React Testing Library)
- High attention to UI/UX design details and accessibility (WCAG)`,
  },
  {
    title: 'Backend / Cloud Engineer',
    text: `Join our platform team to build scalable microservices and distributed data pipelines.
Requirements:
- Strong foundations in Node.js, Python, or Go
- Experience designing RESTful and GraphQL APIs
- Proficient in SQL (PostgreSQL/MySQL), Redis caching, and database indexing
- Familiarity with cloud platforms (AWS/GCP), Docker containers, and Kubernetes
- Solid understanding of system design, scalability, and security best practices`,
  },
];

export default function ATSScanner({
  onScan,
  result,
  loading,
  error,
  onClear,
}) {
  const [jd, setJd] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSample = (sampleText) => {
    setJd(sampleText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onScan(jd);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
    if (score >= 60) return 'text-blue-500 from-blue-500/20 to-indigo-500/20 border-blue-500/30';
    if (score >= 45) return 'text-amber-500 from-amber-500/20 to-orange-500/20 border-amber-500/30';
    return 'text-rose-500 from-rose-500/20 to-red-500/20 border-rose-500/30';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'High Match — Interview Candidate', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    if (score >= 60) return { label: 'Good Match — Minor Gaps', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    if (score >= 45) return { label: 'Moderate Match — Skill Gaps', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    return { label: 'Low Match — Needs Optimization', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
  };

  return (
    <div className="space-y-6">
      {/* Scanner Input Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                ATS Resume Matcher
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  AI Powered
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any job description to evaluate your resume match rate, identify missing keywords, and get tailored bullets.
              </p>
            </div>
          </div>
          {result && (
            <Button variant="secondary" size="sm" onClick={onClear}>
              New Scan
            </Button>
          )}
        </div>

        {/* Sample JD Prompts */}
        <div className="mb-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">
            Try a sample role:
          </span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
            {SAMPLE_JDS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSample(s.text)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={5}
            placeholder="Paste target job description, requirements, or qualifications here..."
            className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />

          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {jd.length ? `${jd.length} characters` : 'Paste job text above'}
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={!jd.trim() || loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              {loading ? 'Evaluating ATS Match...' : 'Scan Resume Match'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Score & Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  ATS Match Score
                </div>
                <div
                  className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center bg-gradient-to-br border-2 shadow-inner ${getScoreColor(
                    result.matchScore || 70
                  )}`}
                >
                  <span className="text-3xl font-extrabold tracking-tight">
                    {result.matchScore || 70}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold opacity-75">
                    Compatibility
                  </span>
                </div>
                <div
                  className={`mt-3 text-xs font-medium px-2.5 py-1 rounded-full border ${
                    getScoreBadge(result.matchScore || 70).bg
                  }`}
                >
                  {getScoreBadge(result.matchScore || 70).label}
                </div>
              </Card>

              <Card className="p-6 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Recruiter Assessment Summary
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                {result.note && (
                  <div className="mt-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    💡 {result.note}
                  </div>
                )}
              </Card>
            </div>

            {/* Keyword Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Matched Keywords */}
              <Card className="p-5 border-emerald-500/20 bg-emerald-500/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4 className="text-sm font-semibold">
                      Matched Skills & Keywords ({result.matchedKeywords?.length || 0})
                    </h4>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Found in Resume
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(result.matchedKeywords || []).map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                  {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
                    <p className="text-xs text-slate-400">No common keywords detected.</p>
                  )}
                </div>
              </Card>

              {/* Missing Keywords */}
              <Card className="p-5 border-rose-500/20 bg-rose-500/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                    <h4 className="text-sm font-semibold">
                      Missing Keywords ({result.missingKeywords?.length || 0})
                    </h4>
                  </div>
                  <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    Add to Resume
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(result.missingKeywords || []).map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                    >
                      + {kw}
                    </span>
                  ))}
                  {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Outstanding! No major keywords missing.
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Strengths & Actionable Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100 font-semibold text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Candidate Strengths for this Role
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {(result.strengths || []).map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100 font-semibold text-sm">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Recommendations to Boost Score
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {(result.recommendations || []).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Tailored Resume Bullets to Copy */}
            {result.tailoredBullets?.length > 0 && (
              <Card className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-900/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Tailored High-Impact Resume Bullets
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Click copy to paste into your resume
                  </span>
                </div>
                <div className="space-y-2.5">
                  {result.tailoredBullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shadow-xs"
                    >
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-mono">
                        • {bullet}
                      </p>
                      <button
                        onClick={() => handleCopy(bullet, idx)}
                        className="shrink-0 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
                        title="Copy bullet point"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
