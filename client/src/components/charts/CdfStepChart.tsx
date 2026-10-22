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
  const chartData = distribution.map((item) => ({
    xLabel: `${item.x} hh`,
    x: item.x,
    cdf: item.fx,
    percentage: `${(item.fx * 100).toFixed(1)}%`,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-stone-400 text-xs">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2 text-stone-300">
          📈
        </div>
        No CDF step distribution data available.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 25, right: 20, left: -10, bottom: 20 }}>
          <defs>
            <linearGradient id="cdfStepGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1AA373" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#CFE0D4" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 6" stroke="#E7E7E1" vertical={false} />
          <XAxis
            dataKey="xLabel"
            tick={{ fontSize: 11, fill: '#7C9C86', fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#CFE0D4' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#7C9C86', fontFamily: 'JetBrains Mono' }}
            domain={[0, 1.05]}
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: '#1AA373', strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="surface-glass p-3.5 rounded-2xl shadow-float border border-emerald-900/10 text-xs backdrop-blur-xl">
                    <p className="font-bold text-stone-900 mb-1">
                      Cumulative Threshold (X ≤ {item.x} households)
                    </p>
                    <div className="space-y-1 font-mono text-[11px]">
                      <p className="text-emerald-700 font-bold">
                        F({item.x}) = P(X ≤ {item.x}) = {item.percentage}
                      </p>
                      <p className="text-stone-500">
                        Reliability: {((1 - item.cdf) * 100).toFixed(1)}% tail risk of overflow
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            y={0.80}
            stroke="#C9A24B"
            strokeDasharray="4 4"
            label={{
              value: '80% Civil Service Target',
              fill: '#C9A24B',
              fontSize: 10,
              fontFamily: 'JetBrains Mono',
              position: 'right',
            }}
          />
          {thresholdX !== undefined && (
            <ReferenceLine
              x={`${thresholdX} hh`}
              stroke="#3B82C4"
              strokeDasharray="4 4"
              label={{
                value: `Capacity: ${thresholdX} hh`,
                fill: '#3B82C4',
                fontSize: 10,
                fontFamily: 'JetBrains Mono',
                position: 'top',
              }}
            />
          )}
          <Area
            type="stepAfter"
            dataKey="cdf"
            name="F(x) = P(X ≤ x)"
            stroke="#12805A"
            strokeWidth={2.5}
            fill="url(#cdfStepGrad)"
            activeDot={{ r: 5, stroke: '#072A1D', strokeWidth: 2, fill: '#3CC391' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
