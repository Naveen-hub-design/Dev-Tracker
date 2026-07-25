import { motion } from 'framer-motion';
import {
  Github, Code2, Trophy, Target, Clock, Info, AlertTriangle,
  Check, X
} from 'lucide-react';

const ICON_MAP = {
  Github, Code2, Trophy, Target, Clock, Info, AlertTriangle,
};

export default function NotificationCard({ notification, onRead, onDelete, timeAgo, TYPE_META }) {
  const meta = TYPE_META[notification.type] || TYPE_META.system_message;
  const IconComp = ICON_MAP[meta.icon] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => !notification.read && onRead(notification.id)}
      className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
        notification.read
          ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800'
          : 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/15 border border-blue-100/60 dark:border-blue-800/30'
      }`}
    >
      {!notification.read && (
        <span className="absolute top-3.5 left-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
      )}

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
        <IconComp className={`w-4 h-4 ${meta.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium truncate ${
            notification.read
              ? 'text-slate-500 dark:text-slate-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}>
            {notification.title}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
            {timeAgo(notification.timestamp)}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.description}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
        {!notification.read && (
          <button
            onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Delete"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
