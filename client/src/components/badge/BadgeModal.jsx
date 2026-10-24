import React, { useState } from 'react';
import { X, Copy, Check, Shield, Layout, Sparkles, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

export default function BadgeModal({ isOpen, onClose, username, profileUrl }) {
  const [style, setStyle] = useState('card'); // 'shield' | 'card'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = window.location.origin;
  const badgeApiUrl = `${origin}/api/badge/${encodeURIComponent(username || 'developer')}${style === 'card' ? '/card' : ''}?theme=${theme}`;
  const targetUrl = profileUrl || `${origin}/u/${encodeURIComponent(username || 'developer')}`;

  const markdownSnippet = `[![DevTrack Stats](${badgeApiUrl})](${targetUrl})`;
  const htmlSnippet = `<a href="${targetUrl}"><img src="${badgeApiUrl}" alt="DevTrack Stats" /></a>`;

  const handleCopy = (snippet) => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">GitHub README Badge</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Embed your live stats directly into your GitHub profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Style Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Badge Style</span>
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setStyle('card')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  style === 'card'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                Showcase Card
              </button>
              <button
                onClick={() => setStyle('shield')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  style === 'shield'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Compact Shield
              </button>
            </div>
          </div>

          {/* Theme Selector (for card) */}
          {style === 'card' && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Theme</span>
              <div className="flex gap-2">
                {['dark', 'light'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border capitalize transition-all ${
                      theme === t
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview Box */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live Preview</span>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[120px] overflow-x-auto">
              <img
                src={badgeApiUrl}
                alt="DevTrack Badge Preview"
                className="max-w-full h-auto drop-shadow-md rounded-lg"
              />
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Markdown Code</span>
              <span className="text-[11px] text-slate-400">Paste in README.md</span>
            </div>
            <div className="relative">
              <pre className="p-3 pr-24 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                {markdownSnippet}
              </pre>
              <button
                onClick={() => handleCopy(markdownSnippet)}
                className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Open Public Showcase <ExternalLink className="w-3 h-3" />
          </a>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
