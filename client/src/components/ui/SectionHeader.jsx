export default function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
