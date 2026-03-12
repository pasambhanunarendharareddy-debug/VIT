import React from 'react';
import { SeverityLevel } from '../types';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
}

const config: Record<SeverityLevel, { label: string; color: string; bg: string; border: string }> = {
  CRITICAL: { label: '🔴 CRITICAL', color: '#FF3366', bg: 'rgba(255,51,102,0.1)', border: 'rgba(255,51,102,0.35)' },
  HIGH:     { label: '🟠 HIGH',     color: '#FF8C00', bg: 'rgba(255,140,0,0.1)',  border: 'rgba(255,140,0,0.35)' },
  MEDIUM:   { label: '🟡 MEDIUM',   color: '#FFD700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.35)' },
  LOW:      { label: '🔵 LOW',      color: '#00D4FF', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.35)' },
  INFO:     { label: '⚪ INFO',     color: '#8BA0CC', bg: 'rgba(139,160,204,0.1)', border: 'rgba(139,160,204,0.3)' },
};

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'sm' }) => {
  const c = config[severity] || config.INFO;
  return (
    <span style={{
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: '20px', display: 'inline-block', fontWeight: 700,
      letterSpacing: '0.06em', fontFamily: "'Inter', sans-serif",
      padding: size === 'sm' ? '2px 10px' : '4px 14px',
      fontSize: size === 'sm' ? '10px' : '12px',
    }}>
      {c.label}
    </span>
  );
};

export default SeverityBadge;
