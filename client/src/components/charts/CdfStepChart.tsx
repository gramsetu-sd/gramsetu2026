import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { DiscreteDistributionItem } from '../../types';

interface Props {
  distribution: DiscreteDistributionItem[];
  thresholdX?: number;
}

export const CdfStepChart: React.FC<Props> = ({ distribution, thresholdX }) => {
  // Format step data for CDF
  const chartData = distribution.map((item) => ({
    xLabel: `${item.x} hh`,
    x: item.x,
    cdf: item.fx,
    percentage: `${(item.fx * 100).toFixed(1)}%`,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No CDF distribution data available.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="xLabel" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            domain={[0, 1.05]}
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 mb-1">
                      Threshold X ≤ {item.x} households
                    </p>
                    <p className="text-teal-700 font-semibold">
                      Cumulative Probability F({item.x}) = P(X ≤ {item.x}): {item.percentage}
                    </p>
                    <p className="text-slate-500 mt-1">
                      Probability that emergency demand does not exceed {item.x} households
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={0.80} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: '80% Service Level', fill: '#64748b', fontSize: 10, position: 'right' }} />
          {thresholdX !== undefined && (
            <ReferenceLine
              x={`${thresholdX} hh`}
              stroke="#0284c7"
              strokeDasharray="4 4"
              label={{ value: `Threshold ≤ ${thresholdX}`, fill: '#0284c7', fontSize: 10, position: 'top' }}
            />
          )}
          <Area
            type="stepAfter"
            dataKey="cdf"
            name="F(x) = P(X ≤ x)"
            stroke="#0f766e"
            fill="#ccfbf1"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
