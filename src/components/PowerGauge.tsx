
import React from 'react';

interface PowerGaugeProps {
  currentPower: number;
  maxPower: number;
  size?: number;
}

const PowerGauge: React.FC<PowerGaugeProps> = ({ 
  currentPower, 
  maxPower, 
  size = 200 
}) => {
  const percentage = (currentPower / maxPower) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/20"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-primary">
            {currentPower.toFixed(0)}
          </span>
          <span className="text-sm text-muted-foreground">kW</span>
          <span className="text-xs text-muted-foreground">
            de {maxPower}kW
          </span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium">Potência Instantânea</div>
        <div className="text-xs text-muted-foreground">
          {percentage.toFixed(1)}% da capacidade
        </div>
      </div>
    </div>
  );
};

export default PowerGauge;
