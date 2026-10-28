import React from 'react';
import {
  BarChart,
  Bar,
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
  expectedValueMean?: number;
}

export const PmfChart: React.FC<Props> = ({ distribution, expectedValueMean }) => {
  const chartData = distribution.map((item) => ({
    xLabel: `${item.x} hh`,
    x: item.x,
    probability: item.px,
    percentage: `${(item.px * 100).toFixed(1)}%`,
    count: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-stone-400 text-xs">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2 text-stone-300">
          📊
        </div>
        No survey demand data available.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 25, right: 20, left: -10, bottom: 20 }}>
          <defs>
            <linearGradient id="pmfBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3CC391" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#0B3D2A" stopOpacity={0.85} />
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
            domain={[0, 'auto']}
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(26, 163, 115, 0.04)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="surface-glass p-3.5 rounded-2xl shadow-float border border-emerald-900/10 text-xs backdrop-blur-xl">
                    <p className="font-bold text-stone-900 mb-1">
                      Demand: {item.x} households in need
                    </p>
                    <div className="space-y-1 font-mono text-[11px]">
                      <p className="text-emerald-700 font-bold">
                        Likelihood: {item.percentage}
                      </p>
                      <p className="text-stone-500">
                        Observed in {item.count} past survey cycles
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {expectedValueMean !== undefined && (
            <ReferenceLine
              x={`${Math.round(expectedValueMean)} hh`}
              stroke="#D6455D"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Typical: ~${Math.round(expectedValueMean)} hh`,
                fill: '#D6455D',
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
                position: 'top',
              }}
            />
          )}
          <Bar
            dataKey="probability"
            name="Chance of this demand"
            fill="url(#pmfBarGrad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
