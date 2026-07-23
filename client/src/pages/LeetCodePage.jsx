import { useState } from 'react';
import { useLeetCode } from '../hooks/useLeetCode';
import { demoLeetCode } from '../api/leetcode';
import { useUser } from '../context/UserContext';
import MetricCard from '../components/MetricCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Search, CheckCircle, Brain, BarChart3 } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function LeetCodePage() {
  const { leetcodeUser, setLeetcodeUser } = useUser();
  const { data, loading, error, fetchProfile } = useLeetCode();
  const [inputValue, setInputValue] = useState(leetcodeUser);

  const handleFetch = () => {
    if (inputValue.trim()) {
      setLeetcodeUser(inputValue.trim());
      fetchProfile(inputValue.trim());
    }
  };

  const displayData = data || demoLeetCode;

  const difficultyData = [
    { name: 'Easy', value: displayData.easy },
    { name: 'Medium', value: displayData.medium },
    { name: 'Hard', value: displayData.hard },
  ];

  const weeklyData = (displayData.weeklyProgress || []).map((count, i) => ({
    week: `W${i + 1}`,
    solved: count,
  }));

  const topicData = (displayData.topics || []).map((t) => ({
    name: t.name,
    value: t.solved,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">LeetCode Tracker</h1>
        <p className="text-sm text-slate-500 mt-1">Track your problem-solving progress</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="LeetCode username"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          className="input-field w-60"
        />
        <button onClick={handleFetch} className="btn-primary flex items-center gap-2" disabled={loading}>
          <Search className="w-4 h-4" />
          {loading ? 'Loading...' : 'Fetch'}
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Solved" value={displayData.total} icon={CheckCircle} color="text-blue-500" loading={loading} />
        <MetricCard label="Easy" value={displayData.easy} icon={Brain} color="text-emerald-500" loading={loading} />
        <MetricCard label="Medium" value={displayData.medium} icon={BarChart3} color="text-amber-500" loading={loading} />
        <MetricCard
          label="Hard"
          value={displayData.hard}
          icon={BarChart3}
          color="text-red-500"
          loading={loading}
          badge={{ text: `${Math.round((displayData.hard / Math.max(displayData.total, 1)) * 100)}%`, color: 'bg-red-100 text-red-700' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Line type="monotone" dataKey="solved" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title">Difficulty Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {difficultyData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {difficultyData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-xs text-slate-500">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Top Topics Solved</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topicData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} width={80} />
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
