import React, { useMemo } from 'react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';
import { AlertTriangle, Award, Lightbulb, Target, TrendingUp } from 'lucide-react';

function AIRecommendations({ data, loading }) {
  const recommendations = useMemo(() => {
    if (!data) return [];
    const items = [];

    if (data.problemsSolved) {
      const { easy, medium, hard } = data.problemsSolved;
      if (hard < 20) {
        items.push({
          id: 'hard',
          icon: AlertTriangle,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          title: 'Solve more Hard challenges',
          description: `You've solved ${hard || 0} hard challenges. Aim for 20+ to strengthen algorithm skills.`,
          tags: ['Hard', `${hard || 0} solved`],
        });
      }
    }

    if (data.badges?.length > 0) {
      const earned = data.badges.map((b) => b.name);
      items.push({
        id: 'badges',
        icon: Award,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        title: 'Badge Collection',
        description: `You've earned ${earned.length} badge${earned.length > 1 ? 's' : ''}: ${earned.slice(0, 3).join(', ')}.`,
        tags: earned.slice(0, 3),
      });
    } else {
      items.push({
        id: 'no-badges',
        icon: Award,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        title: 'Earn your first badge',
        description: 'Complete coding challenges to earn HackerRank badges.',
        tags: ['Get started'],
      });
    }

    if (data.languages?.length > 0) {
      const top = data.languages[0];
      items.push({
        id: 'top-lang',
        icon: TrendingUp,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        title: `Strongest: ${top.name}`,
        description: `${top.percentage}% of your challenges are in ${top.name}. Consider diversifying.`,
        tags: [top.name, `${top.percentage}%`],
      });
    }

    if (data.totalSolved < 50) {
      items.push({
        id: 'more-solved',
        icon: Target,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        title: 'Increase challenge count',
        description: `You've solved ${data.totalSolved} challenges. Target 50+ for stronger fundamentals.`,
        tags: [`${data.totalSolved} solved`, 'Target: 50+'],
      });
    }

    if (data.languages?.length < 3) {
      items.push({
        id: 'diversify',
        icon: Lightbulb,
        color: 'text-cyan-500',
        bg: 'bg-cyan-50',
        title: 'Diversify languages',
        description: `You've used ${data.languages?.length || 0} language${(data.languages?.length || 0) > 1 ? 's' : ''}. Try challenges in other languages.`,
        tags: ['Multi-language'],
      });
    }

    return items.slice(0, 4);
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
      <SectionHeader title="Recommendations" subtitle="AI-powered insights" />
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
