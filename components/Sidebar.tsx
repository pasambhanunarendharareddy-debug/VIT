import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onNewScan: () => void;
}

const navItems = [
  { view: 'DASHBOARD' as AppView, icon: '📊', label: 'Dashboard' },
  { view: 'ISSUES' as AppView, icon: '🔍', label: 'Issues' },
  { view: 'CHAT' as AppView, icon: '💬', label: 'AI Security Chat' },
  { view: 'REPORT' as AppView, icon: '📋', label: 'Full Report' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onNewScan }) => (
  <aside style={{
    width: '220px', minHeight: 'calc(100vh - 60px)',
    background: '#0D1526', borderRight: '1px solid #1E2D4A',
    padding: '16px 12px', flexShrink: 0,
    display: 'flex', flexDirection: 'column', gap: '4px',
  }}>
    <p style={{ fontSize: '10px', color: '#4A5C82', letterSpacing: '0.12em', fontWeight: 700, padding: '8px 16px 4px' }}>
      NAVIGATION
    </p>
    {navItems.map(item => (
      <button
        key={item.view}
        className={`nav-item ${currentView === item.view ? 'active' : ''}`}
        onClick={() => onNavigate(item.view)}
      >
        <span style={{ fontSize: '16px' }}>{item.icon}</span>
        <span>{item.label}</span>
      </button>
    ))}
    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #1E2D4A' }}>
      <button
        className="nav-item"
        onClick={onNewScan}
        style={{ color: '#00D4FF' }}
      >
        <span style={{ fontSize: '16px' }}>🔄</span>
        <span>New Scan</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;
