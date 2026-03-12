import React from 'react';
import { ScanResult } from '../types';

interface HeaderProps {
  onNewScan: () => void;
  scanResult: ScanResult | null;
}

const Header: React.FC<HeaderProps> = ({ onNewScan, scanResult }) => (
  <header style={{
    background: '#0D1526', borderBottom: '1px solid #1E2D4A',
    height: '60px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 24px',
    position: 'sticky', top: 0, zIndex: 50,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '34px', height: '34px',
        background: 'linear-gradient(135deg, #00D4FF, #0055FF)',
        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', boxShadow: '0 0 12px rgba(0,212,255,0.4)',
      }}>🛡️</div>
      <span style={{ fontWeight: 800, fontSize: '16px', color: '#E8F0FF', letterSpacing: '0.05em' }}>
        CYBER<span style={{ color: '#00D4FF' }}>GUARD</span>
        <span style={{ color: '#6B7FA3', fontWeight: 400, fontSize: '13px', marginLeft: '6px' }}>AI</span>
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {scanResult && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: '20px', padding: '4px 14px',
        }}>
          <div style={{ width: '7px', height: '7px', background: '#00FF88', borderRadius: '50%', boxShadow: '0 0 6px #00FF88' }} />
          <span style={{ fontSize: '12px', color: '#8BA0CC' }}>
            Score: <strong style={{ color: '#00FF88' }}>{scanResult.securityScore}</strong>/100
          </span>
        </div>
      )}
      <button className="btn-cyber" onClick={onNewScan} style={{ padding: '8px 18px', fontSize: '13px' }}>
        + New Scan
      </button>
    </div>
  </header>
);

export default Header;
