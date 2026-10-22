import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: Array<{ name: string; value: number }>;
}

const COLORS = [
  '#0B3D2A', // emerald-ink-800
  '#1AA373', // emerald-500
  '#3CC391', // emerald-400
  '#C9A24B', // gold
  '#F5B83D', // amber-400
  '#3B82C4', // sky
  '#7C9C86', // sage-500
];

export const CategoryDonutChart: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-stone-400 text-xs">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2 text-stone-300">
          🥧
        </div>
        No category allocation data available.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="46%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="#FFFFFF"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                return (
                  <div className="surface-glass p-3 rounded-2xl shadow-float border border-emerald-900/10 text-xs backdrop-blur-xl">
                    <p className="font-bold text-stone-900 mb-1">{item.name}</p>
                    <p className="text-emerald-700 font-mono text-[11px] font-bold">
                      Resources Tracked: {item.value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={40}
            formatter={(value) => <span className="text-xs text-stone-600 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
