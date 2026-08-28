'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, BellOff } from 'lucide-react';
import type { Alert, ThreatLevel } from '@/lib/mockData';

interface ActiveAlertsPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const ALERT_STYLES: Record<ThreatLevel, { border: string; icon: string; bg: string }> = {
  CRITICAL: {
    border: 'border-l-critical',
    icon: 'text-critical',
    bg: 'bg-critical/5',
  },
  HIGH: {
    border: 'border-l-high',
    icon: 'text-high',
    bg: 'bg-high/5',
  },
  MEDIUM: {
    border: 'border-l-medium',
    icon: 'text-medium',
    bg: 'bg-medium/5',
  },
  LOW: {
    border: 'border-l-low',
    icon: 'text-low',
    bg: 'bg-low/5',
  },
};

function computeRelativeTime(iso: string, now: number): string {
  const diff = Math.floor((now - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function ActiveAlertsPanel({ alerts, onDismiss }: ActiveAlertsPanelProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-elevated rounded-xl flex flex-col" style={{ maxHeight: '320px' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-accent" />
          <span className="text-[13px] font-semibold text-foreground">Active Alerts</span>
        </div>
        {alerts.length > 0 && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-critical/15 text-critical border border-critical/30">
            {alerts.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-dark">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <BellOff size={24} className="text-muted-foreground/40" />
            <p className="text-[12px] text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {alerts.map((alert) => {
              const style = ALERT_STYLES[alert.type];
              return (
                <div
                  key={alert.id}
                  className={`relative rounded-lg p-3 border-l-2 ${style.border} ${style.bg} border border-border/50`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <AlertTriangle size={13} className={`${style.icon} shrink-0 mt-0.5`} />
                      <div className="min-w-0">
                        <p className="text-[11px] text-foreground leading-relaxed">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold ${style.icon}`}>{alert.type}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {now !== null ? computeRelativeTime(alert.timestamp, now) : ''}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{alert.zone}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted"
                      aria-label="Dismiss alert"
                      title="Dismiss this alert"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}