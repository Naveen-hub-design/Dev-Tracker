import { useEffect, useState } from 'react';

export default function JobMatchRing({ score = 0, size = 200, strokeWidth = 12, loading }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (animatedScore >= 70) return '#10B981';
    if (animatedScore >= 40) return '#F59E0B';
    return '#EF4444';
  };

  if (loading) {
    return (
      <div className="card flex items-center justify-center" style={{ height: size + 40 }}>
        <div className="skeleton rounded-full" style={{ width: size, height: size }} />
      </div>
    );
  }

  return (
    <div className="card flex flex-col items-center">
      <h3 className="section-title self-start">Overall Match</h3>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-4xl font-bold text-slate-900">{animatedScore}%</span>
        <span className="text-xs text-slate-500">Job Match</span>
      </div>
    </div>
  );
}
