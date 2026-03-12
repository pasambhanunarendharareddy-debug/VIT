import React from 'react';

interface SecurityScoreProps {
  score: number;
  grade: string;
}

const SecurityScore: React.FC<SecurityScoreProps> = ({ score, grade }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const s = Math.max(0, Math.min(100, score));
  const offset = circ - (s / 100) * circ;

  const color = s >= 80 ? '#00FF88' : s >= 60 ? '#FFD700' : s >= 40 ? '#FF8C00' : '#FF3366';
  const label = s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 60 ? 'Fair' : s >= 40 ? 'Poor' : 'Critical Risk';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="90" cy="90" r={r} fill="none" stroke="#1E2D4A" strokeWidth="13" />
          <circle
            cx="90" cy="90" r={r} fill="none"
            stroke={color} strokeWidth="13"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.5s ease-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 10px ${color}90)`,
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '44px', fontWeight: 800, color, textShadow: `0 0 20px ${color}70`, lineHeight: 1 }}>
            {s}
          </span>
          <span style={{ fontSize: '14px', color: '#8BA0CC', fontWeight: 600, marginTop: '2px' }}>Grade {grade}</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '15px', fontWeight: 700, color }}>{label}</p>
        <p style={{ fontSize: '12px', color: '#4A5C82', marginTop: '2px' }}>Security Score</p>
      </div>
    </div>
  );
};

export default SecurityScore;
