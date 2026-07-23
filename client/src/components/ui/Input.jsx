import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full h-9 px-3 text-sm rounded-lg
            bg-white text-slate-900 placeholder-slate-400
            border transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
            ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}
            ${Icon ? 'pl-9' : ''}
            ${className}
          `.trim()}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
});

export default Input;
