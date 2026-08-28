import React from 'react';
import type { DroneStatus, SensorStatus } from '@/lib/mockData';

type StatusValue = DroneStatus | SensorStatus;

const STATUS_CONFIG: Record<StatusValue, { label: string; className: string; dot: string }> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-critical/15 text-critical border border-critical/30',
    dot: 'bg-critical',
  },
  TRACKING: {
    label: 'Tracking',
    className: 'bg-medium/15 text-medium border border-medium/30',
    dot: 'bg-medium',
  },
  CLEARED: {
    label: 'Cleared',
    className: 'bg-low/15 text-low border border-low/30',
    dot: 'bg-low',
  },
  LOST: {
    label: 'Lost',
    className: 'bg-muted-foreground/15 text-muted-foreground border border-muted-foreground/30',
    dot: 'bg-muted-foreground',
  },
  ONLINE: {
    label: 'Online',
    className: 'bg-low/15 text-low border border-low/30',
    dot: 'bg-low',
  },
  DEGRADED: {
    label: 'Degraded',
    className: 'bg-medium/15 text-medium border border-medium/30',
    dot: 'bg-medium',
  },
  OFFLINE: {
    label: 'Offline',
    className: 'bg-critical/15 text-critical border border-critical/30',
    dot: 'bg-critical',
  },
};

interface StatusBadgeProps {
  status: StatusValue;
  showDot?: boolean;
}

export default function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide ${config.className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
}