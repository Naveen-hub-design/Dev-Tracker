const colorMap = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-400/20',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-400/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-400/20',
  red: 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-400/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/10 dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-400/20',
  slate: 'bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-400/20',
};

export default function StatBadge({ label, value, color = 'blue', dot = false }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset
        ${colorMap[color] || colorMap.blue}
      `.trim()}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      )}
      {label && <span>{label}</span>}
      {value !== undefined && <span className="font-semibold">{value}</span>}
    </span>
  );
}
