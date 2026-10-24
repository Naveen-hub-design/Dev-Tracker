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

// -------------------------------------------------------------
// Interactive Mock Interview Engine
// -------------------------------------------------------------

const INTERVIEW_QUESTION_BANK = {
  frontend: [
    {
      q: "Explain how React's Virtual DOM reconciliation and Fiber architecture work. How does React determine which elements need to be re-rendered when state updates?",
      topic: "React Internals & Architecture",
      keyConcepts: ["Fiber node", "two-phase commit", "diffing algorithm", "keys", "reconciliation"],
      modelAnswer: "React's Virtual DOM is an in-memory lightweight representation of the real DOM. With the Fiber architecture introduced in React 16, reconciliation is split into two phases: the interruptible Render/Reconciliation phase (where React traverses the Fiber tree using requestIdleCallback/messageChannel to build a work-in-progress tree and compute changes with an O(n) heuristic diffing algorithm), and the synchronous Commit phase (where DOM mutations are flushed). Keys provide stable identity across renders, allowing React to match children across trees instead of re-mounting them.",
    },
    {
      q: "What is the difference between client-side rendering (CSR), server-side rendering (SSR), static site generation (SSG), and incremental static regeneration (ISR)? When would you choose each?",
      topic: "Rendering Strategies & Web Performance",
      keyConcepts: ["CSR", "SSR", "SSG", "ISR", "SEO", "hydration", "TTFB", "FCP"],
      modelAnswer: "CSR renders HTML in the browser via JavaScript; best for authenticated dashboards where SEO is unimportant. SSR renders HTML per request on the server (like Next.js getServerSideProps); ideal for dynamic, user-specific pages needing real-time data and high SEO. SSG compiles HTML at build time; provides fastest TTFB via CDNs for blogs and documentation. ISR allows updating static pages in the background without a full rebuild by setting a revalidation period.",
    },
    {
      q: "Explain JavaScript closures, the Execution Context, and the Event Loop (microtasks vs macrotasks). What is the exact execution order when Promises and setTimeout interact?",
      topic: "JavaScript Runtime & Concurrency",
      keyConcepts: ["Closure", "Lexical environment", "Call stack", "Microtask queue", "Macrotask queue", "Promise", "setTimeout"],
      modelAnswer: "A closure is a function that retains access to its lexical scope even after the outer function has finished executing. The JS runtime runs on a single thread with a Call Stack and Event Loop. Microtasks (Promise.then, MutationObserver, queueMicrotask) have higher priority than macrotasks (setTimeout, setInterval, I/O). After every synchronous stack frame finishes, the engine completely empties the microtask queue before taking the next macrotask.",
    },
    {
      q: "How do you optimize Core Web Vitals (LCP, INP, CLS) in a modern frontend application experiencing slow loads and layout shifts?",
      topic: "Performance & Core Web Vitals",
      keyConcepts: ["LCP", "INP", "CLS", "Image optimization", "Code splitting", "font-display", "aspect-ratio"],
      modelAnswer: "To optimize LCP (Largest Contentful Paint): preload critical hero images (fetchpriority='high'), serve modern formats (WebP/AVIF), and eliminate render-blocking CSS/JS. To optimize INP (Interaction to Next Paint): yield to the main thread using startTransition or scheduler.yield(), break long tasks (>50ms), and debounce heavy handlers. For CLS (Cumulative Layout Shift): always specify explicit width/height or aspect-ratio on images/embeds and reserve space for dynamic ads/skeletons.",
    },
    {
      q: "How do you architect state management across an enterprise React application? Compare Context API, Redux Toolkit, and Zustand, specifically focusing on re-render optimization and server state.",
      topic: "State Management Architecture",
      keyConcepts: ["Context API", "Zustand", "Redux Toolkit", "TanStack Query", "selector", "re-renders"],
      modelAnswer: "For client-side global state, Zustand is lightweight, avoids provider hell, and supports atomic state selectors that only trigger re-renders when subscribed slices change. Redux Toolkit is standard for strict enterprise workflows requiring action traceability. Context API is best for low-velocity data (auth, themes) because any value change triggers re-renders across all consumers unless memoized. Crucially, separate server state (data caching, deduplication, invalidation) using React Query/TanStack Query from client state.",
    },
  ],
  backend: [
    {
      q: "Explain how Node.js achieves concurrency using the single-threaded Event Loop and libuv. What happens when CPU-bound computation blocks the thread, and how do you resolve it?",
      topic: "Node.js Runtime & Concurrency",
      keyConcepts: ["libuv", "Event Loop", "Thread pool", "Worker threads", "clustering", "non-blocking I/O"],
      modelAnswer: "Node.js runs user JavaScript on a single thread with an Event Loop, but delegates asynchronous I/O (file system, DNS, crypto) to C++ libuv's background thread pool (default 4 threads). If heavy CPU computation (like JSON parsing, image processing, or heavy cryptography) blocks the event loop, no incoming HTTP requests can be served. Solutions include offloading CPU tasks to Worker Threads (worker_threads module), spawning child processes, scaling via Node.js cluster module, or offloading to dedicated background queue workers like BullMQ/Redis.",
    },
    {
      q: "Compare relational databases (PostgreSQL/MySQL) with NoSQL databases (MongoDB/DynamoDB). How do you decide between strong ACID consistency and horizontal scalability with eventual consistency?",
      topic: "Database Design & ACID",
      keyConcepts: ["ACID", "BASE", "PostgreSQL", "NoSQL", "Transactions", "Indexes", "Sharding"],
      modelAnswer: "Relational databases enforce ACID (Atomicity, Consistency, Isolation, Durability) with normalized tables and foreign key constraints, ideal for financial transactions, e-commerce orders, and multi-entity relational queries. NoSQL databases prioritize high write throughput, schema flexibility, and horizontal partitioning (BASE semantics), ideal for unstructured data, logs, and high-velocity telemetry. The decision hinges on data relationships, transactional integrity needs, and write volume.",
    },
    {
      q: "How do you design a high-throughput, low-latency API rate limiter for a public platform? Discuss Token Bucket vs Leaky Bucket and how you implement it in a distributed system with Redis.",
      topic: "API Architecture & Rate Limiting",
      keyConcepts: ["Token Bucket", "Sliding Window Log", "Redis", "Lua scripts", "HTTP 429", "Headers"],
      modelAnswer: "A Token Bucket algorithm maintains a bucket filled at a fixed rate up to a max capacity; requests consume tokens. To implement it in a distributed system, store client IPs/keys in Redis with atomic Lua scripts to prevent race conditions (checking token balance and deducting in a single round-trip). Return standard headers: X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After on HTTP 429 responses.",
    },
    {
      q: "Explain database indexing internals (B-Trees vs Hash Indexes). How do you analyze an execution plan with EXPLAIN ANALYZE and optimize a slow query causing high database CPU?",
      topic: "Database Indexing & Query Tuning",
      keyConcepts: ["B-Tree", "Composite index", "EXPLAIN ANALYZE", "Sequential scan", "Index scan", "Cardinality"],
      modelAnswer: "B-Trees are self-balancing search trees storing sorted keys, supporting equality and range queries (O(log n)); Hash indexes only support exact lookups (O(1)). Using EXPLAIN ANALYZE, you inspect the execution plan: look for Seq Scan on large tables, high estimated vs actual row mismatches, and nested loops without indexes. Optimizations include creating composite indexes with highest cardinality columns first (following leftmost prefix rule), avoiding functions in WHERE clauses, and utilizing covering indexes.",
    },
    {
      q: "How do you design a secure microservices authentication & authorization system using short-lived JWTs, refresh tokens, and RBAC?",
      topic: "Security & Microservices Auth",
      keyConcepts: ["JWT", "Refresh token", "Rotating tokens", "HttpOnly cookies", "RBAC", "API Gateway"],
      modelAnswer: "Issue short-lived access tokens (5-15 mins) containing user claims and roles signed with asymmetric keys (RS256). Issue long-lived refresh tokens stored in secure, HttpOnly, SameSite=Strict cookies with rotating refresh tokens and database revocation tracking to detect token reuse. An API Gateway validates the JWT signature and forwards verified user identity headers to internal downstream microservices.",
    },
  ],
  fullstack: [
    {
      q: "Walk through the entire lifecycle of a request: from the moment a user enters a URL in their browser until the application fully renders, processes a form submission, and updates the database.",
      topic: "End-to-End Web Architecture",
      keyConcepts: ["DNS resolution", "TCP handshake", "TLS negotiation", "HTTP/2 / HTTP/3", "DOM parsing", "REST API", "Database transaction"],
      modelAnswer: "1. Browser checks DNS cache, queries resolver, establishes TCP 3-way handshake and TLS 1.3 encryption. 2. HTTP GET request hits CDN/Load Balancer, which routes to reverse proxy (Nginx). 3. Browser parses HTML, discovers CSS/JS, builds DOM and CSSOM trees into Render Tree. 4. JS hydration binds event handlers. 5. Form submission sends POST with JSON/CSRF tokens to Express API. 6. Controller validates payload, executes parameterized SQL within a database transaction, and returns 201 Created. 7. Client updates React state and updates the UI.",
    },
    {
      q: "How do you design and implement real-time bidirectional communication in a web application (like a collaborative document editor or live chat)? Compare WebSockets, SSE, and WebRTC.",
      topic: "Real-time Protocols & Architecture",
      keyConcepts: ["WebSockets", "Server-Sent Events", "WebRTC", "Socket.io", "Redis Pub/Sub", "Operational Transform"],
      modelAnswer: "WebSockets provide full-duplex TCP communication ideal for interactive two-way apps like collaborative editing and chat. Server-Sent Events (SSE) provide unidirectional server-to-client streaming over HTTP, ideal for live scoreboards or notifications. WebRTC provides low-latency peer-to-peer data/media streams. For multi-server scalability, connect WebSocket servers to Redis Pub/Sub so messages broadcast across any cluster node.",
    },
    {
      q: "Explain Cross-Origin Resource Sharing (CORS), Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF). What concrete security measures do you take on both frontend and backend?",
      topic: "Web Security & Vulnerability Defense",
      keyConcepts: ["CORS preflight", "XSS", "CSRF", "Content Security Policy", "SameSite", "Sanitization"],
      modelAnswer: "CORS is a browser security mechanism that restricts cross-origin HTTP requests using preflight OPTIONS and Access-Control-Allow-Origin headers. XSS injects malicious client-side scripts; mitigated by sanitizing user input (DOMPurify), escaping variables, and enforcing strict Content Security Policy (CSP). CSRF tricks an authenticated user into executing unauthorized actions; mitigated using SameSite=Strict cookies, anti-CSRF tokens, and verifying Origin/Referer headers.",
    },
    {
      q: "How do you implement caching across the full web stack (browser, CDN, reverse proxy, application Redis cache, and database query cache) without stale data issues?",
      topic: "Full-Stack Caching Strategies",
      keyConcepts: ["Cache-Control", "ETag", "CDN edge caching", "Redis Cache-Aside", "Stale-While-Revalidate"],
      modelAnswer: "At browser/CDN level: use immutable hashed assets with Cache-Control: max-age=31536000, immutable. For dynamic pages, use Stale-While-Revalidate with ETags. At backend level: implement Cache-Aside with Redis, where reads check cache before DB, and mutations explicitly invalidate or update Redis keys. Add TTLs to every key to prevent memory leaks and permanent inconsistency.",
    },
    {
      q: "How do you design a scalable CI/CD and deployment architecture for a full-stack application using Docker, automated testing, and zero-downtime blue-green or rolling deployments?",
      topic: "DevOps & Production Readiness",
      keyConcepts: ["Docker multi-stage", "CI/CD", "Blue-Green deployment", "Health checks", "Rolling update", "Database migrations"],
      modelAnswer: "Use multi-stage Docker builds to keep production images minimal and secure. GitHub Actions triggers linting, unit tests, and integration tests on PR. On merge, it builds the container and pushes to registry. Use Kubernetes or Docker Swarm for rolling updates with readiness/liveness health probes. For database migrations, follow expand-and-contract pattern so the database remains backwards-compatible with running old and new versions concurrently.",
    },
  ],
  dsa: [
    {
      q: "Explain the difference between Dijkstra's Algorithm and the Bellman-Ford algorithm for finding shortest paths in a graph. Under what circumstances will Dijkstra fail, and what is its time complexity with a Min-Heap?",
      topic: "Graph Algorithms",
      keyConcepts: ["Dijkstra", "Bellman-Ford", "Min-Heap", "Negative edge cycles", "Greedy approach", "O((V + E) log V)"],
      modelAnswer: "Dijkstra is a greedy algorithm finding single-source shortest paths on non-negative weighted graphs in O((V + E) log V) using a Priority Queue / Min-Heap. Dijkstra fails on graphs with negative edge weights because it assumes visited vertices have finalized minimal distances. Bellman-Ford uses dynamic programming and relaxes all edges (V - 1) times in O(V * E); it handles negative weights and detects negative weight cycles.",
    },
    {
      q: "Explain Hash Table collision resolution strategies (Chaining vs Open Addressing). What is the load factor, and how can a Hash Map degrade to O(n)? How does Java/Modern runtimes prevent this?",
      topic: "Data Structures & Hashing",
      keyConcepts: ["Separate Chaining", "Open Addressing", "Load factor", "Rehashing", "Red-Black Tree"],
      modelAnswer: "Separate Chaining stores colliding elements in a linked list at each bucket index; Open Addressing (linear/quadratic probing, double hashing) finds the next available slot within the array. When the load factor (items / capacity) exceeds a threshold (typically 0.75), the table rehashes into a double-sized array. If all keys hash to the same bucket (worst-case hash collision attack), search degrades to O(n). Modern engines (like Java 8 HashMap) convert long linked lists (length > 8) into balanced Red-Black Trees, guaranteeing O(log n) worst-case lookups.",
    },
    {
      q: "Explain the Two-Pointer and Sliding Window techniques. Walk through an example problem where Sliding Window reduces time complexity from O(n^2) to O(n).",
      topic: "Algorithmic Patterns",
      keyConcepts: ["Sliding Window", "Two Pointers", "Subarray", "O(n) linear time", "Longest Substring Without Repeating Characters"],
      modelAnswer: "Two-pointer techniques use two references moving across an array in either opposite directions (like 2-Sum in a sorted array) or the same direction. Sliding Window maintains a window [left, right] that expands by moving 'right' and contracts by moving 'left' when an invariant is violated. In 'Longest Substring Without Repeating Characters', brute force checks all substrings in O(n^2). With Sliding Window and a hash set/map, each element is added and removed at most once, reducing complexity to strict O(n) time and O(min(m, n)) space.",
    },
    {
      q: "How do you distinguish whether a problem should be solved using Dynamic Programming vs Greedy? What are 'Optimal Substructure' and 'Overlapping Subproblems'?",
      topic: "Dynamic Programming & Optimization",
      keyConcepts: ["Optimal Substructure", "Overlapping Subproblems", "Memoization", "Tabulation", "Greedy Choice Property"],
      modelAnswer: "A problem has Optimal Substructure if an optimal solution to the problem contains optimal solutions to its subproblems. It has Overlapping Subproblems if recursive solutions visit the same subproblems repeatedly (e.g. Fibonacci, Knapsack). Dynamic programming memoizes (top-down) or tabulates (bottom-up) these subproblems. A Greedy algorithm works only if the 'Greedy Choice Property' holds: locally optimal choices guarantee a globally optimal solution without backtracking (e.g., Fractional Knapsack vs 0/1 Knapsack).",
    },
    {
      q: "Explain the Trie (Prefix Tree) data structure. How would you design an efficient autocomplete search suggestion system for 10 million search queries?",
      topic: "Advanced Data Structures & Search",
      keyConcepts: ["Trie node", "Prefix search", "Top-K suggestions", "Heap", "Space complexity"],
      modelAnswer: "A Trie is a tree where each node represents a character, and paths from root represent words. Lookup and insertion are O(L) where L is word length, independent of total dictionary size. For autocomplete with 10M queries: store frequency counts at each node. To avoid expensive traversals, pre-compute and cache the top 5-10 most frequent words directly at each Trie node, or maintain a Min-Heap. Use serialization and caching (Redis) for hot prefixes.",
    },
  ],
  system_design: [
    {
      q: "Design a URL Shortener service (like bit.ly) handling 100 million new URLs per month and 10 billion reads per month. Walk through API design, database schema, hashing/encoding strategy, and caching.",
      topic: "High-Scale System Design",
      keyConcepts: ["Base62 encoding", "MD5/SHA-256", "Distributed ID generator (Snowflake)", "Redis cache", "Relational vs NoSQL", "301 vs 302 redirect"],
      modelAnswer: "1. Traffic estimates: 100M writes/month ≈ 40 writes/sec, 10B reads/month ≈ 4,000 reads/sec (read-heavy, 100:1). 2. Hashing: Use 7-character Base62 encoding (62^7 ≈ 3.5 trillion URLs). Avoid MD5 collisions by using a distributed unique 64-bit ID generator (Twitter Snowflake) and Base62-encoding the numerical ID. 3. Storage: NoSQL key-value (DynamoDB/Cassandra) with (short_url, original_url, created_at, user_id). 4. Caching: Cache top 20% hot URLs in Redis with LRU eviction. 5. Redirect: Return HTTP 302 (Found) to track click analytics, or 301 (Moved Permanently) to maximize browser caching.",
    },
    {
      q: "Design a notification system that delivers millions of push, email, and SMS notifications daily with priority levels, rate-limiting, and deduplication.",
      topic: "Distributed Systems & Message Queues",
      keyConcepts: ["Kafka/RabbitMQ", "Message Queues", "Deduplication", "Rate limiting", "Worker pool", "Dead-letter queue"],
      modelAnswer: "1. Ingestion: API Gateway authenticates requests and checks user notification preferences. 2. Deduplication: Check Redis with key hash(user_id, event_id) and a 1-minute TTL to prevent duplicate sends. 3. Queues: Publish events to Kafka / RabbitMQ partitioned by channel (Push, SMS, Email) and priority (Critical vs Marketing). 4. Workers: Dedicated worker pools consume messages and call 3rd-party providers (APNs/FCM, Twilio, SendGrid) with exponential backoff retries. 5. Reliability: Failed messages after 5 retries move to a Dead Letter Queue (DLQ) for alerting and manual replay.",
    },
    {
      q: "How do you design a distributed caching system with high availability, horizontal scalability, and minimal data loss? Discuss Consistent Hashing and replication.",
      topic: "Distributed Caching & Sharding",
      keyConcepts: ["Consistent Hashing", "Virtual nodes", "Master-Replica", "Cache stampede", "Eviction policies"],
      modelAnswer: "Use Consistent Hashing along a 360-degree hash ring to distribute keys across cache nodes. Assign multiple virtual nodes per physical server to ensure uniform data distribution. When nodes are added or removed, only k/N keys need to be remapped. Implement Master-Replica pairs with asynchronous replication and Sentinel/Cluster failover for high availability. Prevent cache stampedes (thundering herd) using mutex locks or Stale-While-Revalidate.",
    },
    {
      q: "Design a scalable 1-on-1 and Group Chat application (like WhatsApp or Slack). Discuss connection management, message storage, read receipts, and offline delivery.",
      topic: "Real-Time Chat Architecture",
      keyConcepts: ["WebSockets", "Session servers", "Cassandra/HBase", "Kafka", "Zookeeper", "Message status (sent/delivered/read)"],
      modelAnswer: "1. Connection: Clients maintain persistent WebSocket connections with Chat Gateway servers. 2. Session mapping: Store user_id -> gateway_server_id mapping in Redis. 3. 1-on-1 Flow: User A sends message -> Gateway -> Kafka -> Message Service stores in Cassandra (optimized for high-write time-series queries) -> If User B online, forward via their Gateway; if offline, trigger Push Notification. 4. Group Chat: For small groups, fan-out on write; for massive channels, fan-out on read. 5. Read receipts: Send lightweight ACK packets updating message status.",
    },
    {
      q: "How do you handle database partitioning (sharding) for a rapidly growing system? Discuss sharding keys, cross-shard joins, re-sharding, and distributed transactions.",
      topic: "Database Sharding & Scaling",
      keyConcepts: ["Sharding key", "Horizontal partitioning", "Scatter-gather query", "Two-Phase Commit (2PC)", "Saga pattern"],
      modelAnswer: "Choose a sharding key with high cardinality and even distribution (e.g. user_id). Queries with the shard key route directly to a single partition; queries without require expensive scatter-gather across all nodes. Avoid cross-shard joins by de-normalizing related data within the same shard. For distributed transactions across shards, avoid blocking Two-Phase Commit (2PC) in favor of the asynchronous Saga Pattern with compensating transactions.",
    },
  ],
  behavioral: [
    {
      q: "Tell me about a complex technical challenge or production outage you faced on a recent software project. How did you troubleshoot, resolve it, and what did you learn? (Please structure your answer using the STAR method: Situation, Task, Action, Result).",
      topic: "Problem Solving & STAR Framework",
      keyConcepts: ["STAR method", "Root cause analysis", "Metrics", "Action taken", "Measurable result"],
      modelAnswer: "Situation: During a high-traffic release, API response times spiked to 8 seconds, causing timeouts for 25% of users. Task: I was on-call and tasked with identifying the root cause and restoring normal latency within 30 minutes. Action: I inspected APM telemetry and slow query logs, discovering a missing composite index on our transactions table during a surge of filter queries. I applied the index concurrently without locking the table and deployed a hotfix. Result: Query latency dropped from 8s to 45ms, error rates returned to 0%, and I authored a post-mortem mandating query plan validations in our CI pipeline.",
    },
    {
      q: "Describe a situation where you had a strong technical disagreement with a team member or senior engineer regarding architecture or design. How did you handle the situation and achieve consensus?",
      topic: "Collaboration & Conflict Resolution",
      keyConcepts: ["Constructive dialogue", "Objective data", "Trade-off analysis", "Consensus", "Disagree and commit"],
      modelAnswer: "Situation: Our team was choosing between building a custom authentication microservice vs adopting an established managed solution (Auth0/Cognito). A senior engineer favored building in-house. Task: We needed to align on an approach that met strict launch deadlines and security compliance. Action: I built a rapid comparative matrix outlining development effort (3 months vs 2 weeks), maintenance overhead, and security certifications. We ran a 1-day spike test. Result: Seeing the concrete maintenance cost, the team unanimously agreed to use the managed provider for launch, freeing our team to focus on core domain features.",
    },
    {
      q: "How do you manage technical debt versus delivering new customer-facing features when working under tight deadlines and leadership pressure?",
      topic: "Engineering Discipline & Prioritization",
      keyConcepts: ["Tech debt balance", "Refactoring", "Business impact", "Quantifying risk", "Boy scout rule"],
      modelAnswer: "I view technical debt as financial debt: small amounts taken deliberately can accelerate speed-to-market, but unpaid interest eventually halts feature velocity. I advocate for the 80/20 rule: dedicate 15-20% of every sprint to paying down highest-risk technical debt (slow queries, brittle tests, deprecated dependencies). I communicate technical debt to stakeholders in business terms: risk of downtime, developer velocity degradation, and customer impact rather than purely aesthetic refactoring.",
    },
    {
      q: "Tell me about a time when you received tough critical feedback on your code or design during a review. How did you respond, and how did it change your approach?",
      topic: "Growth Mindset & Receptiveness",
      keyConcepts: ["Open to feedback", "Ego detachment", "Learning opportunity", "Actionable adjustment"],
      modelAnswer: "Early in my career, a Staff Engineer left extensive feedback on a PR pointing out that my recursive tree traversal could cause stack overflows on deep structures and lacked sufficient unit test coverage. Rather than becoming defensive, I scheduled a 15-minute pairing session to understand their perspective. I refactored the implementation to an iterative approach using an explicit stack and added comprehensive boundary tests. Since then, I actively welcome reviews as learning accelerators and practice the same constructive review culture with peers.",
    },
    {
      q: "What is a major new technology, language, or architectural concept you taught yourself recently, and how did you apply it to build something meaningful?",
      topic: "Curiosity & Continuous Learning",
      keyConcepts: ["Proactive learning", "Practical application", "Deep dive", "Self-starter"],
      modelAnswer: "I recently dove into Vector Embeddings and RAG (Retrieval-Augmented Generation) architectures. To truly understand the mechanics beyond APIs, I studied vector similarity metrics (Cosine vs Dot Product) and built a semantic search tool combining LangChain, SQLite with vector extensions, and Gemini. Building a working project helped me understand real-world challenges like chunking strategies, token windows, and hybrid keyword+semantic retrieval.",
    },
  ],
};

/**
 * Start a new mock interview session
 */
async function startMockInterview({ role = 'frontend', level = 'mid', userContext = {} }) {
  const normalizedRole = INTERVIEW_QUESTION_BANK[role] ? role : 'frontend';
  const questions = INTERVIEW_QUESTION_BANK[normalizedRole];
  const first = questions[0];

  return {
    role: normalizedRole,
    level,
    totalQuestions: questions.length,
    questionNumber: 1,
    question: first.q,
    topic: first.topic,
    isLiveAI: !!process.env.GEMINI_API_KEY,
  };
}

/**
 * Evaluate candidate's answer for question N and provide next question or final completion
 */
async function evaluateMockInterviewAnswer({
  role = 'frontend',
  level = 'mid',
  questionNumber = 1,
  question = '',
  answer = '',
  history = [],
}) {
  const normalizedRole = INTERVIEW_QUESTION_BANK[role] ? role : 'frontend';
  const roleQuestions = INTERVIEW_QUESTION_BANK[normalizedRole];
  const questionIndex = Math.max(0, questionNumber - 1);
  const currentBankQ = roleQuestions[questionIndex] || roleQuestions[0];

  // If Gemini API is available, ask Gemini to evaluate with professional rubric
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are a Principal Software Engineering Interviewer conducting a ${level}-level technical interview for a ${role} engineer.
Question Asked: "${question}"
Candidate's Answer: "${answer}"

Evaluate the candidate's answer thoroughly and return ONLY a valid JSON object matching this exact schema:
{
  "accuracyScore": <integer 1-10>,
  "depthScore": <integer 1-10>,
  "clarityScore": <integer 1-10>,
  "overallScore": <integer 0-100>,
  "strengths": [<array of 2-3 specific things the candidate explained well>],
  "improvements": [<array of 2-3 missing edge cases, deeper concepts, or errors to fix>],
  "modelAnswer": "<A clear, gold-standard answer demonstrating expert understanding>"
}`;

      const raw = await callGemini(prompt, 'You are an expert technical interviewer. Output valid JSON only, without markdown fences.');
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const hasNext = questionNumber < roleQuestions.length;
      const nextQ = hasNext ? roleQuestions[questionNumber] : null;

      return {
        questionNumber,
        isCompleted: !hasNext,
        evaluation: {
          accuracyScore: parsed.accuracyScore || 8,
          depthScore: parsed.depthScore || 7,
          clarityScore: parsed.clarityScore || 8,
          overallScore: parsed.overallScore || 78,
          strengths: parsed.strengths || ['Good core concepts addressed'],
          improvements: parsed.improvements || ['Could elaborate on production failure modes'],
          modelAnswer: parsed.modelAnswer || currentBankQ.modelAnswer,
        },
        nextQuestion: nextQ ? {
          questionNumber: questionNumber + 1,
          question: nextQ.q,
          topic: nextQ.topic,
        } : null,
        isLiveAI: true,
      };
    } catch (err) {
      console.warn('Gemini evaluation fallback:', err.message);
    }
  }

  // Heuristic evaluation fallback
  const wordCount = (answer || '').trim().split(/\s+/).filter(Boolean).length;
  const lowerAnswer = (answer || '').toLowerCase();

  let conceptMatches = 0;
  (currentBankQ.keyConcepts || []).forEach((c) => {
    if (lowerAnswer.includes(c.toLowerCase())) conceptMatches++;
  });

  let accuracy = 5;
  let depth = 5;
  let clarity = 5;

  if (wordCount > 40) clarity += 2;
  if (wordCount > 90) depth += 2;
  if (conceptMatches >= 2) accuracy += 2;
  if (conceptMatches >= 3) { accuracy += 2; depth += 1; }
  if (conceptMatches >= 4) { accuracy += 1; depth += 1; clarity += 1; }

  accuracy = Math.min(10, Math.max(3, accuracy));
  depth = Math.min(10, Math.max(3, depth));
  clarity = Math.min(10, Math.max(4, clarity));

  const overallScore = Math.round((accuracy * 0.45 + depth * 0.35 + clarity * 0.20) * 10);

  const strengths = [];
  if (conceptMatches > 0) {
    strengths.push(`Mentioned core industry terminology: ${currentBankQ.keyConcepts.slice(0, 3).join(', ')}.`);
  }
  if (wordCount > 50) {
    strengths.push('Provided structured rationale rather than just a one-word answer.');
  } else {
    strengths.push('Direct and concise attempt at answering the prompt.');
  }

  const improvements = [];
  if (conceptMatches < 3) {
    improvements.push(`Deepen discussion on: ${currentBankQ.keyConcepts.slice(2).join(', ') || 'underlying architecture'}.`);
  }
  if (wordCount < 60) {
    improvements.push('Expand on real-world edge cases, trade-offs, and scalability implications.');
  } else {
    improvements.push('Quantify technical impact or mention observability/logging considerations.');
  }

  const hasNext = questionNumber < roleQuestions.length;
  const nextQ = hasNext ? roleQuestions[questionNumber] : null;

  return {
    questionNumber,
    isCompleted: !hasNext,
    evaluation: {
      accuracyScore: accuracy,
      depthScore: depth,
      clarityScore: clarity,
      overallScore,
      strengths,
      improvements,
      modelAnswer: currentBankQ.modelAnswer,
    },
    nextQuestion: nextQ ? {
      questionNumber: questionNumber + 1,
      question: nextQ.q,
      topic: nextQ.topic,
    } : null,
    isLiveAI: false,
  };
}

/**
 * Generate final interview report across all 5 questions
 */
function generateInterviewReport({ role, level, exchanges = [] }) {
  if (exchanges.length === 0) {
    return {
      averageScore: 70,
      decision: 'Hire',
      strengths: ['Demonstrated foundational software engineering capabilities'],
      recommendations: ['Practice timed mock interviews'],
    };
  }

  const totalScore = exchanges.reduce((sum, e) => sum + (e.evaluation?.overallScore || 70), 0);
  const averageScore = Math.round(totalScore / exchanges.length);

  let decision = 'Needs Improvement';
  let badgeColor = 'amber';
  if (averageScore >= 85) {
    decision = 'Strong Hire';
    badgeColor = 'emerald';
  } else if (averageScore >= 70) {
    decision = 'Hire';
    badgeColor = 'blue';
  } else if (averageScore >= 55) {
    decision = 'Leaning Hire';
    badgeColor = 'indigo';
  }

  return {
    averageScore,
    decision,
    badgeColor,
    totalQuestions: exchanges.length,
    role,
    level,
    strengths: [
      `Consistent technical accuracy across ${role.toUpperCase()} domain challenges`,
      'Demonstrated structured problem-solving approach during live questioning',
      'Solid command of architectural trade-offs and runtime characteristics',
    ],
    recommendations: [
      'Focus on addressing potential edge cases and error handling before interviewer prompts',
      'Always state Time and Space complexity explicitly when explaining algorithms',
      'Incorporate real-world production metrics and monitoring in system design answers',
    ],
  };
}

function generateFallbackCodeReview({ code, language, problemTitle }) {
  const codeStr = typeof code === 'string' ? code : '';
  const loopCount = (codeStr.match(/\b(for|while)\b/g) || []).length;
  const hasSort = /\b(sort|sorted|Arrays\.sort|std::sort)\b/.test(codeStr);
  const hasMap = /\b(Map|Set|dict|hash_map|unordered_map|HashMap|HashSet)\b/.test(codeStr);

  let timeComplexity = 'O(N)';
  let spaceComplexity = hasMap ? 'O(N)' : 'O(1)';
  let verdict = 'Good';
  let score = 84;

  if (loopCount >= 2) {
    timeComplexity = 'O(N²)';
    verdict = 'Suboptimal';
    score = 70;
  } else if (hasSort) {
    timeComplexity = 'O(N log N)';
    verdict = 'Optimal';
    score = 90;
  } else if (hasMap && loopCount <= 1) {
    timeComplexity = 'O(N)';
    verdict = 'Optimal';
    score = 92;
  }

  return {
    timeComplexity,
    spaceComplexity,
    verdict,
    score,
    summary: `Structured ${language.toUpperCase()} implementation for ${problemTitle}. Employs ${hasMap ? 'hash lookup caching' : loopCount > 1 ? 'nested iteration' : 'linear traversal'} to process inputs.`,
    strengths: [
      `Valid syntax and clear identifier naming conventions in ${language}`,
      hasMap ? 'Uses constant-time hash lookups for efficient data retrieval' : 'Minimal memory footprint with in-place operations',
      'Clean modular function definition structure',
    ],
    improvements: [
      'Add defensive boundary checks for empty or single-element inputs',
      loopCount >= 2 ? 'Consider replacing inner loop with a Hash Map to reduce time complexity to O(N)' : 'Verify numeric bounds against edge-case integer overflow',
      'Explicitly document Time and Space complexity in function docstrings',
    ],
    edgeCases: [
      'Empty or null input dataset',
      'Array containing negative values or duplicate elements',
      'Maximum scale constraints (e.g., N = 10^5 elements)',
    ],
    optimizedCode: `// Optimized ${language.toUpperCase()} Solution\n${codeStr}`,
  };
}

async function reviewCodeSolution({ code, language = 'javascript', problemTitle = 'Algorithm Challenge', testInput = '' }) {
  if (!code || !code.trim()) {
    throw new Error('Code is required for review');
  }

  const prompt = `Analyze this code submission for the algorithm problem "${problemTitle}".
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`
Test Input Context: ${testInput || 'Standard test cases'}

Evaluate strictly as a Senior Principal FAANG Algorithm Interviewer.
Return ONLY valid JSON matching this exact structure:
{
  "timeComplexity": "O(N log N)",
  "spaceComplexity": "O(N)",
  "verdict": "Optimal" | "Good" | "Suboptimal" | "Needs Bugfix",
  "score": 88,
  "summary": "Concise 2-sentence summary of the approach",
  "strengths": ["Clear naming and variable semantics", "Optimal memory footprint"],
  "improvements": ["Missing empty array boundary check", "Could eliminate redundant hash lookup"],
  "edgeCases": ["Negative integers", "Single element array"],
  "optimizedCode": "// Refactored drop-in code..."
}`;

  try {
    const raw = await callGemini(
      prompt,
      'You are a Principal Software Engineer and Algorithm Specialist reviewing technical interview solutions. Always output clean parseable JSON without backticks.',
      0.3
    );
    const cleaned = raw.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return generateFallbackCodeReview({ code, language, problemTitle });
  }
}

module.exports = {
  getCareerAdvice,
  analyzeResumeATS,
  startMockInterview,
  evaluateMockInterviewAnswer,
  generateInterviewReport,
  reviewCodeSolution,
};
