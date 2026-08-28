'use client';

import React, { useState } from 'react';
import { Camera, ZoomIn, ZoomOut, RotateCcw, Crosshair, Maximize2 } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';



export default function CameraFeedPanel() {
  const [tracking, setTracking] = useState(true);

  return (
    <div className="card-elevated rounded-xl flex flex-col flex-1">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-primary" />
          <span className="text-[13px] font-semibold text-foreground">Camera Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${tracking ? 'bg-critical' : 'bg-muted-foreground'}`} />
          <span className="text-[10px] font-mono text-muted-foreground">
            {tracking ? 'TRACKING: drone-001' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Feed placeholder */}
      <div className="relative flex-1 bg-radar-bg flex items-center justify-center" style={{ minHeight: '160px' }}>
        {/* Scan lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,170,0.02) 2px, rgba(0,212,170,0.02) 4px)',
          }}
        />
        {/* Corner brackets */}
        {[
          'top-2 left-2 border-t-2 border-l-2',
          'top-2 right-2 border-t-2 border-r-2',
          'bottom-2 left-2 border-b-2 border-l-2',
          'bottom-2 right-2 border-b-2 border-r-2',
        ]?.map((cls, i) => (
          <div key={`corner-${i}`} className={`absolute w-4 h-4 border-primary/60 ${cls}`} />
        ))}
        {/* Crosshair */}
        {tracking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Crosshair size={32} className="text-critical/70" />
          </div>
        )}
        {/* Status overlay */}
        <div className="flex flex-col items-center gap-2 z-10">
          <Camera size={28} className="text-muted-foreground/30" />
          <p className="text-[11px] text-muted-foreground/60 font-mono">
            {tracking ? 'LIVE FEED — CAM-01' : 'NO SIGNAL'}
          </p>
          {tracking && (
            <p className="text-[10px] text-primary/60 font-mono">
              TARGET LOCKED
            </p>
          )}
        </div>
        {/* Recording indicator */}
        {tracking && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-critical" />
            <span className="text-[10px] font-mono text-critical">REC</span>
          </div>
        )}
        {/* Bearing overlay */}
        <div className="absolute bottom-3 left-3 font-mono text-[10px] text-primary/60">
          BRG 312° | DST 87m
        </div>
      </div>

      {/* PTZ Controls */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-border">
        <div className="flex items-center gap-1">
          {[
            { icon: ZoomIn, label: 'Zoom in' },
            { icon: ZoomOut, label: 'Zoom out' },
            { icon: RotateCcw, label: 'Reset camera' },
            { icon: Maximize2, label: 'Fullscreen' },
          ]?.map(({ icon: Icon, label }, i) => (
            <button
              key={`ptz-${i}`}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95"
              title={label}
              aria-label={label}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
        <button
          onClick={() => setTracking(!tracking)}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded transition-all duration-150 active:scale-95 ${
            tracking
              ? 'bg-critical/15 text-critical border border-critical/30 hover:bg-critical/25' :'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25'
          }`}
        >
          <Crosshair size={11} />
          {tracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>
    </div>
  );
}