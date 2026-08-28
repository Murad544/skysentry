'use client';

import React from 'react';
import { MOCK_SENSORS } from '@/lib/mockData';
import type { SensorStatus } from '@/lib/mockData';

const STATUS_COLOR: Record<SensorStatus, string> = {
  ONLINE: '#22c55e',
  DEGRADED: '#f59e0b',
  OFFLINE: '#ef4444',
};

const STATUS_GLOW: Record<SensorStatus, string> = {
  ONLINE: 'rgba(34,197,94,0.5)',
  DEGRADED: 'rgba(245,158,11,0.5)',
  OFFLINE: 'rgba(239,68,68,0.5)',
};

interface PlatformDiagramProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function PlatformDiagram({ selectedId, onSelect }: PlatformDiagramProps) {
  const cx = 150;
  const cy = 150;
  const r = 90;

  return (
    <div className="card-elevated rounded-xl flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-[13px] font-semibold text-foreground">Platform Array Diagram</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">8 microphones — 360° acoustic coverage</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <svg width="300" height="300" viewBox="0 0 300 300" aria-label="Acoustic sensor platform diagram">
          {/* Background rings */}
          <circle cx={cx} cy={cy} r={r + 30} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={r - 30} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* Platform body */}
          <circle cx={cx} cy={cy} r={28} fill="var(--muted)" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={18} fill="var(--card)" stroke="var(--primary)" strokeWidth="1" opacity="0.8" />

          {/* Center label */}
          <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--primary)" fontFamily="monospace" fontWeight="600">
            ARRAY
          </text>

          {/* Direction lines */}
          {MOCK_SENSORS.map((sensor) => {
            const rad = ((sensor.bearing - 90) * Math.PI) / 180;
            const x1 = cx + Math.cos(rad) * 28;
            const y1 = cy + Math.sin(rad) * 28;
            const x2 = cx + Math.cos(rad) * (r - 4);
            const y2 = cy + Math.sin(rad) * (r - 4);
            return (
              <line
                key={`line-${sensor.id}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={STATUS_COLOR[sensor.status]}
                strokeWidth={selectedId === sensor.id ? 2 : 0.8}
                strokeOpacity={selectedId === sensor.id ? 1 : 0.4}
                strokeDasharray={sensor.status === 'OFFLINE' ? '3 2' : undefined}
              />
            );
          })}

          {/* Sensor dots */}
          {MOCK_SENSORS.map((sensor) => {
            const rad = ((sensor.bearing - 90) * Math.PI) / 180;
            const sx = cx + Math.cos(rad) * r;
            const sy = cy + Math.sin(rad) * r;
            const isSelected = selectedId === sensor.id;
            const lx = cx + Math.cos(rad) * (r + 22);
            const ly = cy + Math.sin(rad) * (r + 22);

            return (
              <g
                key={`sensor-dot-${sensor.id}`}
                onClick={() => onSelect(isSelected ? null : sensor.id)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${sensor.label} — ${sensor.status}`}
              >
                {isSelected && (
                  <circle
                    cx={sx} cy={sy} r={12}
                    fill={STATUS_GLOW[sensor.status]}
                    opacity="0.3"
                  />
                )}
                <circle
                  cx={sx} cy={sy} r={7}
                  fill={isSelected ? STATUS_COLOR[sensor.status] : 'var(--card)'}
                  stroke={STATUS_COLOR[sensor.status]}
                  strokeWidth={isSelected ? 2 : 1.5}
                />
                {sensor.status === 'ONLINE' && (
                  <circle cx={sx} cy={sy} r={3} fill={STATUS_COLOR[sensor.status]} opacity="0.8" />
                )}
                <text
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fill={isSelected ? STATUS_COLOR[sensor.status] : 'var(--muted-foreground)'}
                  fontFamily="monospace"
                  fontWeight={isSelected ? '700' : '500'}
                >
                  {sensor.label}
                </text>
              </g>
            );
          })}

          {/* Cardinal labels */}
          {[
            { label: 'N', x: cx, y: cy - r - 38 },
            { label: 'E', x: cx + r + 38, y: cy },
            { label: 'S', x: cx, y: cy + r + 38 },
            { label: 'W', x: cx - r - 38, y: cy },
          ].map((d) => (
            <text
              key={`cardinal-${d.label}`}
              x={d.x} y={d.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="var(--muted-foreground)"
              fontFamily="monospace"
              fontWeight="600"
              opacity="0.5"
            >
              {d.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 px-4 pb-4">
        {(['ONLINE', 'DEGRADED', 'OFFLINE'] as const).map((s) => (
          <div key={`legend-status-${s}`} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} />
            <span className="text-[11px] text-muted-foreground">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}