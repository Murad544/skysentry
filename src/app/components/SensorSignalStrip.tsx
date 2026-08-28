import React from 'react';
import { MOCK_SENSORS } from '@/lib/mockData';
import type { SensorStatus } from '@/lib/mockData';

const SIGNAL_BAR_CLASS: Record<SensorStatus, string> = {
  ONLINE: 'signal-bar',
  DEGRADED: 'signal-bar-medium',
  OFFLINE: 'signal-bar-weak',
};

const STATUS_DOT: Record<SensorStatus, string> = {
  ONLINE: 'bg-low',
  DEGRADED: 'bg-medium',
  OFFLINE: 'bg-critical',
};

export default function SensorSignalStrip() {
  return (
    <div className="card-elevated rounded-xl px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-foreground">Microphone Array — Signal Strength</span>
        <span className="text-[11px] text-muted-foreground font-mono">8 sensors / 360° coverage</span>
      </div>
      <div className="grid grid-cols-4 xl:grid-cols-8 gap-3">
        {MOCK_SENSORS.map((sensor) => {
          const barCount = 8;
          const filledBars = Math.round((sensor.signalQuality / 100) * barCount);
          return (
            <div key={sensor.id} className="flex flex-col items-center gap-2">
              <div className="flex items-end gap-0.5 h-10">
                {Array.from({ length: barCount }).map((_, bi) => {
                  const filled = bi < filledBars;
                  const heightPct = ((bi + 1) / barCount) * 100;
                  return (
                    <div
                      key={`bar-${sensor.id}-${bi}`}
                      className={`w-1.5 rounded-sm transition-all ${filled ? SIGNAL_BAR_CLASS[sensor.status] : 'bg-muted'}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[sensor.status]}`} />
                <span className="text-[10px] font-mono text-muted-foreground">{sensor.label}</span>
              </div>
              <span className="text-[11px] font-semibold font-tabular text-foreground">
                {sensor.status === 'OFFLINE' ? '—' : `${sensor.signalQuality}%`}
              </span>
              <span className="text-[9px] text-muted-foreground">{sensor.bearing}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}