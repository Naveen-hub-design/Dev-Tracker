import { useState, useCallback, useRef } from 'react';
import { sendAIChat, scanResumeATS } from '../api/ai';

const SUGGESTIONS = [
  { icon: '🗺️', label: 'Career Roadmap', prompt: 'Show me a personalized career roadmap based on my current DevTrack metrics' },
  { icon: '🎯', label: 'Skill Gap Analysis', prompt: 'Analyze my current GitHub, LeetCode and HackerRank skills and identify gaps for target roles' },
  { icon: '💼', label: 'Interview Prep', prompt: 'Give me a tailored interview preparation plan for full-stack and product companies' },
  { icon: '📝', label: 'Resume Review', prompt: 'Review my developer profile and recommend bullet points that will impress tech recruiters' },
  { icon: '🚀', label: 'Project Ideas', prompt: 'Suggest standout portfolio project ideas based on my primary languages and frameworks' },
  { icon: '📚', label: 'System Design', prompt: 'Recommend a high-yield learning path for mastering system design and distributed systems' },
  { icon: '💡', label: 'Senior Dev Tips', prompt: 'Give me 5 practical engineering practices that senior developers swear by' },
  { icon: '🏆', label: 'Placement Ready?', prompt: 'Assess my placement readiness and tell me what companies I am most competitive for' },
];

const WELCOME_MSG = {
  role: 'assistant',
  content: `### Welcome to DevTrack AI Career Coach & ATS Matcher 🚀

I analyze your real-time **GitHub commit velocity**, **LeetCode difficulty ratios**, **projects**, and **resume** to give you competitive placement advice.

**What I can do for you:**
* **Real-time Career Guidance** — Ask any technical, behavioral, or roadmap question.
* **Resume ATS Matcher** — Switch to the **ATS Scanner tab** to benchmark your resume against real job descriptions.
* **Tailored Bullet Points** — Generate action-oriented bullet points with quantified metrics.
* **Interview Readiness** — Receive custom DSA and system design preparation targets.

Pick a quick topic below or type your question!`,
  timestamp: Date.now(),
};

export function useCareerAssistant() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [isTyping, setIsTyping] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [isScanningATS, setIsScanningATS] = useState(false);
  const [atsError, setAtsError] = useState(null);
  const scrollRef = useRef(null);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = { role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendAIChat(text, messages);
      const assistantMsg = {
        role: 'assistant',
        content: response.text,
        isLiveAI: response.isLiveAI,
        model: response.model,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('AI chat error, using local fallback:', err);
      const fallbackMsg = {
        role: 'assistant',
        content: `### 💡 Career Coach Advice\n\nBased on your query regarding "${text.slice(0, 45)}...":\n\n* **Consistency First:** Maintain your daily problem-solving momentum and GitHub streaks on your dashboard.\n* **Deepen Projects:** Turn tutorials into production-grade systems by adding Docker, CI/CD, and automated tests.\n* **ATS Scanner:** Try pasting target job descriptions in our **ATS Scanner** to see exact keyword match percentages.\n\n*Note: Add \`GEMINI_API_KEY\` in \`server/.env\` for live multi-turn reasoning powered by Google Gemini 2.0 Flash.*`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const runATSScan = useCallback(async (jobDescription, resumeOverride = null) => {
    if (!jobDescription || !jobDescription.trim()) {
      setAtsError('Please enter a job description to scan.');
      return;
    }
    setIsScanningATS(true);
    setAtsError(null);
    try {
      const result = await scanResumeATS(jobDescription, resumeOverride);
      setAtsResult(result);
      return result;
    } catch (err) {
      setAtsError(err.message || 'Failed to scan resume against job description');
    } finally {
      setIsScanningATS(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MSG]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    scrollRef,
    SUGGESTIONS,
    // ATS Scanner
    runATSScan,
    atsResult,
    isScanningATS,
    atsError,
    clearATSResult: () => setAtsResult(null),
  };
}
