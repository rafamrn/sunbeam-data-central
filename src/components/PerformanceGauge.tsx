
import React from 'react';

interface PerformanceGaugeProps {
  value: number;
  size?: number;
  title?: string;
}

const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({ 
  value, 
  size = 60, 
  title 
}) => {
  const getColor = (val: number) => {
    if (val >= 85) return 'text-green-400';
    if (val >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 50 50"
        >
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-muted/20"
          />
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${getColor(value)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${getColor(value)}`}>
            {Math.round(value)}%
          </span>
        </div>
      </div>
      {title && (
        <span className="text-xs text-muted-foreground text-center">{title}</span>
      )}
    </div>
  );
};

export default PerformanceGauge;
