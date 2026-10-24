import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/goals`
    : '/api/goals',
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('devtrack_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch { /* ignore */ }
  }
  return req;
});

const DEFAULT_GOALS = {
  daily: { commits: 3, problems: 2, hours: 2 },
  weekly: { commits: 15, problems: 10, hours: 14 },
  monthly: { commits: 60, problems: 40, hours: 60 },
};

export async function fetchGoals() {
  try {
    const res = await API.get('/');
    const data = res.data;
    if (data) {
      return {
        goals: {
          daily: {
            commits: data.dailyCommits ?? DEFAULT_GOALS.daily.commits,
            problems: data.dailyProblems ?? DEFAULT_GOALS.daily.problems,
            hours: data.dailyHours ?? DEFAULT_GOALS.daily.hours,
          },
          weekly: {
            commits: data.weeklyCommits ?? DEFAULT_GOALS.weekly.commits,
            problems: data.weeklyProblems ?? DEFAULT_GOALS.weekly.problems,
            hours: data.weeklyHours ?? DEFAULT_GOALS.weekly.hours,
          },
          monthly: {
            commits: data.monthlyCommits ?? DEFAULT_GOALS.monthly.commits,
            problems: data.monthlyProblems ?? DEFAULT_GOALS.monthly.problems,
            hours: data.monthlyHours ?? DEFAULT_GOALS.monthly.hours,
          },
        },
        history: data.history || {},
      };
    }
  } catch (err) {
    console.warn('Falling back to local goals:', err.message);
  }

  try {
    const rawGoals = localStorage.getItem('devtrack_goals');
    const rawHist = localStorage.getItem('devtrack_goals_history');
    return {
      goals: rawGoals ? JSON.parse(rawGoals) : DEFAULT_GOALS,
      history: rawHist ? JSON.parse(rawHist) : {},
    };
  } catch {
    return { goals: DEFAULT_GOALS, history: {} };
  }
}

export async function saveGoalTargets(targets) {
  try {
    const res = await API.put('/', targets);
    const data = res.data;
    return {
      daily: {
        commits: data.dailyCommits,
        problems: data.dailyProblems,
        hours: data.dailyHours,
      },
      weekly: {
        commits: data.weeklyCommits,
        problems: data.weeklyProblems,
        hours: data.weeklyHours,
      },
      monthly: {
        commits: data.monthlyCommits,
        problems: data.monthlyProblems,
        hours: data.monthlyHours,
      },
    };
  } catch (err) {
    console.warn('Saving goal targets locally:', err.message);
    localStorage.setItem('devtrack_goals', JSON.stringify(targets));
    return targets;
  }
}

export async function logActivity(activity) {
  try {
    const res = await API.post('/log', activity);
    return res.data?.history || {};
  } catch (err) {
    console.warn('Logging activity locally:', err.message);
    return null;
  }
}
