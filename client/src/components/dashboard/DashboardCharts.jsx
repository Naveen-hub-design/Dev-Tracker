import React, { useMemo } from 'react';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
  LineChart, Line,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const LANG_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
const DIFF_COLORS = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' };

function ChartSkeleton({ title }) {
  return (
    <Card>
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-[200px] w-full" />
    </Card>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-600">
          {entry.name}: <span className="font-medium text-slate-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function LanguagePieChart({ data }) {
  const chartData = useMemo(() => {
    if (!data?.languages) return [];
    return Object.entries(data.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [data?.languages]);

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Languages</h3>
        <EmptyState icon={PieIcon} title="No language data" description="GitHub languages will appear here." />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Language Distribution</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" animationDuration={800}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [`${val}%`, 'Usage']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {chartData.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LANG_COLORS[i % LANG_COLORS.length] }} />
            <span className="text-[11px] text-slate-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DifficultyBarChart({ data }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Easy', count: data.easy || 0 },
      { name: 'Medium', count: data.medium || 0 },
      { name: 'Hard', count: data.hard || 0 },
    ].filter((d) => d.count > 0);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Problem Difficulty</h3>
        <EmptyState icon={PieIcon} title="No difficulty data" description="LeetCode data will appear here." />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Problem Difficulty</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" name="Solved" radius={[4, 4, 0, 0]} barSize={40} animationDuration={800}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={DIFF_COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function WeeklyActivityChart({ data }) {
  const chartData = useMemo(() => {
    const activity = data?.github?._raw?.commitActivity;
    if (!activity) return [];
    const today = new Date();
    return activity.slice(-12).map((count, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (12 - i));
      return { week: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), commits: count };
    });
  }, [data?.github]);

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Weekly Activity</h3>
        <EmptyState icon={PieIcon} title="No activity data" description="GitHub activity will appear here." />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Weekly Activity</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="commits" name="Commits" stroke="#3B82F6" fill="url(#actGrad)" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} activeDot={{ r: 5 }} animationDuration={800} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function WeeklyProgressChart({ data }) {
  const chartData = useMemo(() => {
    const progress = data?.leetcode?._raw?.weeklyProgress;
    if (!progress) return [];
    return progress.map((count, i) => ({ week: `W${i + 1}`, solved: count }));
  }, [data?.leetcode]);

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Weekly Progress</h3>
        <EmptyState icon={PieIcon} title="No progress data" description="LeetCode weekly data will appear here." />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Weekly Progress</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="solved" name="Solved" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} activeDot={{ r: 5 }} animationDuration={800} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function DashboardCharts({ dashboard, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => <ChartSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LanguagePieChart data={dashboard?.github} />
        <DifficultyBarChart data={dashboard?.leetcode} />
        <WeeklyActivityChart data={dashboard} />
        <WeeklyProgressChart data={dashboard} />
      </div>
    </FadeIn>
  );
}

export default React.memo(DashboardCharts);
