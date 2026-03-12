import React, { useState } from 'react';
import { SecurityIssue, FixResult } from '../types';
import { generateFix } from '../services/geminiService';

interface FixPanelProps {
  issue: SecurityIssue;
  codeContext: string;
  onClose: () => void;
}

const FixPanel: React.FC<FixPanelProps> = ({ issue, codeContext, onClose }) => {
  const [fix, setFix] = useState<FixResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchFix = async () => {
    setLoading(true); setError('');
    try {
      const result = await generateFix(issue, codeContext);
      setFix(result);
    } catch (e: any) { setError(e.message || 'Failed to generate fix'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    if (fix?.fixedCode) { navigator.clipboard.writeText(fix.fixedCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const severityColor: Record<string, string> = {
    CRITICAL: '#FF3366', HIGH: '#FF8C00', MEDIUM: '#FFD700', LOW: '#00D4FF', INFO: '#8BA0CC',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div style={{
        width: '600px', maxWidth: '95vw', height: '100vh',
        background: '#0D1526', borderLeft: '1px solid #1E2D4A',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'fadeSlideIn 0.3s ease-out',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1E2D4A', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: severityColor[issue.severity] || '#8BA0CC',
                  background: `${severityColor[issue.severity]}15`, border: `1px solid ${severityColor[issue.severity]}40`,
                  borderRadius: '4px', padding: '2px 8px', letterSpacing: '0.1em' }}>{issue.severity}</span>
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#E8F0FF' }}>🔧 AI Fix: {issue.title}</h2>
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: '1px solid #1E2D4A', color: '#6B7FA3',
              width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px',
            }}>✕</button>
          </div>
          <p style={{ fontSize: '13px', color: '#6B7FA3', marginTop: '8px', lineHeight: 1.6 }}>{issue.description}</p>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {!fix && !loading && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🤖</div>
              <p style={{ color: '#8BA0CC', marginBottom: '24px', fontSize: '14px' }}>
                CyberGuard AI will generate a secure fix for this vulnerability.
              </p>
              <button className="btn-cyber" onClick={fetchFix} style={{ padding: '12px 32px', fontSize: '15px' }}>
                Generate AI Fix
              </button>
            </div>
          )}
          {loading && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <div className="animate-spin" style={{
                width: '50px', height: '50px', borderRadius: '50%',
                border: '3px solid #1E2D4A', borderTop: '3px solid #00D4FF',
                margin: '0 auto 20px',
              }} />
              <p style={{ color: '#8BA0CC' }}>Generating secure fix...</p>
            </div>
          )}
          {error && <p style={{ color: '#FF3366', textAlign: 'center', marginTop: '40px' }}>❌ {error}</p>}
          {fix && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '8px', padding: '16px' }}>
                <p style={{ fontSize: '11px', color: '#00FF88', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>✅ EXPLANATION:</p>
                <p style={{ fontSize: '13px', color: '#8BA0CC', lineHeight: 1.7 }}>{fix.explanation}</p>
              </div>
              {fix.changes.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', color: '#6B7FA3', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>CHANGES MADE:</p>
                  {fix.changes.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#00D4FF', flexShrink: 0, marginTop: '2px' }}>→</span>
                      <span style={{ fontSize: '13px', color: '#8BA0CC' }}>{c}</span>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#6B7FA3', fontWeight: 700, letterSpacing: '0.1em' }}>FIXED CODE:</p>
                  <button onClick={copy} style={{
                    background: copied ? 'rgba(0,255,136,0.1)' : 'transparent',
                    border: `1px solid ${copied ? '#00FF88' : '#1E2D4A'}`, color: copied ? '#00FF88' : '#6B7FA3',
                    padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s',
                  }}>{copied ? '✓ Copied' : '📋 Copy'}</button>
                </div>
                <pre style={{
                  background: '#040810', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px',
                  padding: '16px', fontSize: '12px', color: '#00FF88', overflow: 'auto',
                  fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6,
                }}>{fix.fixedCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixPanel;
