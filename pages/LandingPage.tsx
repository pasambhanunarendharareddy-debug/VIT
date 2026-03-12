import React from 'react';
import ScanInput from '../components/ScanInput';

interface LandingPageProps {
  onScan: (code: string, language: string, agentMode: string) => void;
  onOpenApiKey: () => void;
  error?: string | null;
  hasApiKey: boolean;
}

const agents = [
  {
    id: 'FULL',
    icon: '🛡️',
    title: 'Full Scan Agent',
    desc: 'Complete OWASP Top 10 analysis covering all vulnerability types',
    color: '#00D4FF',
  },
  {
    id: 'INJECTION',
    icon: '💉',
    title: 'Injection Hunter',
    desc: 'Targets SQL, Command, Code, LDAP, and template injection attacks',
    color: '#FF3366',
  },
  {
    id: 'XSS',
    icon: '🌐',
    title: 'XSS Detector',
    desc: 'Finds Reflected, Stored, and DOM-based Cross-Site Scripting',
    color: '#FF8C00',
  },
  {
    id: 'SECRETS',
    icon: '🔑',
    title: 'Secrets Scanner',
    desc: 'Detects hardcoded passwords, API keys, tokens, and credentials',
    color: '#FFD700',
  },
  {
    id: 'AUTH',
    icon: '🔐',
    title: 'Auth Auditor',
    desc: 'Checks broken auth, session issues, CSRF, and access controls',
    color: '#00FF88',
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onScan, onOpenApiKey, error, hasApiKey }) => {
  const [selectedAgent, setSelectedAgent] = React.useState('FULL');

  return (
    <div className="cyber-grid" style={{ minHeight: '100vh', padding: '0 24px 60px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '52px 0 36px' }}>
        <div className="animate-float" style={{ fontSize: '60px', marginBottom: '18px', filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.5))' }}>🛡️</div>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#E8F0FF' }}>CYBER</span>
          <span style={{ color: '#00D4FF', textShadow: '0 0 30px rgba(0,212,255,0.5)' }}>GUARD</span>
          <span style={{ color: '#E8F0FF' }}> AI</span>
        </h1>
        <p style={{ fontSize: '17px', color: '#6B7FA3', maxWidth: '500px', margin: '0 auto 14px', lineHeight: 1.6 }}>
          AI agents that scan your code for vulnerabilities, bugs, and cybersecurity threats — instantly.
        </p>

        {/* API Key Status */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
          {hasApiKey ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.25)', borderRadius: '20px', padding: '6px 16px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00FF88', boxShadow: '0 0 6px #00FF88' }} />
              <span style={{ fontSize: '12px', color: '#00FF88', fontWeight: 600 }}>API Key Connected</span>
              <button onClick={onOpenApiKey} style={{ background: 'transparent', border: 'none', color: '#4A5C82', cursor: 'pointer', fontSize: '11px', marginLeft: '4px' }}>change</button>
            </div>
          ) : (
            <button onClick={onOpenApiKey} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.35)',
              borderRadius: '20px', padding: '8px 18px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,51,102,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,51,102,0.08)')}
            >
              <span style={{ fontSize: '14px' }}>🔑</span>
              <span style={{ fontSize: '13px', color: '#FF6688', fontWeight: 600 }}>Set API Key to Enable AI Scanning</span>
              <span style={{ fontSize: '13px', color: '#FF3366', fontWeight: 700 }}>→</span>
            </button>
          )}
        </div>
      </div>

      {/* Agent Selector */}
      <div style={{ maxWidth: '920px', margin: '0 auto 28px' }}>
        <p style={{ fontSize: '11px', color: '#4A5C82', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '12px' }}>
          SELECT SCAN AGENT:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              style={{
                background: selectedAgent === agent.id ? `${agent.color}12` : '#0D1526',
                border: `1px solid ${selectedAgent === agent.id ? agent.color : '#1E2D4A'}`,
                borderRadius: '10px', padding: '14px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: selectedAgent === agent.id ? `0 0 16px ${agent.color}20` : 'none',
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{agent.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: selectedAgent === agent.id ? agent.color : '#C8D8F0', marginBottom: '4px', letterSpacing: '0.02em' }}>
                {agent.title}
              </div>
              <div style={{ fontSize: '11px', color: '#4A5C82', lineHeight: 1.4 }}>{agent.desc}</div>
              {selectedAgent === agent.id && (
                <div style={{ marginTop: '8px', fontSize: '10px', color: agent.color, fontWeight: 700 }}>✓ ACTIVE</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scan box */}
      <div className="cyber-card" style={{ maxWidth: '920px', margin: '0 auto', padding: '24px', borderColor: hasApiKey ? '#1E2D4A' : 'rgba(255,51,102,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF3366' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFD700' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00FF88' }} />
          <span style={{ fontSize: '12px', color: '#3A4D6A', marginLeft: '8px', fontFamily: 'monospace' }}>
            cyberguard-ai — {agents.find(a => a.id === selectedAgent)?.title.toLowerCase()}
          </span>
        </div>
        {error && (
          <div style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '14px' }}>
            <p style={{ color: '#FF6688', fontSize: '13px' }}>⚠️ {error}</p>
            {error.includes('API') && (
              <button onClick={onOpenApiKey} style={{ background: 'transparent', border: 'none', color: '#00D4FF', cursor: 'pointer', fontSize: '12px', marginTop: '6px', padding: 0 }}>
                → Set your API key
              </button>
            )}
          </div>
        )}
        <ScanInput onScan={(code, lang) => onScan(code, lang, selectedAgent)} isLoading={false} />
      </div>
    </div>
  );
};

export default LandingPage;
