import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export default function Drawer({ open, onClose, title, side = 'right', children, className = '' }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const positionClasses = side === 'right' ? 'right-0' : 'left-0';
  const slideClass = side === 'right' ? 'translate-x-0' : 'translate-x-0';

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`
          absolute ${positionClasses} top-0 h-full w-full max-w-md
          bg-white shadow-xl
          transition-transform duration-300 ease-out ${slideClass}
          ${className}
        `.trim()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-65px)]">{children}</div>
      </div>
    </div>
  );
}
