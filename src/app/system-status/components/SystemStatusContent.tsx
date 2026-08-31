'use client';

import React, { useState } from 'react';
import SystemHealthCards from './SystemHealthCards';
import SensorGrid from './SensorGrid';
import PlatformDiagram from './PlatformDiagram';
import DetectionHourlyChart from './DetectionHourlyChart';
import { Activity } from 'lucide-react';

export default function SystemStatusContent() {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-primary" />
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">System Status</h1>
          <span className="text-[11px] text-muted-foreground font-mono">
            SkySentry v2.4.1 — Site Alpha
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground font-mono">Last full scan: 06:03:40 UTC</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-low/10 border border-low/20">
            <span className="w-1.5 h-1.5 rounded-full bg-low animate-blip-pulse" />
            <span className="text-[11px] font-medium text-low">6/8 sensors operational</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-screen-2xl w-full mx-auto space-y-4">
        {/* System health cards */}
        <SystemHealthCards />

        {/* Platform diagram + sensor grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] 2xl:grid-cols-[360px_1fr] gap-4">
          <PlatformDiagram
            selectedId={selectedSensorId}
            onSelect={setSelectedSensorId}
          />
          <SensorGrid
            selectedId={selectedSensorId}
            onSelect={setSelectedSensorId}
          />
        </div>

        {/* Detection hourly chart — full width */}
        <DetectionHourlyChart />
      </div>
    </div>
  );
}