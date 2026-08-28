'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MOCK_HOURLY_DETECTIONS } from '@/lib/mockData';
import { BarChart2 } from 'lucide-react';

// Backend integration point: replace MOCK_HOURLY_DETECTIONS with real-time API call

interface TooltipPayload {
  value: number;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="card-elevated rounded-lg px-3 py-2 shadow-xl border border-border">
      <p className="text-[11px] text-muted-foreground font-mono mb-1">{label}</p>
      <p className="text-[13px] font-semibold text-foreground font-tabular">
        {payload[0].value} detection{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default function DetectionHourlyChart() {
  const maxCount = Math.max(...MOCK_HOURLY_DETECTIONS.map((d) => d.count));

  return (
    <div className="card-elevated rounded-xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BarChart2 size={14} className="text-primary" />
          <span className="text-[13px] font-semibold text-foreground">Detections Per Hour</span>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">Last 11 hours</span>
      </div>

      <div className="flex-1 p-4" style={{ minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={MOCK_HOURLY_DETECTIONS}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barSize={18}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="barGradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--critical)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="var(--critical)" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {MOCK_HOURLY_DETECTIONS.map((entry, index) => (
                <Cell
                  key={`cell-hour-${index}`}
                  fill={entry.count >= maxCount ? 'url(#barGradHigh)' : 'url(#barGrad)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 px-4 pb-3 border-t border-border pt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/70" />
          <span className="text-[11px] text-muted-foreground">Normal activity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-critical/70" />
          <span className="text-[11px] text-muted-foreground">Peak hour</span>
        </div>
        <span className="ml-auto text-[11px] text-muted-foreground font-tabular">
          Total: {MOCK_HOURLY_DETECTIONS.reduce((a, b) => a + b.count, 0)} detections
        </span>
      </div>
    </div>
  );
}