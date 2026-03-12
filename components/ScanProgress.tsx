import React, { useEffect, useState } from 'react';

const phases = [
  'Parsing code structure...',
  'Scanning for injection vectors...',
  'Checking authentication flows...',
  'Detecting XSS vulnerabilities...',
  'Finding exposed secrets...',
  'Analyzing access controls...',
  'Evaluating security misconfigs...',
  'Computing security score...',
];

const ScanProgress: React.FC<{ language: string }> = ({ language }) => {
  const [phase, setPhase] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const phaseInt = setInterval(() => setPhase(p => (p + 1) % phases.length), 1400);
    const dotInt = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => { clearInterval(phaseInt); clearInterval(dotInt); };
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '40px', textAlign: 'center',
    }} className="cyber-grid">
      <div className="animate-float" style={{ fontSize: '80px', marginBottom: '28px', filter: 'drop-shadow(0 0 24px rgba(0,212,255,0.6))' }}>🛡️</div>
      <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#E8F0FF', marginBottom: '8px' }}>
        Scanning <span style={{ color: '#00D4FF' }}>{language.toUpperCase()}</span> Code
      </h2>
      <p style={{ color: '#6B7FA3', fontSize: '14px', marginBottom: '40px' }}>
        AI is performing deep security analysis
      </p>
      {/* Terminal log */}
      <div style={{
        background: '#040810', border: '1px solid #1E2D4A', borderRadius: '10px',
        width: '100%', maxWidth: '520px', padding: '20px', textAlign: 'left',
        fontFamily: "'JetBrains Mono', monospace", marginBottom: '32px',
      }}>
        {phases.slice(0, phase + 1).map((p, i) => (
          <div key={i} style={{ fontSize: '13px', color: i === phase ? '#00FF88' : '#2A3D5A', marginBottom: '6px', display: 'flex', gap: '8px' }}>
            <span style={{ color: i === phase ? '#00D4FF' : '#1E2D4A' }}>{'>'}</span>
            <span>{p}{i === phase ? dots : ' ✓'}</span>
          </div>
        ))}
      </div>
      {/* Pulse rings */}
      <div style={{ position: 'relative', width: '60px', height: '60px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid rgba(0,212,255,0.4)',
            animation: `pulseGlow 1.5s ease-out ${i * 0.5}s infinite`,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: '18px', borderRadius: '50%',
          background: 'rgba(0,212,255,0.2)', border: '2px solid #00D4FF',
        }} />
      </div>
    </div>
  );
};

export default ScanProgress;
