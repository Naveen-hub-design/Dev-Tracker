const variants = {
  default: 'bg-white border border-slate-200 shadow-sm',
  flat: 'bg-slate-50 border border-transparent',
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
