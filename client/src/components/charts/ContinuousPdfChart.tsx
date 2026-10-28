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
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 25, right: 20, left: -10, bottom: 20 }}>
          <defs>
            <linearGradient id="pdfCurveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1AA373" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#CFE0D4" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 6" stroke="#E7E7E1" vertical={false} />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11, fill: '#7C9C86', fontFamily: 'JetBrains Mono' }}
            tickFormatter={(val) => `${val}`}
            axisLine={{ stroke: '#CFE0D4' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#7C9C86', fontFamily: 'JetBrains Mono' }}
            tickFormatter={(val) => val.toFixed(3)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: '#12805A', strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="surface-glass p-3.5 rounded-2xl shadow-float border border-emerald-900/10 text-xs backdrop-blur-xl">
                    <p className="font-bold text-stone-900">
                      Shortfall: {item.x} {unit}
                    </p>
                    <div className="space-y-1 font-mono text-[11px] mt-1.5">
                      <p className="text-emerald-700 font-semibold">
                        Coverage up to here: {(item.cumulative * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            x={mean}
            stroke="#0B3D2A"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Typical: ${mean.toFixed(1)} ${unit}`,
              fill: '#0B3D2A',
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
              position: 'top',
            }}
          />
          {intervalMin !== undefined && (
            <ReferenceLine
              x={intervalMin}
              stroke="#D97706"
              strokeDasharray="3 3"
              label={{ value: `From: ${intervalMin}`, fill: '#D97706', fontSize: 10, position: 'insideTopLeft' }}
            />
          )}
          {intervalMax !== undefined && (
            <ReferenceLine
              x={intervalMax}
              stroke="#D97706"
              strokeDasharray="3 3"
              label={{ value: `To: ${intervalMax}`, fill: '#D97706', fontSize: 10, position: 'insideTopRight' }}
            />
          )}
          <Area
            type="monotone"
            dataKey="density"
            name="Shortfall distribution"
            stroke="#12805A"
            strokeWidth={2.5}
            fill="url(#pdfCurveGrad)"
            activeDot={{ r: 5, stroke: '#072A1D', strokeWidth: 2, fill: '#3CC391' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
