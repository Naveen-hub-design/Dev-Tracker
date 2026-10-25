/**
 * DevTrack Dynamic SVG Badge & Profile Card Generator
 * Produces crisp, accessible, and themeable SVGs for GitHub READMEs and portfolios.
 */

function escapeXml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function getRankTier(score) {
  if (score >= 85) return { name: 'Master', color: '#10b981', gradient: ['#10b981', '#059669'], text: '#ffffff' };
  if (score >= 65) return { name: 'Expert', color: '#3b82f6', gradient: ['#3b82f6', '#2563eb'], text: '#ffffff' };
  if (score >= 45) return { name: 'Advanced', color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], text: '#ffffff' };
  if (score >= 25) return { name: 'Intermediate', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], text: '#ffffff' };
  return { name: 'Beginner', color: '#64748b', gradient: ['#64748b', '#475569'], text: '#ffffff' };
}

/**
 * Generate a compact shields-style SVG badge
 */
function generateShieldBadge({ name, score, rankName }) {
  const tier = getRankTier(score);
  const label = 'DevTrack';
  const value = `${score} | ${rankName || tier.name}`;

  const labelWidth = 72;
  const valueWidth = Math.max(90, value.length * 8 + 16);
  const totalWidth = labelWidth + valueWidth;
  const height = 24;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" fill="none">
  <defs>
    <linearGradient id="valGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${tier.gradient[0]}" />
      <stop offset="100%" stop-color="${tier.gradient[1]}" />
    </linearGradient>
  </defs>
  <clipPath id="clip">
    <rect width="${totalWidth}" height="${height}" rx="5" fill="#fff" />
  </clipPath>
  <g clip-path="url(#clip)">
    <!-- Label Side -->
    <rect width="${labelWidth}" height="${height}" fill="#1e293b" />
    <g transform="translate(7, 4.5)">
      <path d="M7 1.5L2 4.5v6l5 3 5-3v-6L7 1.5z" stroke="#60a5fa" stroke-width="1.3" fill="#0f172a" />
      <circle cx="7" cy="7.5" r="2" fill="#60a5fa" />
    </g>
    <text x="24" y="16" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="600" letter-spacing="0.2">${label}</text>
    
    <!-- Value Side -->
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="url(#valGrad)" />
    <text x="${labelWidth + valueWidth / 2}" y="16" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700" text-anchor="middle">${escapeXml(value)}</text>
  </g>
  <rect width="${totalWidth}" height="${height}" rx="5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
</svg>`;
}

/**
 * Generate a detailed GitHub profile README showcase card
 */
function generateProfileCard({
  name = 'Developer',
  githubUsername = '',
  score = 0,
  companyLevel = 'Placement Ready',
  github = null,
  leetcode = null,
  codeforces = null,
  codechef = null,
  hackerrank = null,
  theme = 'dark',
}) {
  const tier = getRankTier(score);
  const displayName = escapeXml(name || githubUsername || 'Developer');
  const handleText = githubUsername ? `@${escapeXml(githubUsername)}` : '';

  const commits = github?.commits || 0;
  const stars = github?.stars || 0;
  const repos = github?.repositories || 0;

  const lcSolved = leetcode?.solved || 0;
  const lcHard = leetcode?.hard || 0;
  const lcMedium = leetcode?.medium || 0;

  const cfRating = codeforces?.profile?.rating || codeforces?.rating || 0;
  const cfRank = codeforces?.profile?.rank || codeforces?.rank || 'Unrated';
  const cfSolved = codeforces?.stats?.totalSolved || codeforces?.solved || 0;

  const ccRating = codechef?.currentRating || codechef?.rating || 0;
  const ccStars = codechef?.stars || '';
  const ccSolved = codechef?.totalSolved || codechef?.fullySolved || 0;

  const hrSolved = hackerrank?.solved || 0;
  const hrBadge = hackerrank?.hackerBadge || '';

  // Theme palettes
  const isLight = theme === 'light';
  const bg = isLight ? '#ffffff' : '#0d1117';
  const cardBorder = isLight ? '#e2e8f0' : '#30363d';
  const innerBg = isLight ? '#f8fafc' : '#161b22';
  const textPrimary = isLight ? '#0f172a' : '#f0f6fc';
  const textSecondary = isLight ? '#64748b' : '#8b949e';
  const statBoxBorder = isLight ? '#e2e8f0' : '#21262d';

  // Circular gauge calculation (radius 34, perimeter = 2 * PI * 34 ≈ 213.6)
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" fill="none">
  <defs>
    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#818cf8" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0.2" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#6366f1" flood-opacity="0.3" />
    </filter>
  </defs>

  <style>
    .bold { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; }
    .medium { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; }
    .regular { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 400; }
    .number { font-variant-numeric: tabular-nums; }
  </style>

  <!-- Background Card -->
  <rect width="495" height="195" rx="14" fill="${bg}" stroke="${cardBorder}" stroke-width="1.5" />
  
  <!-- Subtle Top Accent Line -->
  <rect x="14" y="0" width="467" height="3" rx="1.5" fill="url(#accentLine)" />

  <!-- Header Section -->
  <g transform="translate(20, 18)">
    <!-- DevTrack Logo Icon -->
    <rect width="28" height="28" rx="7" fill="${innerBg}" stroke="${statBoxBorder}" />
    <path d="M14 6l7 4v8l-7 4-7-4v-8l7-4z" stroke="#38bdf8" stroke-width="1.6" fill="none" />
    <circle cx="14" cy="14" r="2.8" fill="#818cf8" />

    <!-- Name & Handle -->
    <text x="36" y="15" fill="${textPrimary}" font-size="15" class="bold">${displayName}</text>
    <text x="36" y="27" fill="${textSecondary}" font-size="11" class="medium">${handleText}</text>

    <!-- Company Tier / Level Badge -->
    <rect x="330" y="2" width="125" height="22" rx="11" fill="${tier.color}18" stroke="${tier.color}40" stroke-width="1" />
    <circle cx="342" cy="13" r="3.5" fill="${tier.color}" />
    <text x="352" y="16.5" fill="${tier.color}" font-size="10" class="bold">${escapeXml(companyLevel)}</text>
  </g>

  <!-- Divider -->
  <line x1="20" y1="56" x2="475" y2="56" stroke="${cardBorder}" stroke-width="1" stroke-dasharray="4 4" opacity="0.6" />

  <!-- Left: Circular Gauge (Developer Score) -->
  <g transform="translate(68, 122)">
    <!-- Track circle -->
    <circle cx="0" cy="0" r="${radius}" fill="${innerBg}" stroke="${statBoxBorder}" stroke-width="6" />
    <!-- Progress circle -->
    <circle cx="0" cy="0" r="${radius}" fill="none" stroke="url(#scoreGrad)" stroke-width="6"
            stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
            stroke-linecap="round" transform="rotate(-90)" filter="url(#glow)" />
    <!-- Score Text -->
    <text x="0" y="4" fill="${textPrimary}" font-size="19" class="bold number" text-anchor="middle">${score}</text>
    <text x="0" y="16" fill="${textSecondary}" font-size="9" class="medium" text-anchor="middle">/ 100</text>
    <text x="0" y="46" fill="${textSecondary}" font-size="10.5" class="medium" text-anchor="middle">Developer Score</text>
  </g>

  <!-- Right: 4 Metric Cards Grid -->
  <g transform="translate(142, 68)">
    <!-- GitHub Stat Box -->
    <rect x="0" y="0" width="160" height="48" rx="8" fill="${innerBg}" stroke="${statBoxBorder}" />
    <text x="12" y="19" fill="${textSecondary}" font-size="10" class="medium">GitHub Activity</text>
    <text x="12" y="38" fill="${textPrimary}" font-size="13" class="bold number">${commits} <tspan font-size="10" class="regular" fill="${textSecondary}">commits</tspan> • ${stars}★</text>

    <!-- LeetCode Stat Box -->
    <rect x="170" y="0" width="160" height="48" rx="8" fill="${innerBg}" stroke="${statBoxBorder}" />
    <text x="182" y="19" fill="${textSecondary}" font-size="10" class="medium">LeetCode Solved</text>
    <text x="182" y="38" fill="${textPrimary}" font-size="13" class="bold number">${lcSolved} <tspan font-size="10" class="regular" fill="${textSecondary}">(${lcMedium}M • ${lcHard}H)</tspan></text>

    <!-- Codeforces Stat Box -->
    <rect x="0" y="56" width="160" height="48" rx="8" fill="${innerBg}" stroke="${statBoxBorder}" />
    <text x="12" y="75" fill="${textSecondary}" font-size="10" class="medium">Codeforces Rating</text>
    <text x="12" y="94" fill="${textPrimary}" font-size="13" class="bold number">${cfRating ? `${cfRating}` : 'Unranked'} <tspan font-size="10" class="regular" fill="${textSecondary}">${cfRating ? `(${escapeXml(cfRank)})` : ''}</tspan></text>

    <!-- Box 4: CodeChef or HackerRank / Repos -->
    <rect x="170" y="56" width="160" height="48" rx="8" fill="${innerBg}" stroke="${statBoxBorder}" />
    <text x="182" y="75" fill="${textSecondary}" font-size="10" class="medium">${ccRating || ccSolved ? 'CodeChef Rating' : 'HackerRank &amp; Repos'}</text>
    <text x="182" y="94" fill="${textPrimary}" font-size="13" class="bold number">${ccRating ? `${ccRating}` : ccSolved ? `${ccSolved} solved` : hrSolved ? `${hrSolved} solved` : `${repos} repos`} <tspan font-size="10" class="regular" fill="${textSecondary}">${ccStars ? `• ${escapeXml(ccStars)}` : hrBadge ? `• ${escapeXml(hrBadge)}` : ''}</tspan></text>
  </g>

  <!-- Footer Link/Watermark -->
  <g transform="translate(390, 184)">
    <text x="80" y="0" fill="${textSecondary}" font-size="9" class="medium" text-anchor="end" opacity="0.6">devtrack.app</text>
  </g>
</svg>`;
}

module.exports = {
  generateShieldBadge,
  generateProfileCard,
};
