'use client';

import React from 'react';
import { AlertTriangle, Radar, CheckCircle, Mic } from 'lucide-react';
import { MOCK_DRONE_BLIPS, MOCK_DETECTION_EVENTS, MOCK_SENSORS } from '@/lib/mockData';

const activeThreats = MOCK_DRONE_BLIPS?.filter(
  (d) => d?.threatLevel === 'CRITICAL' || d?.threatLevel === 'HIGH'
)?.length;

const totalToday = MOCK_DETECTION_EVENTS?.length;

const cleared = MOCK_DETECTION_EVENTS?.filter((e) => e?.status === 'CLEARED')?.length;

const sensorsOnline = MOCK_SENSORS?.filter((s) => s?.status === 'ONLINE')?.length;
const totalSensors = MOCK_SENSORS?.length;

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Active Threats — critical */}
      <div className="stat-card-critical rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-critical/80">
            Active Threats
          </span>
          <div className="w-8 h-8 rounded-md bg-critical/15 flex items-center justify-center">
            <AlertTriangle size={16} className="text-critical" />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-[36px] font-bold text-critical font-tabular leading-none glow-primary">
            {activeThreats}
          </span>
          <span className="text-[12px] text-critical/60 mb-1 font-mono">/ {MOCK_DRONE_BLIPS?.length} tracked</span>
        </div>
        <p className="text-[11px] text-critical/70">
          {activeThreats > 0 ? 'Immediate attention required' : 'No active threats'}
        </p>
      </div>

      {/* Detected Today */}
      <div className="stat-card-warning rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-medium/80">
            Detected Today
          </span>
          <div className="w-8 h-8 rounded-md bg-medium/15 flex items-center justify-center">
            <Radar size={16} className="text-medium" />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-[36px] font-bold text-foreground font-tabular leading-none">
            {totalToday}
          </span>
          <span className="text-[12px] text-muted-foreground mb-1 font-mono">events</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          +3 in last hour
        </p>
      </div>

      {/* Sensors Online */}
      <div className={`rounded-lg p-4 flex flex-col gap-3 ${sensorsOnline < totalSensors ? 'stat-card-warning' : 'stat-card-success'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold uppercase tracking-widest ${sensorsOnline < totalSensors ? 'text-medium/80' : 'text-primary/80'}`}>
            Sensors Online
          </span>
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${sensorsOnline < totalSensors ? 'bg-medium/15' : 'bg-primary/15'}`}>
            <Mic size={16} className={sensorsOnline < totalSensors ? 'text-medium' : 'text-primary'} />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-[36px] font-bold font-tabular leading-none ${sensorsOnline < totalSensors ? 'text-medium' : 'text-primary'}`}>
            {sensorsOnline}
          </span>
          <span className="text-[12px] text-muted-foreground mb-1 font-mono">/ {totalSensors}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all ${sensorsOnline < totalSensors ? 'bg-medium' : 'bg-primary'}`}
            style={{ width: `${(sensorsOnline / totalSensors) * 100}%` }}
          />
        </div>
      </div>

      {/* Cleared */}
      <div className="stat-card-success rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/80">
            Cleared Today
          </span>
          <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center">
            <CheckCircle size={16} className="text-primary" />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-[36px] font-bold text-foreground font-tabular leading-none">
            {cleared}
          </span>
          <span className="text-[12px] text-muted-foreground mb-1 font-mono">resolved</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {Math.round((cleared / totalToday) * 100)}% resolution rate
        </p>
      </div>
    </div>
  );
}