const colorMap = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/10',
  slate: 'bg-slate-100 text-slate-600 ring-slate-500/10',
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
