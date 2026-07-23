import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data yet',
  description = 'Get started by connecting your accounts.',
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}
