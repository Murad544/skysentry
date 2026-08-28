'use client';

import React, { useState } from 'react';
import StatCards from './StatCards';
import RadarDisplay from './RadarDisplay';
import ActiveAlertsPanel from './ActiveAlertsPanel';
import CameraFeedPanel from './CameraFeedPanel';
import SensorSignalStrip from './SensorSignalStrip';
import { MOCK_ALERTS } from '@/lib/mockData';
import type { Alert } from '@/lib/mockData';
import { RefreshCw } from 'lucide-react';

export default function RadarDashboardContent() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a))
    );
  };

  const activeAlerts = alerts.filter((a) => !a.dismissed);

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">
            Radar Dashboard
          </h1>
          <span className="text-[11px] text-muted-foreground font-mono">
            SITE ALPHA — SECTOR 7
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-muted-foreground font-mono font-tabular">
            UTC 06:03:42
          </span>
          <span className="text-[11px] text-muted-foreground">
            Last updated <span className="text-primary">just now</span>
          </span>
          <button className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted">
            <RefreshCw size={13} />
            Refresh
          </button>
          {activeAlerts.length > 0 && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-critical/15 text-critical border border-critical/30">
              <span className="w-1.5 h-1.5 rounded-full bg-critical" />
              {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 p-6 space-y-4 max-w-screen-2xl w-full mx-auto">
        {/* Stat cards */}
        <StatCards />

        {/* Main content: radar + sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_360px] gap-4">
          {/* Radar */}
          <RadarDisplay />

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <ActiveAlertsPanel alerts={activeAlerts} onDismiss={handleDismissAlert} />
            <CameraFeedPanel />
          </div>
        </div>

        {/* Sensor strip */}
        <SensorSignalStrip />
      </div>
    </div>
  );
}