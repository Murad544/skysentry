'use client';

import React from 'react';
import type { DetectionEvent } from '@/lib/mockData';
import ThreatBadge from '@/components/ui/ThreatBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { ChevronDown, ChevronRight, Eye, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DetectionLogRowProps {
  event: DetectionEvent;
  index: number;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onExpand: () => void;
  formatTimestamp: (iso: string) => string;
  formatDuration: (s: number) => string;
}

export default function DetectionLogRow({
  event,
  index,
  selected,
  expanded,
  onSelect,
  onExpand,
  formatTimestamp,
  formatDuration,
}: DetectionLogRowProps) {
  return (
    <>
      <tr
        className={`border-b border-border/50 transition-colors duration-100 cursor-pointer
          ${selected ? 'bg-primary/5' : index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'}
          hover:bg-muted/30
        `}
      >
        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="rounded border-border accent-primary"
            aria-label={`Select event ${event.id}`}
          />
        </td>

        {/* Event ID */}
        <td className="px-3 py-3" onClick={onExpand}>
          <div className="flex items-center gap-1.5">
            {expanded ? <ChevronDown size={12} className="text-primary shrink-0" /> : <ChevronRight size={12} className="text-muted-foreground shrink-0" />}
            <span className="text-[12px] font-mono text-primary">{event.id}</span>
          </div>
        </td>

        {/* Timestamp */}
        <td className="px-3 py-3" onClick={onExpand}>
          <span className="text-[12px] font-mono text-muted-foreground font-tabular">
            {formatTimestamp(event.timestamp)}
          </span>
        </td>

        {/* Drone Type */}
        <td className="px-3 py-3" onClick={onExpand}>
          <div>
            <p className="text-[13px] text-foreground font-medium">{event.droneType}</p>
            <p className="text-[11px] text-muted-foreground">{event.manufacturer}</p>
          </div>
        </td>

        {/* Threat */}
        <td className="px-3 py-3" onClick={onExpand}>
          <ThreatBadge level={event.threatLevel} size="sm" />
        </td>

        {/* Zone */}
        <td className="px-3 py-3" onClick={onExpand}>
          <span className="text-[12px] text-foreground">{event.zone}</span>
        </td>

        {/* Confidence */}
        <td className="px-3 py-3" onClick={onExpand}>
          <div className="flex items-center gap-2">
            <div className="w-12 bg-muted rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${event.confidence}%` }}
              />
            </div>
            <span className="text-[12px] font-tabular text-foreground">{event.confidence}%</span>
          </div>
        </td>

        {/* Sensors */}
        <td className="px-3 py-3" onClick={onExpand}>
          <div className="flex flex-wrap gap-0.5">
            {event.sensorsTriggered.map((s) => (
              <span key={`sensor-${event.id}-${s}`} className="text-[10px] font-mono px-1 py-0.5 bg-muted rounded text-muted-foreground">
                M{s}
              </span>
            ))}
          </div>
        </td>

        {/* Duration */}
        <td className="px-3 py-3" onClick={onExpand}>
          <span className="text-[12px] font-mono font-tabular text-foreground">
            {formatDuration(event.duration)}
          </span>
        </td>

        {/* Status */}
        <td className="px-3 py-3" onClick={onExpand}>
          <StatusBadge status={event.status} />
        </td>

        {/* Action Taken */}
        <td className="px-3 py-3 max-w-[180px]" onClick={onExpand}>
          <p className="text-[12px] text-muted-foreground truncate" title={event.actionTaken}>
            {event.actionTaken}
          </p>
        </td>

        {/* Row actions */}
        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => toast.success(`Viewing event ${event.id}`)}
              className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150"
              title={`View event ${event.id}`}
              aria-label={`View details for ${event.id}`}
            >
              <Eye size={13} />
            </button>
            {event.status !== 'CLEARED' && (
              <button
                onClick={() => toast.success(`Event ${event.id} marked as cleared`)}
                className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-low hover:bg-low/10 transition-all duration-150"
                title={`Mark ${event.id} as cleared`}
                aria-label={`Mark ${event.id} as cleared`}
              >
                <CheckCircle size={13} />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr key={`${event.id}-expanded`} className="bg-muted/20 border-b border-border/50">
          <td colSpan={12} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
              {[
                { label: 'Bearing', value: `${event.bearing}°` },
                { label: 'Distance', value: `${event.distance}m` },
                { label: 'Signal Strength', value: `${event.signalStrength} dBFS` },
                { label: 'Manufacturer', value: event.manufacturer },
              ].map((item) => (
                <div key={`exp-${event.id}-${item.label}`}>
                  <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-foreground font-semibold font-tabular">{item.value}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}