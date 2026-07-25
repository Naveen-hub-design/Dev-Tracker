import { useState, useCallback, useRef } from 'react';

const SUGGESTIONS = [
  { icon: '🗺️', label: 'Career Roadmap', prompt: 'Show me a career roadmap for becoming a senior full-stack developer' },
  { icon: '🎯', label: 'Skill Gap Analysis', prompt: 'Analyze my current skills and identify gaps for my target role' },
  { icon: '💼', label: 'Interview Prep', prompt: 'Help me prepare for my next technical interview' },
  { icon: '📝', label: 'Resume Review', prompt: 'Review my resume and suggest improvements' },
  { icon: '🚀', label: 'Project Ideas', prompt: 'Suggest portfolio projects that would impress recruiters' },
  { icon: '📚', label: 'Learning Path', prompt: 'Recommend a learning path for mastering system design' },
  { icon: '💡', label: 'Coding Tips', prompt: 'Give me 5 coding tips that senior developers swear by' },
  { icon: '🏆', label: 'Placement Ready?', prompt: 'Assess my placement readiness based on my current profile' },
  { icon: '🎤', label: 'Mock Interview', prompt: 'Start a mock technical interview with me' },
  { icon: '📖', label: 'Best Courses', prompt: 'Recommend the best courses for web development in 2026' },
];

const AI_RESPONSES = {
  roadmap: {
    title: 'Career Roadmap: Senior Full-Stack Developer',
    content: `Here's your personalized roadmap to becoming a senior full-stack developer:\n\n**Phase 1 — Foundation (0–3 months)**\n• Master JavaScript fundamentals (closures, prototypes, async/await)\n• Deep dive into React — hooks, context, custom hooks\n• Backend: Node.js + Express, REST API design\n• Database: PostgreSQL, MongoDB, Redis basics\n\n**Phase 2 — Intermediate (3–6 months)**\n• TypeScript mastery — generics, utility types, decorators\n• Testing: Jest, React Testing Library, Cypress\n• CI/CD pipelines, Docker fundamentals\n• GraphQL vs REST — when to use which\n\n**Phase 3 — Advanced (6–12 months)**\n• System design — load balancing, caching, microservices\n• AWS/GCP cloud services — Lambda, S3, EC2, RDS\n• Performance optimization — lazy loading, code splitting, CDN\n• Security — OWASP top 10, authentication patterns\n\n**Phase 4 — Senior Level (12–18 months)**\n• Tech lead skills — mentoring, code reviews, architecture decisions\n• Open source contributions\n• Conference talks / blog writing\n• Interview preparation — system design + behavioral\n\n📊 **Your Progress:** Based on your GitHub activity, you're solidly in Phase 2. Focus on system design next.`,
    tags: ['Full-Stack', 'Career Growth', '18-Month Plan'],
  },
  skillgap: {
    title: 'Skill Gap Analysis',
    content: `Based on your profile analysis, here's your skill gap assessment:\n\n**✅ Strong Skills**\n• JavaScript / ES6+ — Advanced\n• React — Intermediate-Advanced\n• Git / GitHub — Advanced\n• REST APIs — Intermediate\n\n**⚠️ Needs Improvement**\n• TypeScript — Basic (recommendation: learn before interview season)\n• System Design — Not started (critical for senior roles)\n• Testing — Minimal coverage (aim for 80%+ on new projects)\n• Docker/CI-CD — Beginner\n\n**❌ Missing Skills**\n• Cloud Services (AWS/GCP)\n• Database Optimization\n• Security Best Practices\n• GraphQL\n\n**🎯 Priority Actions:**\n1. Complete a TypeScript course this month\n2. Start "Designing Data-Intensive Applications" (book)\n3. Add tests to your top 3 GitHub projects\n4. Deploy one project with Docker + CI/CD`,
    tags: ['TypeScript', 'System Design', 'Cloud', 'Testing'],
  },
  interview: {
    title: 'Interview Preparation Guide',
    content: `Let's get you interview-ready! Here's your prep plan:\n\n**🔥 Technical Round**\n• **Data Structures:** Arrays, Linked Lists, Trees, Graphs, Hash Maps\n• **Algorithms:** Two Pointers, Sliding Window, BFS/DFS, Dynamic Programming\n• **Practice:** 2-3 LeetCode problems daily (mix of Easy/Medium/Hard)\n\n**💬 Behavioral Questions (STAR Method)**\n• "Tell me about a time you resolved a conflict in a team"\n• "Describe a challenging bug you fixed"\n• "How do you handle tight deadlines?"\n• "Tell me about a project you're most proud of"\n\n**🏗️ System Design (Senior Roles)**\n• Design URL Shortener, Chat System, News Feed\n• Practice: scalability, availability, consistency trade-offs\n• Resources: SystemDesign.one, ByteByteGo\n\n**📋 Your Interview Checklist:**\n□ Update resume with quantified achievements\n□ Prepare 5 STAR stories\n□ Solve 100+ LeetCode problems\n□ Mock interview with peer (2x weekly)\n□ Research target company tech stack`,
    tags: ['Technical', 'Behavioral', 'System Design', 'LeetCode'],
  },
  resume: {
    title: 'Resume Review & Recommendations',
    content: `Here's my analysis of your resume strategy:\n\n**✅ What's Working**\n• Clear project descriptions with tech stacks\n• GitHub activity shows consistency\n• LeetCode profile demonstrates problem-solving\n\n**🔧 Improvements Needed**\n• **Add Metrics:** "Improved load time by 40%" > "Optimized performance"\n• **Action Verbs:** Led, Architected, Implemented, Reduced, Increased\n• **One Page Rule:** Keep it to 1 page for <5 years experience\n• **ATS-Friendly:** Use standard section headers, avoid graphics\n\n**📐 Winning Formula:**\n• **Header:** Name, Email, GitHub, LinkedIn, Portfolio\n• **Summary:** 2 lines — who you are + what you bring\n• **Experience:** 3-5 bullets per role, quantified impact\n• **Projects:** Top 3 projects with links + tech stack\n• **Skills:** Grouped by category, relevant to job posting\n\n**💡 Pro Tips:**\n1. Tailor resume for each application (mirror job description keywords)\n2. Add a "Featured Project" section with architecture diagram\n3. Include open-source contributions if any`,
    tags: ['Resume', 'ATS', 'Metrics', 'Formatting'],
  },
  projects: {
    title: 'Portfolio Project Suggestions',
    content: `Projects that will make recruiters stop scrolling:\n\n**🌟 Tier 1 — Impressive Solo Projects**\n1. **Real-Time Collaboration Tool** — WebSocket + operational transforms\n2. **AI Code Review Bot** — Integrate OpenAI API + GitHub webhooks\n3. **DevOps Dashboard** — Monitor deployments, CI/CD pipeline status\n\n**🌟 Tier 2 — Full-Stack Showcase**\n4. **E-Commerce Platform** — Next.js + Stripe + PostgreSQL + Redis cache\n5. **Social Media Analytics** — Data visualization, scheduling, insights\n6. **Project Management Tool** — Kanban, real-time updates, team features\n\n**🌟 Tier 3 — Open Source**\n7. **CLI Tool** — Something developers actually use (npm package)\n8. **VS Code Extension** — Solve a real pain point\n9. **React Component Library** — Published to npm\n\n**📋 Project Must-Haves:**\n• Live demo link (Vercel/Railway)\n• Clean README with screenshots\n• Tests (even basic ones)\n• CI/CD pipeline\n• Docker support\n\n**Based on your profile:** You have solid backend skills. I'd recommend the Real-Time Collaboration Tool — it showcases system design thinking that interviewers love.`,
    tags: ['Portfolio', 'Full-Stack', 'Open Source', 'Demo'],
  },
  learning: {
    title: 'Recommended Learning Path',
    content: `Personalized courses & resources based on your skill gaps:\n\n**📚 Must-Take Courses (2026)**\n1. **CS50x** (Harvard/edX) — Computer Science fundamentals\n2. **The Odin Project** — Full-stack JavaScript mastery\n3. **System Design Interview** (Educative) — Ace system design rounds\n4. **AWS Cloud Practitioner** (Coursera) — Cloud fundamentals\n\n**📖 Books to Read**\n• "Clean Code" by Robert Martin\n• "Designing Data-Intensive Applications" by Martin Kleppmann\n• "The Pragmatic Programmer" by Hunt & Thomas\n• "Cracking the Coding Interview" by Gayle McDowell\n\n**🎬 YouTube Channels**\n• Fireship — Quick tech overviews\n• Theo (t3.gg) — Modern web dev\n• ByteByteGo — System design\n• NeetCode — LeetCode solutions explained\n\n**⏰ Suggested Weekly Schedule:**\n• Mon/Wed: Course learning (2 hrs)\n• Tue/Thu: LeetCode practice (1.5 hrs)\n• Fri: Project work (3 hrs)\n• Sat: Reading/reading group\n• Sun: Rest & review`,
    tags: ['Courses', 'Books', 'YouTube', 'Schedule'],
  },
  tips: {
    title: 'Senior Developer Tips',
    content: `5 coding tips that senior developers swear by:\n\n**1. 🧪 Write Tests First**\nTDD isn't just about testing — it forces you to think about the API surface before implementation. Start with edge cases.\n\n**2. 📝 Code is Read More Than Written**\nIf a function needs a comment to explain what it does, rename it. Use descriptive variable names: \`isUserAuthenticated\` instead of \`flag\`.\n\n**3. 🔍 Master Your Debugging Tools**\nChrome DevTools Network tab, VS Code debugger, React DevTools Profiler. Mastering these saves hours weekly.\n\n**4. 🏗️ Refactor Mercilessly**\nIf you see a code smell, fix it. "We'll fix it later" becomes "we never fixed it." Small, continuous improvements compound.\n\n**5. 🤔 Think in Abstractions**\nBefore coding, ask: "What's the interface? What changes? What stays the same?" Good abstractions make codebases scalable.\n\n**Bonus: Commit Early, Commit Often**\nSmall commits with clear messages make code review easier and git blame more useful.`,
    tags: ['Best Practices', 'Debugging', 'Refactoring', 'TDD'],
  },
  placement: {
    title: 'Placement Readiness Score',
    content: `Here's your comprehensive placement readiness assessment:\n\n**📊 Overall Score: 72/100**\n\n**Breakdown:**\n• **DSA Problem Solving:** 78/100 — Strong, keep solving daily\n• **System Design:** 45/100 — Needs significant work\n• **Communication:** 70/100 — Practice explaining solutions aloud\n• **Project Portfolio:** 80/100 — Good projects, add metrics\n• **Resume Quality:** 65/100 — Needs quantified achievements\n• **Company Research:** 60/100 — Research top 5 target companies\n\n**🎯 To Reach 90+:**\n1. Complete system design course (+15 points)\n2. Polish resume with metrics (+10 points)\n3. Do 5 mock interviews with peers (+5 points)\n4. Contribute to open source (+5 points)\n\n**📅 Suggested Timeline:**\n• Weeks 1-4: System design + resume polish\n• Weeks 5-8: Mock interviews + company research\n• Weeks 9-12: Apply and iterate based on feedback\n\n**🏢 Your Target Companies (based on skill level):**\n• Tier 1: Google, Meta, Amazon\n• Tier 2: Stripe, Vercel, Linear\n• Tier 3: Startups (YC-backed)\n\nYou're closer than you think! Focus on system design and you'll be competitive.`,
    tags: ['Score', 'System Design', 'Resume', 'Timeline'],
  },
  mock: {
    title: 'Mock Technical Interview',
    content: `Let's start a mock interview! I'll ask, you answer.\n\n**Question 1 (Easy — Arrays):**\nGiven an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you cannot use the same element twice.\n\n\`\`\`javascript\nfunction twoSum(nums, target) {\n  // Your solution here\n}\n\`\`\`\n\n**Hint:** Think about what data structure allows O(1) lookups.\n\n**Expected Approach:** Hash Map — single pass, O(n) time, O(n) space.\n\n**Follow-up:** What if the array is sorted? Can you do it in O(1) space?\n\nType your solution and I'll review it!`,
    tags: ['Arrays', 'Hash Map', 'Two Pointers', 'Easy'],
  },
  courses: {
    title: 'Recommended Courses & Certifications',
    content: `Top courses and certifications for career growth:\n\n**🎓 Free / Low-Cost**\n1. **CS50x** — Harvard's intro to CS (free)\n2. **freeCodeCamp** — Full-stack certifications (free)\n3. **The Odin Project** — Full-stack JS path (free)\n4. **MIT OCW 6.006** — Algorithmic thinking (free)\n\n**💰 Worth the Investment**\n5. **AWS Solutions Architect** — $300 exam, salary boost $15K+\n6. **Google Cloud Professional** — Highly valued in cloud roles\n7. **Meta Front-End Developer** (Coursera) — $49/mo\n8. **Educative: System Design** — $79/mo, interview-focused\n\n**🏆 Most Valued Certifications (2026):**\n• AWS Solutions Architect Associate\n• Google Cloud Professional Developer\n• Kubernetes Administrator (CKA)\n• HashiCorp Terraform Associate\n\n**Based on your profile:** You'd benefit most from:\n1. AWS Cloud Practitioner (quick win, 2 weeks prep)\n2. System Design course (interview-critical)\n3. TypeScript deep-dive (free resources available)\n\n**📊 ROI Ranking:**\n1. AWS SA Associate (highest salary impact)\n2. CKA (DevOps roles)\n3. Google Cloud (data/AI roles)`,
    tags: ['AWS', 'Google Cloud', 'Coursera', 'freeCodeCamp'],
  },
};

function matchTopic(input) {
  const lower = input.toLowerCase();
  if (/roadmap|career path|road.map|career plan|growth/.test(lower)) return 'roadmap';
  if (/skill.*gap|gap.*analysis|what.*learn|missing.*skill/.test(lower)) return 'skillgap';
  if (/interview|behavioral|star method|prepare/.test(lower) && !/mock/.test(lower)) return 'interview';
  if (/resume|cv|curriculum|bullet/.test(lower)) return 'resume';
  if (/project|portfolio|build.*app|what.*build/.test(lower)) return 'projects';
  if (/learn|course|book|resource|study|youtube/.test(lower)) return 'learning';
  if (/tip|advice|habit|best.practice|senior/.test(lower)) return 'tips';
  if (/placement|ready|score|assessment|hireable|hire/.test(lower)) return 'placement';
  if (/mock|practice.*question|coding.*question|problem/.test(lower)) return 'mock';
  if (/cert|certification|credential/.test(lower)) return 'courses';
  if (/hi|hello|hey|start|help|what can/.test(lower)) return 'welcome';
  return 'default';
}

const WELCOME_MSG = {
  role: 'assistant',
  content: `Hello! I'm your AI Career Assistant 🚀\n\nI can help you with:\n• **Career Roadmaps** — personalized growth plans\n• **Skill Gap Analysis** — what to learn next\n• **Interview Preparation** — technical + behavioral\n• **Resume Review** — make your resume stand out\n• **Project Suggestions** — portfolio-worthy ideas\n• **Learning Paths** — courses, books, resources\n• **Coding Tips** — advice from senior devs\n• **Placement Readiness** — score your preparedness\n• **Mock Interviews** — practice with real questions\n• **Certifications** — which ones matter most\n\nPick a suggestion below or just ask me anything!`,
  timestamp: Date.now(),
};

export function useCareerAssistant() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const scrollRef = useRef(null);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const topic = matchTopic(text);

    setTimeout(() => {
      let response;
      if (topic === 'welcome') {
        response = { role: 'assistant', content: WELCOME_MSG.content, timestamp: Date.now(), isWelcome: true };
      } else if (topic === 'default') {
        response = {
          role: 'assistant', timestamp: Date.now(),
          content: `Great question! Here's what I think:\n\nBased on your query about "${text.slice(0, 50)}...", here are my recommendations:\n\n1. **Break it down** — What specific aspect are you most interested in?\n2. **Check your dashboard** — Your Goals page tracks daily progress\n3. **Review your skills** — The Job Match page shows role readiness\n\nTry asking me about:\n• Career roadmap for your target role\n• Skill gap analysis\n• Interview preparation tips\n• Resume improvements\n• Project suggestions\n• Learning recommendations\n• Placement readiness`,
          tags: ['General'],
        };
      } else {
        response = { ...AI_RESPONSES[topic], role: 'assistant', timestamp: Date.now() };
      }
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 800 + Math.random() * 1200);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MSG]);
    setActiveCard(null);
  }, []);

  return {
    messages, isTyping, activeCard, setActiveCard,
    sendMessage, clearChat, scrollRef, SUGGESTIONS,
  };
}
