const variants = {
  default: 'bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800',
  flat: 'bg-slate-50 border border-transparent dark:bg-slate-800/50 dark:border-transparent',
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
        rounded-xl
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
