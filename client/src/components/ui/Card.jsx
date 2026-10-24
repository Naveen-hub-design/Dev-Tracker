const variants = {
  default: 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-200',
  flat: 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80',
  glow: 'bg-white dark:bg-slate-900 border border-blue-500/30 shadow-lg shadow-blue-500/10',
  ghost: 'bg-transparent border border-transparent',
};

export default function Card({
  variant = 'default',
  padding = true,
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl
        ${variants[variant]}
        ${padding ? 'p-5' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
