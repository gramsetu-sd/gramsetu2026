import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title?: string;
  label?: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  subtext?: string;
  icon: LucideIcon | React.ReactNode;
  iconColor?: 'emerald' | 'amber' | 'teal' | 'rose' | 'sky';
  badge?: string | { text: string; variant?: 'success' | 'warning' | 'critical' | 'info' | 'neutral' | string };
  badgeType?: 'success' | 'warning' | 'critical' | 'info' | 'neutral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  label,
  value,
  unit,
  subtitle,
  subtext,
  icon,
  iconColor = 'emerald',
  badge,
  badgeType = 'neutral',
  onClick,
}) => {
  const displayTitle = title || label || '';
  const displaySubtitle = subtitle || subtext;

  const iconBgMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    sky: 'bg-sky-50 text-sky-700 border-sky-200/80',
  };

  const badgeText = typeof badge === 'object' && badge !== null ? badge.text : badge;
  const effectiveBadgeType =
    (typeof badge === 'object' && badge !== null && (badge.variant as any)) || badgeType;

  const badgeClassMap = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    critical: 'bg-rose-50 text-rose-800 border-rose-200/80',
    info: 'bg-sky-50 text-sky-800 border-sky-200/80',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200/80',
  };

  // Render icon safely whether component or React element
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={`surface p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-2xs shrink-0 ${
              iconBgMap[iconColor]
            }`}
          >
            {renderIcon()}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 line-clamp-1">
            {displayTitle}
          </span>
        </div>

        {badgeText && (
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-2xs shrink-0 ${
              badgeClassMap[effectiveBadgeType as keyof typeof badgeClassMap] || badgeClassMap.neutral
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-stone-500 font-mono">
              {unit}
            </span>
          )}
        </div>

        {displaySubtitle && (
          <p className="text-[11px] text-stone-500 leading-tight">
            {displaySubtitle}
          </p>
        )}
      </div>
    </div>
  );
};
