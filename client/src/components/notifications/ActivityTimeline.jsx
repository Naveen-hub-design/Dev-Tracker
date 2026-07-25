import { motion } from 'framer-motion';
import { Github, Code2, Trophy, FolderKanban, Clock } from 'lucide-react';

const TYPE_CONFIG = {
  github: { icon: Github, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', ring: 'ring-slate-200 dark:ring-slate-700' },
  leetcode: { icon: Code2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', ring: 'ring-amber-200 dark:ring-amber-800' },
  project: { icon: FolderKanban, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', ring: 'ring-blue-200 dark:ring-blue-800' },
  achievement: { icon: Trophy, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', ring: 'ring-purple-200 dark:ring-purple-800' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
          <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No activity yet</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Your recent activities will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

      <div className="space-y-1">
        {activities.map((activity, i) => {
          const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.project;
          const IconComp = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="relative flex items-start gap-3 group py-2.5"
            >
              {/* Dot on timeline */}
              <div className={`absolute -left-6 top-3.5 w-[19px] h-[19px] rounded-full flex items-center justify-center ring-2 ${config.ring} ${config.bg} z-10`}>
                <IconComp className={`w-2.5 h-2.5 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 rounded-xl px-3 py-2 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {activity.title}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                    {timeAgo(activity.timestamp)}
                  </span>
                </div>
                {activity.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
