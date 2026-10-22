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
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No PMF discrete data available.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="xLabel" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            domain={[0, 'auto']}
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 mb-1">
                      Requirement X = {item.x} households
                    </p>
                    <p className="text-forest-700 font-semibold">
                      Probability P(X = {item.x}): {item.percentage} ({item.probability})
                    </p>
                    <p className="text-slate-500 mt-1">
                      Observed in {item.count} sampling cycles
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          {expectedValueMean !== undefined && (
            <ReferenceLine
              x={`${Math.round(expectedValueMean)} hh`}
              stroke="#dc2626"
              strokeDasharray="4 4"
              label={{
                value: `E(X) ≈ ${expectedValueMean}`,
                fill: '#dc2626',
                fontSize: 11,
                position: 'top',
              }}
            />
          )}
          <Bar dataKey="probability" name="P(X = x)" fill="#1b4332" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
