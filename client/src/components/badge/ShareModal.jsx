import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  Globe,
  Shield,
  Layout,
  Code,
  CheckCheck,
  Eye,
  Palette,
} from 'lucide-react';
import Button from '../ui/Button';

export default function ShareModal({
  isOpen,
  onClose,
  user,
  username,
  score,
  platforms,
  profileUrl,
  initialTab = 'badge',
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'badge' | 'social' | 'link'
  const [badgeStyle, setBadgeStyle] = useState('card'); // 'card' | 'shield'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'midnight' | 'light'
  const [snippetFormat, setSnippetFormat] = useState('markdown'); // 'markdown' | 'html' | 'url'
  const [copiedType, setCopiedType] = useState(null); // 'snippet' | 'link'

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://devtrack.app';
  const userName = user?.name || username || 'Developer';
  const scoreVal = score ?? user?.developerScore ?? 85;

  // Primary handle used for /api/badge/:identifier and public URL
  const primaryHandle =
    username ||
    user?.githubUsername ||
    user?.codeforcesUsername ||
    user?.leetcodeUsername ||
    user?.codeChefUsername ||
    user?._id ||
    'developer';

  const shareUrl = profileUrl || `${origin}/u/${encodeURIComponent(primaryHandle)}`;

  // Construct official DevTrack SVG badge endpoints
  const badgeEndpoint = `${origin}/api/badge/${encodeURIComponent(primaryHandle)}${
    badgeStyle === 'card' ? '/card.svg' : '.svg'
  }?theme=${theme}`;

  // Snippets
  const markdownSnippet = `[![DevTrack Stats](${badgeEndpoint})](${shareUrl})`;
  const htmlSnippet = `<a href="${shareUrl}"><img src="${badgeEndpoint}" alt="${userName}'s DevTrack Stats" /></a>`;
  const activeSnippet =
    snippetFormat === 'markdown'
      ? markdownSnippet
      : snippetFormat === 'html'
      ? htmlSnippet
      : badgeEndpoint;

  // Platform breakdown for social sharing
  const platformList = [];
  if (platforms?.leetcode?.solved > 0) platformList.push(`LeetCode: ${platforms.leetcode.solved} solved`);
  if (platforms?.codechef?.rating) platformList.push(`CodeChef: ${platforms.codechef.rating}★`);
  if (platforms?.codeforces?.rating) platformList.push(`Codeforces: ${platforms.codeforces.rating}`);
  if (platforms?.github?.repos > 0) platformList.push(`GitHub: ${platforms.github.repos} repos`);

  const summaryLine =
    platformList.length > 0
      ? platformList.join(' | ')
      : 'Multi-platform competitive programming & dev stats';

  const tweetText = `🚀 Check out ${userName}'s verified developer stats on @DevTrack!\n\n🏆 DevTrack Score: ${scoreVal}/100\n⚡ ${summaryLine}\n\n`;
  const whatsappText = `Check out ${userName}'s developer portfolio on DevTrack (Score: ${scoreVal}/100): ${shareUrl}`;
  const telegramText = `Check out ${userName}'s developer portfolio on DevTrack: ${shareUrl}`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const openShareWindow = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=550');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#11141e] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500 dark:text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Share &amp; Embed Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dynamic GitHub README badges, social broadcast &amp; showcase cards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <button
            onClick={() => setActiveTab('badge')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'badge'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            GitHub README Badge
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'social'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Social Broadcast
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'link'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            Direct Link
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: GITHUB README BADGE */}
          {activeTab === 'badge' && (
            <div className="space-y-4">
              {/* Style & Theme Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                {/* Badge Style Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Format:
                  </span>
                  <div className="flex p-0.5 rounded-xl bg-slate-200/70 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setBadgeStyle('card')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        badgeStyle === 'card'
                          ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                      Showcase Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeStyle('shield')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        badgeStyle === 'shield'
                          ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Compact Shield
                    </button>
                  </div>
                </div>

                {/* Theme Switcher */}
                {badgeStyle === 'card' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Theme:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { key: 'dark', label: 'Dark' },
                        { key: 'midnight', label: 'Midnight' },
                        { key: 'light', label: 'Light' },
                      ].map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setTheme(t.key)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            theme === t.key
                              ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/40'
                              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live SVG Badge Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-orange-500" />
                    Live Preview
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Real-time SVG rendered from server
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-[#090c14] flex items-center justify-center min-h-[140px] overflow-x-auto shadow-inner">
                  <img
                    src={badgeEndpoint}
                    alt="DevTrack Badge Preview"
                    className="max-w-full h-auto drop-shadow-md rounded-xl transition-all"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Embed Code Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {/* Format Selector Pills */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { key: 'markdown', label: 'Markdown (README.md)' },
                      { key: 'html', label: 'HTML Embed' },
                      { key: 'url', label: 'Direct Image URL' },
                    ].map((fmt) => (
                      <button
                        key={fmt.key}
                        type="button"
                        onClick={() => setSnippetFormat(fmt.key)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          snippetFormat === fmt.key
                            ? 'bg-orange-500 text-white font-semibold shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(activeSnippet, 'snippet')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    {copiedType === 'snippet' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Snippet
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-3 pr-20 rounded-xl bg-slate-900 dark:bg-black/60 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed select-all">
                    {activeSnippet}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeSnippet, 'snippet')}
                    className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    {copiedType === 'snippet' ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === 'snippet' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL BROADCAST */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              {/* Profile Snapshot Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161a26] border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={userName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-500/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                    {userName.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {userName}
                    </h4>
                    <span className="shrink-0 text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                      {scoreVal}/100 Score
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {summaryLine}
                  </p>
                </div>
              </div>

              {/* Social Channels 1-Click Broadcast */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 block">
                  1-Click Social Share
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* LinkedIn */}
                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          shareUrl
                        )}`
                      )
                    }
                    className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] dark:text-[#3894ec] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span className="text-xs font-semibold">LinkedIn</span>
                  </button>

                  {/* X / Twitter */}
                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          tweetText
                        )}&url=${encodeURIComponent(shareUrl)}`
                      )
                    }
                    className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-neutral-900/10 hover:bg-neutral-900/20 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-xs font-semibold">X (Twitter)</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`
                      )
                    }
                    className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#1da851] dark:text-[#25D366] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span className="text-xs font-semibold">WhatsApp</span>
                  </button>

                  {/* Telegram */}
                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://t.me/share/url?url=${encodeURIComponent(
                          shareUrl
                        )}&text=${encodeURIComponent(telegramText)}`
                      )
                    }
                    className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.828.942z" />
                    </svg>
                    <span className="text-xs font-semibold">Telegram</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT PUBLIC LINK */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Public Showcase URL
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 select-all focus:outline-none"
                  />
                  <Button
                    variant={copiedType === 'link' ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleCopy(shareUrl, 'link')}
                    className="shrink-0 font-semibold"
                  >
                    {copiedType === 'link' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Anyone with this link can view your live developer portfolio and verified metrics.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1.5"
          >
            <span>Open Public Showcase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
