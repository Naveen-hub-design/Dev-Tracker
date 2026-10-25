import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25 active:scale-[0.98]',
  secondary:
    'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 active:bg-slate-100 shadow-xs dark:bg-[#0f121a] dark:text-slate-200 dark:border-white/10 dark:hover:bg-[#161a26] active:scale-[0.98]',
  ghost:
    'text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-[#161a26] dark:active:bg-[#1b2030] active:scale-[0.98]',
  danger:
    'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-500/20 active:scale-[0.98]',
  outline:
    'border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161a26] active:scale-[0.98]',
  link:
    'text-orange-500 hover:text-orange-600 underline-offset-2 hover:underline p-0 h-auto dark:text-orange-400 dark:hover:text-orange-300',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-xl',
  md: 'h-9 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-6 text-sm gap-2 rounded-2xl',
  icon: 'h-9 w-9 rounded-xl justify-center',
  'icon-sm': 'h-8 w-8 rounded-lg justify-center',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', disabled, loading, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-150 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `.trim()}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
