const THEMES = {
  minimal: {
    bg: '#ffffff', bgDark: '#111827', text: '#1f2937', textDark: '#e5e7eb',
    accent: '#2563eb', accentDark: '#60a5fa', card: '#f9fafb', cardDark: '#1f2937',
    border: '#e5e7eb', borderDark: '#374151', tag: '#f3f4f6', tagDark: '#374151',
  },
  developer: {
    bg: '#f8fafc', bgDark: '#0f172a', text: '#0f172a', textDark: '#e2e8f0',
    accent: '#0284c7', accentDark: '#38bdf8', card: '#ffffff', cardDark: '#1e293b',
    border: '#e2e8f0', borderDark: '#334155', tag: '#f1f5f9', tagDark: '#1e293b',
  },
  glass: {
    bg: '#f0f9ff', bgDark: '#0f172a', text: '#0f172a', textDark: '#e2e8f0',
    accent: '#7c3aed', accentDark: '#a78bfa', card: 'rgba(255,255,255,0.7)', cardDark: 'rgba(30,41,59,0.7)',
    border: 'rgba(148,163,184,0.3)', borderDark: 'rgba(148,163,184,0.2)',
    tag: 'rgba(241,245,249,0.8)', tagDark: 'rgba(30,41,59,0.8)',
  },
  modern: {
    bg: '#ffffff', bgDark: '#030712', text: '#111827', textDark: '#f9fafb',
    accent: '#059669', accentDark: '#34d399', card: '#f9fafb', cardDark: '#111827',
    border: '#e5e7eb', borderDark: '#1f2937', tag: '#ecfdf5', tagDark: '#064e3b',
  },
};

function tc(theme, dark, lightKey, darkKey) {
  return dark ? theme[darkKey || lightKey + 'Dark'] : theme[lightKey];
}

export function generatePortfolioHTML(portfolio, theme, darkMode) {
  const th = THEMES[theme] || THEMES.modern;
  const p = portfolio?.personal || {};
  const s = portfolio?.skills || {};
  const projects = portfolio?.projects || [];
  const cp = portfolio?.codingProfiles || {};
  const ach = portfolio?.achievements || [];

  const bg = tc(th, darkMode, 'bg');
  const text = tc(th, darkMode, 'text');
  const accent = tc(th, darkMode, 'accent');
  const card = tc(th, darkMode, 'card');
  const border = tc(th, darkMode, 'border');
  const tag = tc(th, darkMode, 'tag');

  const skillsHTML = Object.entries({ Languages: s.languages, Frameworks: s.frameworks, Databases: s.databases, Tools: s.tools })
    .filter(([, v]) => v?.length)
    .map(([k, v]) => `<p style="margin-bottom:6px"><strong style="color:${accent}">${k}:</strong> ${v.join(', ')}</p>`).join('');

  const projectsHTML = projects.map((pr) => `
    <div style="background:${card};border:1px solid ${border};border-radius:12px;padding:20px">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:6px">${pr.name}</h3>
      <p style="font-size:13px;opacity:0.7;margin-bottom:10px">${pr.description || ''}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
        ${(pr.technologies || []).map((t) => `<span style="background:${tag};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500">${t}</span>`).join('')}
      </div>
      <div style="display:flex;gap:12px">
        ${pr.githubUrl ? `<a href="${pr.githubUrl}" style="color:${accent};font-size:12px;font-weight:600" target="_blank">GitHub</a>` : ''}
        ${pr.liveUrl ? `<a href="${pr.liveUrl}" style="color:${accent};font-size:12px;font-weight:600" target="_blank">Live Demo</a>` : ''}
      </div>
    </div>`).join('');

  const achHTML = ach.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px">${ach.map((a) => `<span style="background:${tag};padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500">${a}</span>`).join('')}</div>` : '';

  const statsItems = [];
  if (cp.github?.username) statsItems.push({ label: 'Repos', value: cp.github.repos, sub: 'GitHub' });
  if (cp.github?.username) statsItems.push({ label: 'Stars', value: cp.github.stars, sub: 'GitHub' });
  if (cp.github?.username) statsItems.push({ label: 'Commits', value: cp.github.commits, sub: 'GitHub' });
  if (cp.leetcode?.username) statsItems.push({ label: 'Solved', value: cp.leetcode.solved, sub: 'LeetCode' });
  if (cp.hackerrank?.username) statsItems.push({ label: 'Solved', value: cp.hackerrank.solved, sub: 'HackerRank' });

  const statsHTML = statsItems.length ? `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px">
      ${statsItems.map((st) => `
        <div style="background:${card};border:1px solid ${border};border-radius:12px;padding:16px;text-align:center">
          <p style="font-size:28px;font-weight:800;color:${accent}">${st.value}</p>
          <p style="font-size:12px;font-weight:600;margin-top:2px">${st.label}</p>
          <p style="font-size:10px;opacity:0.5">${st.sub}</p>
        </div>`).join('')}
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.name || 'Developer'} — Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:${bg};color:${text};line-height:1.6}
.c{max-width:860px;margin:0 auto;padding:40px 24px}
.hero{text-align:center;padding:60px 0 40px}
.hero img{width:120px;height:120px;border-radius:50%;border:4px solid ${accent};object-fit:cover;margin:0 auto 20px;display:block}
.hero h1{font-size:2.5rem;font-weight:800}
.hero .t{font-size:1.1rem;color:${accent};font-weight:600;margin:4px 0 12px}
.hero .bio{font-size:14px;opacity:0.7;max-width:500px;margin:0 auto 16px}
.hero .links{display:flex;justify-content:center;gap:16px;flex-wrap:wrap}
.hero .links a{color:${accent};font-size:13px;font-weight:500;text-decoration:none}
.hero .links a:hover{text-decoration:underline}
section{margin-bottom:40px}
section h2{font-size:18px;font-weight:700;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid ${accent};display:inline-block}
@media(max-width:640px){.hero h1{font-size:1.8rem}.c{padding:24px 16px}}
</style>
</head>
<body>
<div class="c">
  <div class="hero">
    ${p.avatar ? `<img src="${p.avatar}" alt="${p.name}">` : ''}
    <h1>${p.name || 'Your Name'}</h1>
    <p class="t">${p.title || 'Developer'}</p>
    ${p.bio ? `<p class="bio">${p.bio}</p>` : ''}
    <div class="links">
      ${p.email ? `<a href="mailto:${p.email}">Email</a>` : ''}
      ${p.github ? `<a href="https://github.com/${p.github}" target="_blank">GitHub</a>` : ''}
      ${p.linkedin ? `<a href="${p.linkedin}" target="_blank">LinkedIn</a>` : ''}
      ${p.portfolio ? `<a href="${p.portfolio}" target="_blank">Portfolio</a>` : ''}
    </div>
  </div>

  ${skillsHTML ? `<section><h2>Skills</h2>${skillsHTML}</section>` : ''}
  ${statsHTML ? `<section><h2>GitHub Stats</h2>${statsHTML}</section>` : ''}
  ${projectsHTML ? `<section><h2>Projects</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">${projectsHTML}</div></section>` : ''}
  ${achHTML ? `<section><h2>Achievements</h2>${achHTML}</section>` : ''}

  <footer style="text-align:center;padding:40px 0 20px;font-size:12px;opacity:0.4">
    Built with DevTrack
  </footer>
</div>
</body>
</html>`;
}

export function downloadHTML(portfolio, theme, darkMode) {
  const html = generatePortfolioHTML(portfolio, theme, darkMode);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(portfolio?.personal?.name || 'portfolio').replace(/\s+/g, '-').toLowerCase()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadZIP(portfolio, theme, darkMode) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const html = generatePortfolioHTML(portfolio, theme, darkMode);
  zip.file('index.html', html);
  zip.file('README.txt', `Portfolio for ${portfolio?.personal?.name || 'Developer'}\nGenerated by DevTrack\nTheme: ${theme}\nDark Mode: ${darkMode ? 'On' : 'Off'}`);
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(portfolio?.personal?.name || 'portfolio').replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
