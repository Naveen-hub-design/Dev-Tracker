import { useState, useCallback, useMemo } from 'react';

const DEMO_USERS = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', avatar: null, role: 'admin', status: 'active', github: true, leetcode: true, hackerrank: true, registeredAt: '2026-07-20', lastActive: '2026-07-25', problemsSolved: 245, streak: 32 },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: true, hackerrank: false, registeredAt: '2026-07-18', lastActive: '2026-07-25', problemsSolved: 189, streak: 14 },
  { id: '3', name: 'Priya Patel', email: 'priya@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: false, hackerrank: true, registeredAt: '2026-07-15', lastActive: '2026-07-24', problemsSolved: 312, streak: 45 },
  { id: '4', name: 'Alex Rivera', email: 'alex@example.com', avatar: null, role: 'user', status: 'suspended', github: false, leetcode: true, hackerrank: false, registeredAt: '2026-07-10', lastActive: '2026-07-12', problemsSolved: 67, streak: 0 },
  { id: '5', name: 'Emma Wilson', email: 'emma@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: true, hackerrank: true, registeredAt: '2026-07-22', lastActive: '2026-07-25', problemsSolved: 156, streak: 28 },
  { id: '6', name: 'James Kim', email: 'james@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: false, hackerrank: false, registeredAt: '2026-07-19', lastActive: '2026-07-23', problemsSolved: 34, streak: 5 },
  { id: '7', name: 'Sofia Garcia', email: 'sofia@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: true, hackerrank: true, registeredAt: '2026-07-01', lastActive: '2026-07-25', problemsSolved: 478, streak: 62 },
  { id: '8', name: 'David Brown', email: 'david@example.com', avatar: null, role: 'user', status: 'active', github: false, leetcode: true, hackerrank: false, registeredAt: '2026-07-14', lastActive: '2026-07-20', problemsSolved: 98, streak: 3 },
  { id: '9', name: 'Aisha Mohammed', email: 'aisha@example.com', avatar: null, role: 'admin', status: 'active', github: true, leetcode: true, hackerrank: true, registeredAt: '2026-06-15', lastActive: '2026-07-25', problemsSolved: 567, streak: 89 },
  { id: '10', name: 'Ryan O\'Connor', email: 'ryan@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: false, hackerrank: true, registeredAt: '2026-07-21', lastActive: '2026-07-24', problemsSolved: 45, streak: 7 },
  { id: '11', name: 'Mei Lin Zhang', email: 'mei@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: true, hackerrank: false, registeredAt: '2026-07-05', lastActive: '2026-07-25', problemsSolved: 234, streak: 38 },
  { id: '12', name: 'Carlos Mendez', email: 'carlos@example.com', avatar: null, role: 'user', status: 'suspended', github: false, leetcode: false, hackerrank: false, registeredAt: '2026-07-08', lastActive: '2026-07-09', problemsSolved: 12, streak: 0 },
  { id: '13', name: 'Lisa Anderson', email: 'lisa@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: true, hackerrank: true, registeredAt: '2026-07-23', lastActive: '2026-07-25', problemsSolved: 89, streak: 19 },
  { id: '14', name: 'Omar Hassan', email: 'omar@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: false, hackerrank: false, registeredAt: '2026-07-11', lastActive: '2026-07-22', problemsSolved: 56, streak: 2 },
  { id: '15', name: 'Yuki Tanaka', email: 'yuki@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: true, hackerrank: true, registeredAt: '2026-06-28', lastActive: '2026-07-25', problemsSolved: 412, streak: 54 },
  { id: '16', name: 'Nathan Wright', email: 'nathan@example.com', avatar: null, role: 'user', status: 'active', github: false, leetcode: true, hackerrank: true, registeredAt: '2026-07-16', lastActive: '2026-07-25', problemsSolved: 123, streak: 11 },
  { id: '17', name: 'Fatima Al-Rashid', email: 'fatima@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: true, hackerrank: false, registeredAt: '2026-07-02', lastActive: '2026-07-24', problemsSolved: 278, streak: 41 },
  { id: '18', name: 'Jake Thompson', email: 'jake@example.com', avatar: null, role: 'user', status: 'active', github: true, leetcode: false, hackerrank: true, registeredAt: '2026-07-24', lastActive: '2026-07-25', problemsSolved: 15, streak: 2 },
];

function generateGrowthData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  let users = 120;
  return months.map((name) => {
    users += Math.floor(Math.random() * 80) + 20;
    return { name, users, active: Math.floor(users * 0.6) + Math.floor(Math.random() * 20) };
  });
}

function generateDailyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((name) => ({
    name,
    logins: Math.floor(Math.random() * 150) + 80,
    problems: Math.floor(Math.random() * 200) + 50,
    commits: Math.floor(Math.random() * 100) + 30,
  }));
}

export function useAdmin() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    dau: Math.floor(users.length * 0.65),
    githubConnected: users.filter((u) => u.github).length,
    leetcodeConnected: users.filter((u) => u.leetcode).length,
    hackerrankConnected: users.filter((u) => u.hackerrank).length,
    allConnected: users.filter((u) => u.github && u.leetcode && u.hackerrank).length,
    totalProblems: users.reduce((s, u) => s + u.problemsSolved, 0),
    avgStreak: Math.round(users.reduce((s, u) => s + u.streak, 0) / users.length),
  }), [users]);

  const growthData = useMemo(() => generateGrowthData(), []);
  const dailyData = useMemo(() => generateDailyData(), []);

  const filtered = useMemo(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status === statusFilter);
    }
    switch (sortBy) {
      case 'oldest': result.sort((a, b) => new Date(a.registeredAt) - new Date(b.registeredAt)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'problems': result.sort((a, b) => b.problemsSolved - a.problemsSolved); break;
      case 'streak': result.sort((a, b) => b.streak - a.streak); break;
      case 'newest': default: result.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)); break;
    }
    return result;
  }, [users, search, statusFilter, sortBy]);

  const recentUsers = useMemo(() =>
    [...users].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0, 5),
    [users]
  );

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const toggleSuspend = useCallback((id) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
    ));
  }, []);

  return {
    users: filtered, allUsers: users, stats, growthData, dailyData,
    recentUsers, search, setSearch, statusFilter, setStatusFilter,
    sortBy, setSortBy, deleteUser, toggleSuspend,
  };
}
