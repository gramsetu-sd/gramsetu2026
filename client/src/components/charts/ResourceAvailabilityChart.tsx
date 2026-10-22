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
    available: item.latestObservation?.observedAvailableQuantity || 0,
    demand: item.latestObservation?.estimatedDemand || 0,
    unit: item.resource.unit,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No recorded resource observations to display.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 mb-1">{label}</p>
                    <p className="text-forest-700">Available: {item.available} {item.unit}</p>
                    <p className="text-amber-700">Estimated Demand: {item.demand} {item.unit}</p>
                    <p className="text-slate-500 mt-1 font-medium">
                      Status: {item.available >= item.demand ? 'Surplus / Adequate' : `Deficit (${(item.demand - item.available).toFixed(1)} ${item.unit})`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          <Bar dataKey="available" name="Available Quantity" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
          <Bar dataKey="demand" name="Estimated Demand" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
