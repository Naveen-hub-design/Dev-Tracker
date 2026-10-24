const axios = require('axios');

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.0-flash';

async function callGemini(prompt, systemInstruction = '', temperature = 0.7) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const url = `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const body = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: 2048,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  const candidate = response.data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return text;
}

/**
 * Intelligent Fallback: Generates contextual guidance using real developer metrics
 */
function generateContextualAdvice(message, context) {
  const { user, github, leetcode, hackerrank, projects = [] } = context;
  const lower = message.toLowerCase();

  const userName = user?.name || 'Developer';
  const ghCommits = github?.totalCommits || 0;
  const ghRepos = github?.repos?.length || 0;
  const lcSolved = leetcode?.stats?.total || 0;
  const lcHard = leetcode?.stats?.hard || 0;
  const hrBadge = hackerrank?.hackerBadge || 'None';
  const projectCount = projects.length;

  if (/roadmap|career path|growth|future/i.test(lower)) {
    return `### 🗺️ Tailored Career Roadmap for ${userName}

Based on your DevTrack metrics (**${lcSolved} LeetCode solved**, **${ghCommits} GitHub commits**, and **${projectCount} active projects**):

#### 1. Short-Term Priority (Next 30 Days)
* **Algorithmic Consistency:** You currently have ${lcSolved} solved problems (${lcHard} Hard). Push for 150+ total problems with an emphasis on **Graph Traversal (BFS/DFS)** and **Dynamic Programming patterns**.
* **Project Polish:** Add live deployment links and unit tests to your top GitHub repositories (${github?.repos?.[0]?.name || 'DevTrack'}).

#### 2. Medium-Term Goal (60–90 Days)
* **System Design Foundations:** Read *Designing Data-Intensive Applications* and design 3 standard architectures: URL Shortener, Real-time Notification System, and Rate Limiter.
* **Resume Metrics:** Update your experience section using the **Google XYZ Formula**: *"Accomplished [X] as measured by [Y], by doing [Z]"*.

#### 3. Long-Term Target (6+ Months)
* Target **Tier-1 Tech Companies & Product Startups**. Your current profile readiness places you in the upper percentile for full-stack engineering roles.`;
  }

  if (/resume|ats|cv|bullet/i.test(lower)) {
    return `### 📝 Resume Optimization Strategy for ${userName}

**Current Profile Insights:**
* **GitHub Activity:** ${ghCommits} commits across ${ghRepos} public repos
* **LeetCode Stats:** ${lcSolved} total solved problems
* **Projects Catalog:** ${projectCount} documented projects

**Key Recommendations to boost your Resume Score:**
1. **Highlight Quantified Impact:** Replace *"Built responsive frontend"* with *"Engineered responsive UI using React and Tailwind CSS, reducing initial page load time by 35%"*.
2. **Featured Projects Structure:** Ensure each project listing has:
   * **Problem Solved** (1 line)
   * **Core Architecture / Tech Stack** (${github?.languages ? Object.keys(github.languages).slice(0, 4).join(', ') : 'React, Node.js, Express'})
   * **Key Metric or Challenge Overcome**
3. **Use the ATS Matcher Tab:** Paste any job description to evaluate keyword frequency and missing tech competencies before submitting!`;
  }

  if (/interview|mock|prepare/i.test(lower)) {
    return `### 💼 Interview Readiness Blueprint

Here is your tailored technical & behavioral interview preparation guide:

**1. Data Structures & Algorithms (Target: 70% Confidence)**
* **Current status:** ${lcSolved} solved. Aim for 2 Medium problems daily.
* **High-Yield Patterns:** Sliding Window, Two Pointers, Monotonic Stack, Backtracking, and Binary Search on Answer.

**2. Core Computer Science Fundamentals**
* **Databases:** Indexing (B-Trees), ACID properties, SQL vs NoSQL trade-offs.
* **Networking & Web:** HTTPS handshake, REST vs WebSockets vs gRPC, Browser caching mechanisms.

**3. Behavioral Round (STAR Method)**
Prepare 3 versatile stories covering:
* A high-pressure deadline or technical roadblock you resolved.
* A disagreement about architecture and how you aligned with the team.
* A critical production bug and your post-mortem fix.`;
  }

  return `### 💡 AI Career Recommendation for ${userName}

Great question! Analyzing your DevTrack profile:
* **GitHub Portfolio:** ${ghCommits} commits across ${ghRepos} repositories
* **Problem Solving:** ${lcSolved} LeetCode problems solved (${lcHard} hard problems)
* **HackerRank Rating:** Badge level **${hrBadge}**
* **Project Count:** ${projectCount} tracked projects

**Actionable Advice:**
1. Keep your streak active — consistency is the #1 metric engineering recruiters look for in GitHub activity.
2. Check the **Resume ATS Matcher** to benchmark your qualifications against real tech job postings.
3. Review your **Job Readiness Radar** to target your lowest-scoring skill dimensions.

*Tip: Add your Gemini API key in '.env' (GEMINI_API_KEY=...) to enable live multi-turn reasoning powered by Google Gemini 2.0 Flash!*`;
}

/**
 * Career Guidance Chat Handler
 */
async function getCareerAdvice({ message, userContext, history = [] }) {
  try {
    const systemPrompt = `You are DevTrack's Elite AI Career Coach and Tech Recruiter.
You assist software engineers in optimizing their portfolios, preparing for FAANG/product company technical interviews, identifying skill gaps, and improving placement readiness.
Always provide structured, actionable, and encouraging advice with markdown formatting.
Developer Profile Context:
- User Name: ${userContext?.user?.name || 'Developer'}
- GitHub Commits: ${userContext?.github?.totalCommits || 0}
- Top Repositories: ${(userContext?.github?.repos || []).map((r) => r.name).join(', ') || 'None'}
- Top Languages: ${Object.keys(userContext?.github?.languages || {}).join(', ') || 'JavaScript'}
- LeetCode Solved: ${userContext?.leetcode?.stats?.total || 0} (Easy: ${userContext?.leetcode?.stats?.easy || 0}, Medium: ${userContext?.leetcode?.stats?.medium || 0}, Hard: ${userContext?.leetcode?.stats?.hard || 0})
- HackerRank Badge: ${userContext?.hackerrank?.hackerBadge || 'None'}
- Projects Count: ${userContext?.projects?.length || 0}`;

    const promptWithHistory = `User Question: "${message}"`;
    const responseText = await callGemini(promptWithHistory, systemPrompt);
    return {
      text: responseText,
      isLiveAI: true,
      model: DEFAULT_MODEL,
    };
  } catch (error) {
    return {
      text: generateContextualAdvice(message, userContext),
      isLiveAI: false,
      model: 'contextual-heuristics',
      note: error.message === 'NO_API_KEY' ? 'Set GEMINI_API_KEY in server/.env for live Gemini generation' : error.message,
    };
  }
}

/**
 * Resume ATS Scanner & Job Match Engine
 */
async function analyzeResumeATS({ resume, jobDescription, userContext }) {
  const jdText = (jobDescription || '').trim();
  if (!jdText) {
    throw new Error('Job description is required for ATS matching');
  }

  try {
    const systemPrompt = `You are a certified ATS (Applicant Tracking System) algorithm and Technical Hiring Manager.
Evaluate the candidate's resume and developer profile against the provided Job Description.
You MUST output ONLY a valid JSON object without any backticks, markdown code blocks, or extra text.
The JSON must strictly conform to this structure:
{
  "matchScore": <number between 0 and 100>,
  "summary": "<2-3 sentence executive evaluation>",
  "matchedKeywords": ["<keyword1>", "<keyword2>", ...],
  "missingKeywords": ["<missing1>", "<missing2>", ...],
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<gap1>", "<gap2>", ...],
  "recommendations": ["<recommendation1>", "<recommendation2>", ...],
  "tailoredBullets": [
    "<action-oriented quantified resume bullet matching the JD>",
    "<action-oriented quantified resume bullet matching the JD>",
    "<action-oriented quantified resume bullet matching the JD>"
  ]
}`;

    const userPrompt = `JOB DESCRIPTION:
${jdText}

CANDIDATE RESUME & PROFILE:
Personal Summary: ${resume?.personal?.summary || 'Full-Stack Developer'}
Skills Listed: ${JSON.stringify(resume?.skills || {})}
Projects: ${JSON.stringify(resume?.projects || userContext?.projects || [])}
Experience: ${JSON.stringify(resume?.experience || [])}
Education: ${JSON.stringify(resume?.education || [])}
Coding Stats:
- LeetCode Solved: ${userContext?.leetcode?.stats?.total || 0}
- GitHub Commits: ${userContext?.github?.totalCommits || 0}
- Primary Languages: ${Object.keys(userContext?.github?.languages || {}).join(', ')}`;

    const rawResponse = await callGemini(userPrompt, systemPrompt, 0.2);
    // Parse JSON safely
    const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);
    return {
      ...result,
      isLiveAI: true,
    };
  } catch (error) {
    // Intelligent local ATS fallback parsing
    return fallbackATSAnalysis(jdText, resume, userContext);
  }
}

/**
 * Local heuristic ATS analysis fallback
 */
function fallbackATSAnalysis(jdText, resume, userContext) {
  const lowerJD = jdText.toLowerCase();

  const commonKeywords = [
    'react', 'next.js', 'node.js', 'express', 'typescript', 'javascript',
    'python', 'java', 'c++', 'sql', 'postgresql', 'mongodb', 'redis',
    'docker', 'kubernetes', 'aws', 'gcp', 'ci/cd', 'git', 'rest api',
    'graphql', 'tailwind css', 'system design', 'agile', 'microservices',
    'unit testing', 'jest', 'cypress', 'kafka', 'security', 'nosql',
  ];

  const candidateTokens = new Set();
  // Collect all words from resume
  const skillsObj = resume?.skills || {};
  Object.values(skillsObj).forEach((val) => {
    if (Array.isArray(val)) {
      val.forEach((s) => candidateTokens.add(String(s).toLowerCase()));
    }
  });

  (resume?.projects || []).forEach((p) => {
    (p.technologies || p.techStack || []).forEach((t) => candidateTokens.add(String(t).toLowerCase()));
    if (p.name) candidateTokens.add(p.name.toLowerCase());
    if (p.description) candidateTokens.add(p.description.toLowerCase());
  });

  Object.keys(userContext?.github?.languages || {}).forEach((l) => candidateTokens.add(l.toLowerCase()));

  const matchedKeywords = [];
  const missingKeywords = [];

  commonKeywords.forEach((kw) => {
    if (lowerJD.includes(kw)) {
      let found = false;
      for (const token of candidateTokens) {
        if (token.includes(kw) || kw.includes(token)) {
          found = true;
          break;
        }
      }
      if (found) {
        matchedKeywords.push(kw.toUpperCase());
      } else {
        missingKeywords.push(kw.toUpperCase());
      }
    }
  });

  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  let matchScore = totalKeywords > 0
    ? Math.round((matchedKeywords.length / totalKeywords) * 85) + 15
    : 70;
  matchScore = Math.min(98, Math.max(35, matchScore));

  const strengths = [
    `Strong alignment in core stack: ${matchedKeywords.slice(0, 4).join(', ') || 'Web fundamentals'}`,
    `Demonstrated problem solving with ${userContext?.leetcode?.stats?.total || 0}+ solved algorithmic problems`,
    `Active GitHub project portfolio showcasing full-stack applications`,
  ];

  const weaknesses = missingKeywords.length > 0
    ? [`Missing explicit mentions of target keywords: ${missingKeywords.slice(0, 4).join(', ')}`]
    : ['Needs more quantified business outcome metrics in project descriptions'];

  const recommendations = [
    `Incorporate missing skills (${missingKeywords.slice(0, 3).join(', ') || 'Cloud & Testing'}) into your projects or skills section.`,
    'Rephrase bullet points using action verbs: "Architected", "Engineered", "Optimized", "Spearheaded".',
    'Ensure your GitHub repository links are prominently listed at the top of your resume.',
  ];

  const tailoredBullets = [
    `Architected full-stack web applications utilizing ${matchedKeywords.slice(0, 2).join(' and ') || 'modern frameworks'}, resulting in optimized latency and 99.9% uptime.`,
    `Engineered RESTful APIs with secure JWT authentication and SQLite/PostgreSQL persistence, reducing endpoint response times by 30%.`,
    `Collaborated on cross-functional developer initiatives with rigorous Git version control and automated CI/CD pipeline deployments.`,
  ];

  return {
    matchScore,
    summary: `The candidate possesses a solid technical foundation matching ${matchedKeywords.length} key requirements of the job. Addressing ${missingKeywords.length} missing competencies will significantly elevate ATS ranking.`,
    matchedKeywords,
    missingKeywords,
    strengths,
    weaknesses,
    recommendations,
    tailoredBullets,
    isLiveAI: false,
    note: 'Evaluated via DevTrack ATS Heuristic Engine. Add GEMINI_API_KEY in server/.env for deep LLM parsing.',
  };
}

module.exports = {
  getCareerAdvice,
  analyzeResumeATS,
};
