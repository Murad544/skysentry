'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_DETECTION_EVENTS } from '@/lib/mockData';
import type { DetectionEvent, ThreatLevel, DroneStatus } from '@/lib/mockData';


import DetectionLogFilters from './DetectionLogFilters';
import DetectionLogRow from './DetectionLogRow';
import DetectionLogPagination from './DetectionLogPagination';
import {
  Download,
  CheckSquare,
  Trash2,
  ChevronUp,
  ChevronDown,
  ScrollText,
} from 'lucide-react';
import { toast } from 'sonner';

export type SortKey = keyof DetectionEvent;
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  search: string;
  threatLevels: ThreatLevel[];
  statuses: DroneStatus[];
  zone: string;
}

const COLUMNS: { key: SortKey; label: string; width?: string }[] = [
  { key: 'id', label: 'Event ID', width: '140px' },
  { key: 'timestamp', label: 'Timestamp', width: '160px' },
  { key: 'droneType', label: 'Drone Type', width: '160px' },
  { key: 'threatLevel', label: 'Threat', width: '100px' },
  { key: 'zone', label: 'Zone', width: '130px' },
  { key: 'confidence', label: 'Confidence', width: '100px' },
  { key: 'sensorsTriggered', label: 'Sensors', width: '80px' },
  { key: 'duration', label: 'Duration', width: '90px' },
  { key: 'status', label: 'Status', width: '100px' },
  { key: 'actionTaken', label: 'Action Taken', width: '180px' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function formatDuration(secs: number): string {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  const time = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

export default function DetectionLogContent() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    threatLevels: [],
    statuses: [],
    zone: '',
  });
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = [...MOCK_DETECTION_EVENTS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.droneType.toLowerCase().includes(q) ||
          e.zone.toLowerCase().includes(q) ||
          e.manufacturer.toLowerCase().includes(q)
      );
    }
    if (filters.threatLevels.length > 0) {
      data = data.filter((e) => filters.threatLevels.includes(e.threatLevel));
    }
    if (filters.statuses.length > 0) {
      data = data.filter((e) => filters.statuses.includes(e.status));
    }
    if (filters.zone) {
      data = data.filter((e) => e.zone === filters.zone);
    }
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      if (Array.isArray(av) && Array.isArray(bv)) {
        return sortDir === 'asc' ? av.length - bv.length : bv.length - av.length;
      }
      const as = String(av);
      const bs = String(bv);
      return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return data;
  }, [filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map((e) => e.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkResolve = () => {
    toast.success(`${selectedIds.size} event${selectedIds.size > 1 ? 's' : ''} marked as cleared`);
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    toast.success('Detection log exported as CSV');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ScrollText size={16} className="text-primary" />
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">Detection Log</h1>
          <span className="text-[11px] text-muted-foreground font-mono">
            {filtered.length} events
          </span>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-all duration-150 active:scale-95"
        >
          <Download size={13} />
          Export CSV
        </button>
      </header>

      <div className="flex-1 p-6 max-w-screen-2xl w-full mx-auto space-y-4">
        {/* Filters */}
        <DetectionLogFilters
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(1); }}
        />

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg animate-fade-in">
            <span className="text-[13px] font-semibold text-primary">
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleBulkResolve}
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-md bg-low/15 text-low border border-low/30 hover:bg-low/25 transition-all duration-150 active:scale-95"
            >
              <CheckSquare size={13} />
              Mark Cleared
            </button>
            <button
              onClick={() => {
                toast.error(`${selectedIds.size} event${selectedIds.size > 1 ? 's' : ''} deleted`);
                setSelectedIds(new Set());
              }}
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-md bg-critical/15 text-critical border border-critical/30 hover:bg-critical/25 transition-all duration-150 active:scale-95"
            >
              <Trash2 size={13} />
              Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Table */}
        <div className="card-elevated rounded-xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-dark">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="w-10 px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paged.length && paged.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-border accent-primary"
                      aria-label="Select all rows"
                    />
                  </th>
                  {COLUMNS.map((col) => (
                    <th
                      key={`col-${col.key}`}
                      className="px-3 py-3 text-left cursor-pointer select-none group"
                      style={{ minWidth: col.width }}
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                          {col.label}
                        </span>
                        <span className="text-muted-foreground/50">
                          {sortKey === col.key ? (
                            sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />
                          ) : (
                            <ChevronDown size={12} className="opacity-0 group-hover:opacity-50" />
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-right w-20">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length + 2} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <ScrollText size={32} className="text-muted-foreground/30" />
                        <p className="text-[14px] font-semibold text-muted-foreground">No detection events found</p>
                        <p className="text-[12px] text-muted-foreground/60">
                          Adjust your filters to see events, or wait for the system to detect drone activity.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paged.map((event, i) => (
                    <DetectionLogRow
                      key={event.id}
                      event={event}
                      index={i}
                      selected={selectedIds.has(event.id)}
                      expanded={expandedId === event.id}
                      onSelect={() => handleSelectRow(event.id)}
                      onExpand={() => setExpandedId(expandedId === event.id ? null : event.id)}
                      formatTimestamp={formatTimestamp}
                      formatDuration={formatDuration}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <DetectionLogPagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            total={filtered.length}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}