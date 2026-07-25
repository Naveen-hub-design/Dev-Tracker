import React, { useMemo } from 'react';
import { Mail, Github, Linkedin, ExternalLink, Star, Code2, Shield, Trophy } from 'lucide-react';

const THEMES = {
  minimal: {
    bg: 'bg-white', bgDark: 'bg-gray-900', text: 'text-gray-900', textDark: 'text-gray-100',
    accent: 'text-blue-600', accentDark: 'text-blue-400', card: 'bg-gray-50', cardDark: 'bg-gray-800',
    border: 'border-gray-200', borderDark: 'border-gray-700', tag: 'bg-gray-100 text-gray-700', tagDark: 'bg-gray-800 text-gray-300',
  },
  developer: {
    bg: 'bg-slate-50', bgDark: 'bg-slate-950', text: 'text-slate-900', textDark: 'text-slate-100',
    accent: 'text-sky-600', accentDark: 'text-sky-400', card: 'bg-white', cardDark: 'bg-slate-900',
    border: 'border-slate-200', borderDark: 'border-slate-700', tag: 'bg-slate-100 text-slate-700', tagDark: 'bg-slate-800 text-slate-300',
  },
  glass: {
    bg: 'bg-gradient-to-br from-violet-50 to-blue-50', bgDark: 'bg-gradient-to-br from-gray-950 to-slate-950',
    text: 'text-gray-900', textDark: 'text-gray-100',
    accent: 'text-violet-600', accentDark: 'text-violet-400',
    card: 'bg-white/70 backdrop-blur-xl border-white/20', cardDark: 'bg-gray-800/70 backdrop-blur-xl border-gray-700/30',
    border: 'border-gray-200', borderDark: 'border-gray-700',
    tag: 'bg-violet-50 text-violet-700', tagDark: 'bg-violet-900/30 text-violet-300',
  },
  modern: {
    bg: 'bg-white', bgDark: 'bg-gray-950', text: 'text-gray-900', textDark: 'text-gray-50',
    accent: 'text-emerald-600', accentDark: 'text-emerald-400', card: 'bg-gray-50', cardDark: 'bg-gray-900',
    border: 'border-gray-200', borderDark: 'border-gray-800', tag: 'bg-emerald-50 text-emerald-700', tagDark: 'bg-emerald-900/30 text-emerald-300',
  },
};

function PortfolioPreview({ portfolio, theme, darkMode }) {
  const th = THEMES[theme] || THEMES.modern;
  const dk = darkMode;

  const bg = dk ? th.bgDark : th.bg;
  const text = dk ? th.textDark : th.text;
  const accent = dk ? th.accentDark : th.accent;
  const card = dk ? th.cardDark : th.card;
  const border = dk ? th.borderDark : th.border;
  const tag = dk ? th.tagDark : th.tag;

  const p = portfolio?.personal || {};
  const s = portfolio?.skills || {};
  const projects = portfolio?.projects || [];
  const cp = portfolio?.codingProfiles || {};
  const ach = portfolio?.achievements || [];

  const stats = useMemo(() => {
    const items = [];
    if (cp.github?.username) {
      items.push({ label: 'Repos', value: cp.github.repos, Icon: Github });
      items.push({ label: 'Stars', value: cp.github.stars, Icon: Star });
      items.push({ label: 'Commits', value: cp.github.commits, Icon: Code2 });
    }
    if (cp.leetcode?.username) items.push({ label: 'LC Solved', value: cp.leetcode.solved, Icon: Code2 });
    if (cp.hackerrank?.username) items.push({ label: 'HR Solved', value: cp.hackerrank.solved, Icon: Shield });
    return items;
  }, [cp]);

  const allSkills = [...(s.languages || []), ...(s.frameworks || []), ...(s.databases || []), ...(s.tools || [])];

  return (
    <div className={`rounded-xl overflow-hidden border ${border} ${bg} ${text} shadow-lg`}>
      <div className="p-8 text-center">
        {p.avatar && (
          <img src={p.avatar} alt={p.name} className="w-24 h-24 rounded-full border-4 mx-auto mb-4 object-cover" style={{ borderColor: 'var(--accent)' }} />
        )}
        <h1 className="text-2xl font-bold">{p.name || 'Your Name'}</h1>
        <p className={`text-sm font-semibold mt-1 ${accent}`}>{p.title || 'Developer'}</p>
        {p.bio && <p className="text-sm opacity-70 mt-2 max-w-md mx-auto">{p.bio}</p>}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          {p.email && <span className="flex items-center gap-1 opacity-60"><Mail className="w-3 h-3" />{p.email}</span>}
          {p.github && <span className={`flex items-center gap-1 ${accent}`}><Github className="w-3 h-3" />{p.github}</span>}
          {p.linkedin && <span className={`flex items-center gap-1 ${accent}`}><Linkedin className="w-3 h-3" />LinkedIn</span>}
        </div>
      </div>

      {allSkills.length > 0 && (
        <div className={`px-8 pb-6`}>
          <h2 className={`text-sm font-bold mb-3 ${accent}`}>Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {allSkills.map((sk) => (
              <span key={sk} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${tag}`}>{sk}</span>
            ))}
          </div>
        </div>
      )}

      {stats.length > 0 && (
        <div className={`px-8 pb-6`}>
          <h2 className={`text-sm font-bold mb-3 ${accent}`}>Stats</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {stats.map((st, i) => (
              <div key={i} className={`rounded-xl p-3 text-center ${card} border ${border}`}>
                <p className="text-lg font-bold">{st.value}</p>
                <p className="text-[10px] opacity-60">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className={`px-8 pb-6`}>
          <h2 className={`text-sm font-bold mb-3 ${accent}`}>Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((pr, i) => (
              <div key={i} className={`rounded-xl p-4 ${card} border ${border}`}>
                <h3 className="text-sm font-bold">{pr.name}</h3>
                <p className="text-[11px] opacity-60 mt-1 line-clamp-2">{pr.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {pr.technologies?.slice(0, 4).map((t) => (
                    <span key={t} className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${tag}`}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {pr.githubUrl && <a href={pr.githubUrl} className={`text-[11px] font-semibold ${accent}`} target="_blank" rel="noopener noreferrer">Code</a>}
                  {pr.liveUrl && <a href={pr.liveUrl} className={`text-[11px] font-semibold ${accent}`} target="_blank" rel="noopener noreferrer">Demo</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ach.length > 0 && (
        <div className={`px-8 pb-8`}>
          <h2 className={`text-sm font-bold mb-3 ${accent}`}>Achievements</h2>
          <div className="flex flex-wrap gap-2">
            {ach.map((a, i) => (
              <span key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${tag}`}>
                <Trophy className="w-3 h-3" /> {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(PortfolioPreview);
