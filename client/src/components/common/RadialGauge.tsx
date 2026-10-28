import React from 'react';

export interface RadialGaugeProps {
  value: number; // 0 to 1 (e.g. 0.38)
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtext?: string;
  sublabel?: string;
  deltaText?: string;
  deltaType?: 'increase' | 'decrease' | 'neutral';
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  value,
  size = 140,
  strokeWidth = 12,
  label = 'Shortage Risk',
  subtext,
  sublabel,
  deltaText,
  deltaType = 'neutral',
}) => {
  const effectiveSubtext = subtext || sublabel;
  const percentage = Math.round(value * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value * circumference);

  // Determine dynamic ring color based on risk severity
  const color =
    percentage >= 60
      ? '#D6455D' // rose
      : percentage >= 35
      ? '#E39F13' // amber
      : '#1AA373'; // emerald

  const bgColor =
    percentage >= 60
      ? '#FDF2F4'
      : percentage >= 35
      ? '#FEF9EE'
      : '#F0FBF6';

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Subtle track background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#E7E7E1"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value progress indicator with transition */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 2px 6px ${color}40)`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-stone-900">
            {percentage}%
          </span>
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">
              {label}
            </span>
          )}
          {effectiveSubtext && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
              style={{
                backgroundColor: bgColor,
                color: color,
              }}
            >
              {effectiveSubtext}
            </span>
          )}
        </div>
      </div>

      {deltaText && (
        <div className="mt-2 text-[11px] font-mono flex items-center gap-1 text-stone-500">
          <span
            className={
              deltaType === 'increase'
                ? 'text-rose-600 font-semibold'
                : deltaType === 'decrease'
                ? 'text-emerald-600 font-semibold'
                : 'text-stone-500'
            }
          >
            {deltaText}
          </span>
          <span>vs prior</span>
        </div>
      )}
    </div>
  );
};
