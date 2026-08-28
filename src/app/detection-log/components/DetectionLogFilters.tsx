'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { ThreatLevel, DroneStatus } from '@/lib/mockData';
import type { FilterState } from './DetectionLogContent';

const THREAT_OPTIONS: ThreatLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUS_OPTIONS: DroneStatus[] = ['ACTIVE', 'TRACKING', 'CLEARED', 'LOST'];
const ZONE_OPTIONS = ['', 'Inner Exclusion', 'Middle Zone', 'Outer Perimeter'];

const THREAT_CHIP: Record<ThreatLevel, string> = {
  CRITICAL: 'bg-critical/15 text-critical border-critical/30',
  HIGH: 'bg-high/15 text-high border-high/30',
  MEDIUM: 'bg-medium/15 text-medium border-medium/30',
  LOW: 'bg-low/15 text-low border-low/30',
};

interface DetectionLogFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export default function DetectionLogFilters({ filters, onChange }: DetectionLogFiltersProps) {
  const hasActive =
    filters.search ||
    filters.threatLevels.length > 0 ||
    filters.statuses.length > 0 ||
    filters.zone;

  const toggleThreat = (level: ThreatLevel) => {
    const next = filters.threatLevels.includes(level)
      ? filters.threatLevels.filter((l) => l !== level)
      : [...filters.threatLevels, level];
    onChange({ ...filters, threatLevels: next });
  };

  const toggleStatus = (status: DroneStatus) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses: next });
  };

  const clearAll = () =>
    onChange({ search: '', threatLevels: [], statuses: [], zone: '' });

  return (
    <div className="card-elevated rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search event ID, drone type, manufacturer..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full bg-muted border border-border rounded-lg pl-9 pr-4 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Zone */}
        <select
          value={filters.zone}
          onChange={(e) => onChange({ ...filters, zone: e.target.value })}
          className="bg-muted border border-border rounded-lg px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          aria-label="Filter by zone"
        >
          {ZONE_OPTIONS.map((z) => (
            <option key={`zone-opt-${z || 'all'}`} value={z}>
              {z || 'All Zones'}
            </option>
          ))}
        </select>

        {hasActive && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
          >
            <X size={13} />
            Clear filters
          </button>
        )}
      </div>

      {/* Threat level chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Filter size={11} />
          Threat:
        </span>
        {THREAT_OPTIONS.map((level) => {
          const active = filters.threatLevels.includes(level);
          return (
            <button
              key={`chip-threat-${level}`}
              onClick={() => toggleThreat(level)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 active:scale-95 ${
                active
                  ? THREAT_CHIP[level]
                  : 'bg-muted text-muted-foreground border-border hover:border-muted-foreground'
              }`}
            >
              {level}
            </button>
          );
        })}

        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ml-2">
          Status:
        </span>
        {STATUS_OPTIONS.map((status) => {
          const active = filters.statuses.includes(status);
          return (
            <button
              key={`chip-status-${status}`}
              onClick={() => toggleStatus(status)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 active:scale-95 ${
                active
                  ? 'bg-primary/15 text-primary border-primary/30' :'bg-muted text-muted-foreground border-border hover:border-muted-foreground'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}