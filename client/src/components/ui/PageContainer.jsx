export default function PageContainer({ title, subtitle, actions, children, className = '' }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
