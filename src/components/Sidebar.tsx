'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  Radio,
  ScrollText,
  Activity,
  ChevronLeft,
  ChevronRight,
  Bell,
  Shield,
  Wifi,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const NAV_ITEMS = [
  {
    key: 'nav-radar',
    href: '/',
    label: 'Radar Dashboard',
    icon: Radio,
    badge: 2,
    badgeType: 'critical' as const,
  },
  {
    key: 'nav-log',
    href: '/detection-log',
    label: 'Detection Log',
    icon: ScrollText,
    badge: 12,
    badgeType: 'neutral' as const,
  },
  {
    key: 'nav-status',
    href: '/system-status',
    label: 'System Status',
    icon: Activity,
    badge: 1,
    badgeType: 'warning' as const,
  },
];

const BADGE_STYLES = {
  critical: 'bg-critical text-white',
  warning: 'bg-medium text-background',
  neutral: 'bg-muted text-muted-foreground',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-full bg-card border-r border-border relative"
      style={{
        width: collapsed ? '64px' : '240px',
        transition: 'width 300ms ease',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border overflow-hidden">
        <AppLogo size={32} className="shrink-0" />
        {!collapsed && (
          <span className="ml-2 font-semibold text-[15px] tracking-tight text-foreground whitespace-nowrap overflow-hidden">
            SkySentry
          </span>
        )}
      </div>

      {/* System status pill */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-md bg-muted border border-border flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
            System Active
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <p className={`text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2 ${collapsed ? 'opacity-0' : 'opacity-100'}`} style={{ transition: 'opacity 200ms ease' }}>
          Operations
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                group flex items-center gap-3 px-2 py-2.5 rounded-lg text-[14px] font-medium
                transition-all duration-150 relative
                ${isActive
                  ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <Icon
                size={18}
                className={`shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
              />
              {!collapsed && (
                <span className="flex-1 whitespace-nowrap overflow-hidden">{item.label}</span>
              )}
              {!collapsed && item.badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_STYLES[item.badgeType]}`}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge > 0 && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${item.badgeType === 'critical' ? 'bg-critical' : item.badgeType === 'warning' ? 'bg-medium' : 'bg-muted-foreground'}`} />
              )}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className={`text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2 ${collapsed ? 'opacity-0' : 'opacity-100'}`} style={{ transition: 'opacity 200ms ease' }}>
            System
          </p>
          <Link
            href="/system-status"
            title={collapsed ? 'Alerts' : undefined}
            className="group flex items-center gap-3 px-2 py-2.5 rounded-lg text-[14px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
          >
            <Bell size={18} className="shrink-0 text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span>Alerts</span>}
            {!collapsed && (
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-critical text-white">4</span>
            )}
          </Link>
          <Link
            href="/system-status"
            title={collapsed ? 'Sensors' : undefined}
            className="group flex items-center gap-3 px-2 py-2.5 rounded-lg text-[14px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
          >
            <Wifi size={18} className="shrink-0 text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span>Sensors</span>}
            {!collapsed && (
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-medium text-background">1</span>
            )}
          </Link>
        </div>
      </nav>

      {/* User + collapse */}
      <div className="border-t border-border p-3 space-y-2">
        <div className={`flex items-center gap-2 px-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
            <Shield size={13} className="text-primary" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[12px] font-semibold text-foreground leading-tight">Operator-1</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Site Alpha</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}