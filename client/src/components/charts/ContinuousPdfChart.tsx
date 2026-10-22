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

interface Props {
  points: Array<{ x: number; density: number; cumulative: number }>;
  mean: number;
  unit?: string;
  intervalMin?: number;
  intervalMax?: number;
}

export const ContinuousPdfChart: React.FC<Props> = ({
  points,
  mean,
  unit = 'Units',
  intervalMin,
  intervalMax,
}) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(val) => `${val}`}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(val) => val.toFixed(3)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800">Deficit x = {item.x} {unit}</p>
                    <p className="text-forest-700 font-medium">Density f(x): {item.density}</p>
                    <p className="text-slate-500 font-medium">Cumulative F(x): {(item.cumulative * 100).toFixed(1)}%</p>
                    <p className="text-[10px] text-amber-700 mt-1 italic">
                      Density is height f(x), not probability P(X = x).
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            x={mean}
            stroke="#1b4332"
            strokeDasharray="4 4"
            label={{ value: `μ = ${mean}`, fill: '#1b4332', fontSize: 11, position: 'top' }}
          />
          {intervalMin !== undefined && (
            <ReferenceLine x={intervalMin} stroke="#d97706" strokeDasharray="3 3" />
          )}
          {intervalMax !== undefined && (
            <ReferenceLine x={intervalMax} stroke="#d97706" strokeDasharray="3 3" />
          )}
          <Area
            type="monotone"
            dataKey="density"
            name="Density f(x)"
            stroke="#2d6a4f"
            fill="#d8f3dc"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
