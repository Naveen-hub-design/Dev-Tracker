import { useState, useEffect, useRef } from 'react';

export default function AnimatedNumber({ value, duration = 1000, className = '' }) {
  const num = typeof value === 'number' ? value : parseInt(value, 10) || 0;
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  const from = useRef(0);
  const t0 = useRef(null);

  useEffect(() => {
    from.current = display;
    t0.current = performance.now();
    const animate = (now) => {
      const p = Math.min((now - t0.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from.current + (num - from.current) * eased));
      if (p < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [num, duration]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
