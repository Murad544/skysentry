import React from 'react';
import type { ThreatLevel } from '@/lib/mockData';

interface ThreatBadgeProps {
  level: ThreatLevel;
  size?: 'sm' | 'md';
}

const THREAT_CONFIG: Record<ThreatLevel, { label: string; className: string }> = {
  CRITICAL: {
    label: 'CRITICAL',
    className: 'bg-critical/15 text-critical border border-critical/30',
  },
  HIGH: {
    label: 'HIGH',
    className: 'bg-high/15 text-high border border-high/30',
  },
  MEDIUM: {
    label: 'MEDIUM',
    className: 'bg-medium/15 text-medium border border-medium/30',
  },
  LOW: {
    label: 'LOW',
    className: 'bg-low/15 text-low border border-low/30',
  },
};

export default function ThreatBadge({ level, size = 'md' }: ThreatBadgeProps) {
  const config = THREAT_CONFIG[level];
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded tracking-wider
        ${config.className}
        ${size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'}
      `}
    >
      {config.label}
    </span>
  );
}