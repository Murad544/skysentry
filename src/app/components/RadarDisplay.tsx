'use client';

import React, { useState } from 'react';
import { MOCK_DRONE_BLIPS } from '@/lib/mockData';
import type { DroneBlip, ThreatLevel } from '@/lib/mockData';
import ThreatBadge from '@/components/ui/ThreatBadge';
import { X, Navigation } from 'lucide-react';

const BLIP_CLASSES: Record<ThreatLevel, string> = {
  CRITICAL: 'drone-blip-critical',
  HIGH: 'drone-blip-high',
  MEDIUM: 'drone-blip-medium',
  LOW: 'drone-blip-low',
};

const ZONE_LABELS = [
  { label: 'Inner Exclusion', r: '20%', color: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)' },
  { label: 'Middle Zone', r: '40%', color: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)' },
  { label: 'Outer Perimeter', r: '60%', color: 'rgba(0,212,170,0.04)', border: 'rgba(0,212,170,0.15)' },
];

export default function RadarDisplay() {
  const [selectedDrone, setSelectedDrone] = useState<DroneBlip | null>(null);

  return (
    <div className="card-elevated rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">Live Radar</span>
          <span className="w-2 h-2 rounded-full bg-primary" />
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono">
          <span>RANGE: 400m</span>
          <span>MODE: ACOUSTIC</span>
          <span className="text-primary">SWEEP: 4.0s</span>
        </div>
      </div>

      {/* Radar Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-4" style={{ minHeight: '460px' }}>
        <div className="relative w-full" style={{ maxWidth: '460px', aspectRatio: '1/1' }}>
          {/* Radar background */}
          <div className="absolute inset-0 rounded-full radar-container border border-border overflow-hidden">

            {/* Zone rings */}
            {ZONE_LABELS.map((zone, i) => (
              <div
                key={`zone-ring-${i}`}
                className="absolute rounded-full"
                style={{
                  inset: `${(1 - parseFloat(zone.r) / 100) * 50}%`,
                  border: `1px solid ${zone.border}`,
                  background: zone.color,
                  top: `${(1 - parseFloat(zone.r) / 100) * 50}%`,
                  left: `${(1 - parseFloat(zone.r) / 100) * 50}%`,
                  right: `${(1 - parseFloat(zone.r) / 100) * 50}%`,
                  bottom: `${(1 - parseFloat(zone.r) / 100) * 50}%`,
                }}
              />
            ))}

            {/* Grid crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-border/40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-px bg-border/40" />
            </div>
            {/* Diagonal lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-border/20" style={{ transform: 'rotate(45deg)' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-border/20" style={{ transform: 'rotate(-45deg)' }} />
            </div>

            {/* Rotating sweep */}
            <div
              className="absolute inset-0 rounded-full animate-radar-sweep"
              style={{ transformOrigin: 'center center' }}
            >
              <div className="absolute inset-0 rounded-full radar-sweep" />
              {/* Sweep needle */}
              <div
                className="absolute left-1/2 top-1/2 w-px origin-bottom"
                style={{
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(0,212,170,0.9), rgba(0,212,170,0.1))',
                  transform: 'translateX(-50%)',
                  transformOrigin: 'bottom center',
                }}
              />
            </div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary/80 border-2 border-primary z-10" />
            </div>

            {/* Drone blips */}
            {MOCK_DRONE_BLIPS.map((drone) => (
              <button
                key={drone.id}
                onClick={() => setSelectedDrone(selectedDrone?.id === drone.id ? null : drone)}
                className="absolute z-20 focus:outline-none"
                style={{
                  left: `calc(50% + ${drone.x}%)`,
                  top: `calc(50% + ${drone.y}%)`,
                  transform: 'translate(-50%, -50%)',
                }}
                aria-label={`Drone ${drone.id} — ${drone.threatLevel}`}
              >
                <div
                  className={`w-3 h-3 rounded-full cursor-pointer ${BLIP_CLASSES[drone.threatLevel]}`}
                />
              </button>
            ))}

            {/* Bearing labels */}
            {['N', 'E', 'S', 'W'].map((dir, i) => {
              const positions = [
                { top: '4px', left: '50%', transform: 'translateX(-50%)' },
                { top: '50%', right: '6px', transform: 'translateY(-50%)' },
                { bottom: '4px', left: '50%', transform: 'translateX(-50%)' },
                { top: '50%', left: '6px', transform: 'translateY(-50%)' },
              ];
              return (
                <span
                  key={`bearing-${dir}`}
                  className="absolute text-[10px] font-mono font-bold text-muted-foreground/60 z-10"
                  style={positions[i]}
                >
                  {dir}
                </span>
              );
            })}
          </div>
        </div>

        {/* Selected drone detail popup */}
        {selectedDrone && (
          <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-4 w-64 shadow-xl z-30 animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[13px] font-semibold text-foreground">{selectedDrone.droneType}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{selectedDrone.id.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedDrone(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close drone detail"
              >
                <X size={14} />
              </button>
            </div>
            <ThreatBadge level={selectedDrone.threatLevel} />
            <div className="mt-3 space-y-1.5">
              {[
                { label: 'Zone', value: selectedDrone.zone },
                { label: 'Bearing', value: `${selectedDrone.bearing}°` },
                { label: 'Distance', value: `${selectedDrone.distance}m` },
                { label: 'Confidence', value: `${selectedDrone.confidence}%` },
                { label: 'Status', value: selectedDrone.status },
              ].map((row) => (
                <div key={`detail-${row.label}`} className="flex justify-between text-[12px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-foreground font-medium font-tabular">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-[11px] text-primary">
              <Navigation size={11} />
              <span>Camera tracking active</span>
            </div>
          </div>
        )}
      </div>

      {/* Zone legend */}
      <div className="flex items-center gap-6 px-4 py-3 border-t border-border">
        {ZONE_LABELS.map((zone, i) => (
          <div key={`legend-${i}`} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full border"
              style={{ background: zone.color, borderColor: zone.border }}
            />
            <span className="text-[11px] text-muted-foreground">{zone.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-4">
          {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as ThreatLevel[]).map((level) => (
            <div key={`threat-legend-${level}`} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${BLIP_CLASSES[level]}`} />
              <span className="text-[10px] text-muted-foreground">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}