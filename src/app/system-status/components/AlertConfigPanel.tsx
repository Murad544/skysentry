'use client';

import React, { useState } from 'react';
import { Bell, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface AlertConfig {
  criticalAlerts: boolean;
  highAlerts: boolean;
  mediumAlerts: boolean;
  lowAlerts: boolean;
  sensorOfflineAlerts: boolean;
  sensorDegradedAlerts: boolean;
  innerZoneAlerts: boolean;
  soundAlerts: boolean;
  emailNotifications: boolean;
  alertCooldownSeconds: number;
  minConfidenceThreshold: number;
}

const DEFAULT_CONFIG: AlertConfig = {
  criticalAlerts: true,
  highAlerts: true,
  mediumAlerts: true,
  lowAlerts: false,
  sensorOfflineAlerts: true,
  sensorDegradedAlerts: true,
  innerZoneAlerts: true,
  soundAlerts: true,
  emailNotifications: false,
  alertCooldownSeconds: 30,
  minConfidenceThreshold: 65,
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-ring ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function AlertConfigPanel() {
  const [config, setConfig] = useState<AlertConfig>(DEFAULT_CONFIG);
  const [dirty, setDirty] = useState(false);

  const update = <K extends keyof AlertConfig>(key: K, value: AlertConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    // Backend integration point: POST /api/alert-config with config payload
    toast.success('Alert configuration saved');
    setDirty(false);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setDirty(false);
    toast.success('Alert configuration reset to defaults');
  };

  return (
    <div className="card-elevated rounded-xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-accent" />
          <span className="text-[13px] font-semibold text-foreground">Alert Configuration</span>
        </div>
        {dirty && (
          <span className="text-[10px] font-medium text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-dark p-4 space-y-5">
        {/* Threat level alerts */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Threat Level Alerts
          </p>
          <div className="space-y-2.5">
            {(
              [
                { key: 'criticalAlerts', label: 'Critical threats', desc: 'Inner exclusion zone incursions' },
                { key: 'highAlerts', label: 'High threats', desc: 'Unregistered or aggressive flight patterns' },
                { key: 'mediumAlerts', label: 'Medium threats', desc: 'Suspicious activity, middle zone' },
                { key: 'lowAlerts', label: 'Low threats', desc: 'Outer perimeter detections' },
              ] as const
            ).map((item) => (
              <div key={`cfg-${item.key}`} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle
                  checked={config[item.key]}
                  onChange={(v) => update(item.key, v)}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Sensor alerts */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Sensor Alerts
          </p>
          <div className="space-y-2.5">
            {(
              [
                { key: 'sensorOfflineAlerts', label: 'Sensor offline', desc: 'Alert when a microphone goes offline' },
                { key: 'sensorDegradedAlerts', label: 'Sensor degraded', desc: 'Alert when signal quality drops below 60%' },
                { key: 'innerZoneAlerts', label: 'Inner zone breach', desc: 'Priority alert for exclusion zone entry' },
              ] as const
            ).map((item) => (
              <div key={`cfg-${item.key}`} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle
                  checked={config[item.key]}
                  onChange={(v) => update(item.key, v)}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Notification methods */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Notification Methods
          </p>
          <div className="space-y-2.5">
            {(
              [
                { key: 'soundAlerts', label: 'Audio alerts', desc: 'Play sound on new detections' },
                { key: 'emailNotifications', label: 'Email notifications', desc: 'Send email for critical events' },
              ] as const
            ).map((item) => (
              <div key={`cfg-${item.key}`} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle
                  checked={config[item.key]}
                  onChange={(v) => update(item.key, v)}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Thresholds */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Detection Thresholds
          </p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="cooldown" className="text-[12px] font-medium text-foreground">
                  Alert cooldown
                </label>
                <span className="text-[12px] font-tabular font-semibold text-primary">
                  {config.alertCooldownSeconds}s
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">
                Minimum seconds between repeat alerts for the same drone
              </p>
              <input
                id="cooldown"
                type="range"
                min={10}
                max={120}
                step={5}
                value={config.alertCooldownSeconds}
                onChange={(e) => update('alertCooldownSeconds', Number(e.target.value))}
                className="w-full accent-primary h-1.5 rounded-full bg-muted cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">10s</span>
                <span className="text-[10px] text-muted-foreground">120s</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="confidence" className="text-[12px] font-medium text-foreground">
                  Min. confidence threshold
                </label>
                <span className="text-[12px] font-tabular font-semibold text-primary">
                  {config.minConfidenceThreshold}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">
                Suppress alerts below this classification confidence level
              </p>
              <input
                id="confidence"
                type="range"
                min={50}
                max={95}
                step={5}
                value={config.minConfidenceThreshold}
                onChange={(e) => update('minConfidenceThreshold', Number(e.target.value))}
                className="w-full accent-primary h-1.5 rounded-full bg-muted cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">50%</span>
                <span className="text-[10px] text-muted-foreground">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save / reset */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <button
          onClick={handleSave}
          disabled={!dirty}
          className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
        >
          <Save size={13} />
          Save Configuration
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95"
          title="Reset to defaults"
          aria-label="Reset alert configuration to defaults"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}