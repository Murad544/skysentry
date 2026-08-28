import React from 'react';
import { Cpu, Brain, Camera, Wifi, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const SYSTEM_COMPONENTS = [
  {
    id: 'sys-processor',
    label: 'Processing Unit',
    icon: Cpu,
    status: 'ONLINE' as const,
    value: '34%',
    subtext: 'CPU load — nominal',
    detail: 'Intel Xeon W-2245 @ 3.9GHz',
  },
  {
    id: 'sys-model',
    label: 'Detection Model',
    icon: Brain,
    status: 'ONLINE' as const,
    value: '94.2%',
    subtext: 'Avg classification confidence',
    detail: 'AcoustiNet v3.7 — up to date',
  },
  {
    id: 'sys-camera',
    label: 'PTZ Camera',
    icon: Camera,
    status: 'ONLINE' as const,
    value: 'CAM-01',
    subtext: 'Tracking drone-001',
    detail: 'Sony SNC-VB770 — 4K active',
  },
  {
    id: 'sys-network',
    label: 'Network Link',
    icon: Wifi,
    status: 'DEGRADED' as const,
    value: '82ms',
    subtext: 'Latency — slightly elevated',
    detail: '4G LTE failover active',
  },
];

const STATUS_ICONS = {
  ONLINE: CheckCircle,
  DEGRADED: AlertTriangle,
  OFFLINE: XCircle,
};

const STATUS_COLORS = {
  ONLINE: 'text-low',
  DEGRADED: 'text-medium',
  OFFLINE: 'text-critical',
};

const CARD_STYLES = {
  ONLINE: 'stat-card-success',
  DEGRADED: 'stat-card-warning',
  OFFLINE: 'stat-card-critical',
};

export default function SystemHealthCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {SYSTEM_COMPONENTS.map((comp) => {
        const Icon = comp.icon;
        const StatusIcon = STATUS_ICONS[comp.status];
        return (
          <div key={comp.id} className={`${CARD_STYLES[comp.status]} rounded-xl p-4 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Icon size={16} className="text-muted-foreground" />
                </div>
                <span className="text-[12px] font-semibold text-foreground">{comp.label}</span>
              </div>
              <StatusIcon size={14} className={STATUS_COLORS[comp.status]} />
            </div>
            <div>
              <p className="text-[22px] font-bold font-tabular text-foreground leading-none">{comp.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{comp.subtext}</p>
            </div>
            <p className="text-[10px] text-muted-foreground/70 font-mono">{comp.detail}</p>
          </div>
        );
      })}
    </div>
  );
}