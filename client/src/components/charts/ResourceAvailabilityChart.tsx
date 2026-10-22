import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { VillageResourceSummary } from '../../types';

interface Props {
  data: VillageResourceSummary[];
}

export const ResourceAvailabilityChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.resource.name.length > 18 ? item.resource.name.substring(0, 16) + '...' : item.resource.name,
    fullName: item.resource.name,
    available: item.latestObservation?.observedAvailableQuantity || 0,
    demand: item.latestObservation?.estimatedDemand || 0,
    unit: item.resource.unit,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-stone-400 text-xs">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2 text-stone-300">
          📊
        </div>
        No recorded resource observations to display.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
          <defs>
            <linearGradient id="emeraldBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1AA373" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#0B3D2A" stopOpacity={0.85} />
            </linearGradient>
            <linearGradient id="amberBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5B83D" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#D97706" stopOpacity={0.85} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 6" stroke="#E7E7E1" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#7C9C86', fontFamily: 'Inter' }}
            interval={0}
            angle={-15}
            textAnchor="end"
            axisLine={{ stroke: '#CFE0D4' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#7C9C86', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(26, 163, 115, 0.04)' }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const deficit = item.demand - item.available;
                const isAdequate = deficit <= 0;

                return (
                  <div className="surface-glass p-3.5 rounded-2xl shadow-float border border-emerald-900/10 text-xs backdrop-blur-xl">
                    <p className="font-bold text-stone-900 mb-2">{item.fullName || label}</p>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />
                          Available:
                        </span>
                        <span className="font-bold text-stone-900">
                          {item.available} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-amber-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />
                          Est. Demand:
                        </span>
                        <span className="font-bold text-stone-900">
                          {item.demand} {item.unit}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-stone-200/60">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isAdequate
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                            : 'bg-rose-50 text-rose-800 border border-rose-200/50'
                        }`}
                      >
                        {isAdequate
                          ? '✓ Adequate Allocation'
                          : `⚠ Deficit: ${deficit.toFixed(1)} ${item.unit}`}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: 11, paddingBottom: 12, fontFamily: 'Inter' }}
          />
          <Bar
            dataKey="available"
            name="Available Quantity"
            fill="url(#emeraldBarGrad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
          <Bar
            dataKey="demand"
            name="Estimated Demand"
            fill="url(#amberBarGrad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
