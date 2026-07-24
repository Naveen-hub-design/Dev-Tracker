import React, { useMemo } from 'react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';
import { AlertTriangle, Award, Lightbulb, Target } from 'lucide-react';

function AIRecommendations({ data, loading }) {
  const recommendations = useMemo(() => {
    if (!data) return [];
    const items = [];

    if (data.topics?.length > 0) {
      const sorted = [...data.topics].sort((a, b) => a.solved - b.solved);
      const weak = sorted.slice(0, 2);
      const strong = sorted.slice(-2).reverse();

      items.push({
        id: 'weak',
        icon: AlertTriangle,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        title: 'Weak Topics',
        description: `Focus on ${weak.map((t) => t.name).join(' and ')} — only ${weak.map((t) => t.solved).join(' and ')} problems solved.`,
        tags: weak.map((t) => t.name),
      });

      items.push({
        id: 'strong',
        icon: Award,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        title: 'Strong Topics',
        description: `Great work on ${strong.map((t) => t.name).join(' and ')} — ${strong.map((t) => t.solved).join(' and ')} problems solved.`,
        tags: strong.map((t) => t.name),
      });
    }

    const allTopics = ['Arrays', 'Strings', 'DP', 'Trees', 'Graphs', 'Stack', 'Queue', 'Heap', 'Linked List', 'Sorting'];
    const known = new Set((data.topics || []).map((t) => t.name));
    const suggestions = allTopics.filter((t) => !known.has(t)).slice(0, 3);

    if (suggestions.length > 0) {
      items.push({
        id: 'suggestions',
        icon: Lightbulb,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        title: 'Suggested Next Topics',
        description: `Try practicing ${suggestions.join(', ')} to broaden your skills.`,
        tags: suggestions,
      });
    }

    const weeklyAvg = data.weeklyProgress?.length
      ? Math.round(data.weeklyProgress.reduce((a, b) => a + b, 0) / data.weeklyProgress.length)
      : 0;

    items.push({
      id: 'weekly-goal',
      icon: Target,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      title: 'Weekly Goal',
      description: `Average ${weeklyAvg} problems/week. Aim for ${weeklyAvg + 3} next week to improve.`,
      tags: [`${weeklyAvg}/week avg`],
    });

    return items;
  }, [data]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Study Recommendations" subtitle="AI-powered insights" />
      {recommendations.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No recommendations available</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" role="list" aria-label="Recommendations">
          {recommendations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors" tabIndex={0} role="listitem" aria-label={item.title}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default React.memo(AIRecommendations);
