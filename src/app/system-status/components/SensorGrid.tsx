'use client';

import React from 'react';
import { MOCK_SENSORS } from '@/lib/mockData';
import type { SensorUnit, SensorStatus } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Mic, Battery, Thermometer, Clock, Activity } from 'lucide-react';

const SIGNAL_BAR_CLASS: Record<SensorStatus, string> = {
  ONLINE: 'bg-primary',
  DEGRADED: 'bg-medium',
  OFFLINE: 'bg-critical',
};

interface SensorGridProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function getBatteryColor(pct: number): string {
  if (pct > 50) return 'text-low';
  if (pct > 20) return 'text-medium';
  return 'text-critical';
}

export default function SensorGrid({ selectedId, onSelect }: SensorGridProps) {
  return (
    <div className="card-elevated rounded-xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Mic size={14} className="text-primary" />
          <span className="text-[13px] font-semibold text-foreground">Microphone Status</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="text-low font-medium">{MOCK_SENSORS.filter((s) => s.status === 'ONLINE').length} online</span>
          <span className="text-medium font-medium">{MOCK_SENSORS.filter((s) => s.status === 'DEGRADED').length} degraded</span>
          <span className="text-critical font-medium">{MOCK_SENSORS.filter((s) => s.status === 'OFFLINE').length} offline</span>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 p-4">
        {MOCK_SENSORS.map((sensor) => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
            selected={selectedId === sensor.id}
            onSelect={() => onSelect(selectedId === sensor.id ? null : sensor.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SensorCard({
  sensor,
  selected,
  onSelect,
}: {
  sensor: SensorUnit;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-lg p-3 border transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-ring ${
        selected
          ? 'border-primary/50 bg-primary/5'
          : sensor.status === 'OFFLINE' ?'border-critical/30 bg-critical/5'
          : sensor.status === 'DEGRADED' ?'border-medium/30 bg-medium/5' :'border-border bg-muted/20'
      }`}
      aria-pressed={selected}
      aria-label={`${sensor.label} sensor — ${sensor.status}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Mic size={13} className={sensor.status === 'OFFLINE' ? 'text-critical' : sensor.status === 'DEGRADED' ? 'text-medium' : 'text-primary'} />
          <span className="text-[12px] font-semibold font-mono text-foreground">{sensor.label}</span>
        </div>
        <StatusBadge status={sensor.status} showDot={false} />
      </div>

      {/* Signal quality bars */}
      <div className="flex items-end gap-0.5 h-6 mb-2">
        {Array.from({ length: 10 }).map((_, i) => {
          const filled = i < Math.round((sensor.signalQuality / 100) * 10);
          return (
            <div
              key={`sbar-${sensor.id}-${i}`}
              className={`flex-1 rounded-sm transition-all ${filled ? SIGNAL_BAR_CLASS[sensor.status] : 'bg-muted'}`}
              style={{ height: `${((i + 1) / 10) * 100}%`, opacity: filled ? 1 : 0.3 }}
            />
          );
        })}
      </div>
      <p className="text-[11px] font-tabular font-semibold text-foreground mb-2">
        {sensor.status === 'OFFLINE' ? 'No signal' : `${sensor.signalQuality}% signal quality`}
      </p>

      {/* Stats */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Battery size={10} />
            Battery
          </span>
          <span className={`font-tabular font-semibold ${getBatteryColor(sensor.battery)}`}>
            {sensor.battery}%
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Thermometer size={10} />
            Temp
          </span>
          <span className={`font-tabular font-semibold ${sensor.temperature > 38 ? 'text-critical' : sensor.temperature > 32 ? 'text-medium' : 'text-foreground'}`}>
            {sensor.temperature}°C
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Activity size={10} />
            Detections
          </span>
          <span className="font-tabular font-semibold text-foreground">{sensor.detectionCount}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock size={10} />
            Uptime
          </span>
          <span className="font-mono text-foreground text-[10px]">{sensor.uptime}</span>
        </div>
      </div>

      {/* Bearing */}
      <div className="mt-2 pt-2 border-t border-border/50">
        <span className="text-[10px] font-mono text-muted-foreground">
          BRG {sensor.bearing}° · {sensor.sensitivity} dB
        </span>
      </div>
    </button>
  );
}