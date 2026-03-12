import React, { useState } from 'react';

interface ApiKeySetupProps {
  onSave: (key: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSave }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith('AIza')) {
      setError('Gemini API keys start with "AIza..." — please check your key.');
      return;
    }
    localStorage.setItem('cyberguard_api_key', trimmed);
    onSave(trimmed);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div className="cyber-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '48px', marginBottom: '14px' }}>🔑</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#E8F0FF', marginBottom: '8px' }}>
            API Key Required
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7FA3', lineHeight: 1.6 }}>
            CyberGuard AI needs a Google Gemini API key to scan your code. Get one free at Google AI Studio.
          </p>
        </div>

        <div style={{
          background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '8px', padding: '14px 16px', marginBottom: '20px',
        }}>
          <p style={{ fontSize: '12px', color: '#00D4FF', fontWeight: 700, marginBottom: '8px' }}>HOW TO GET YOUR FREE KEY:</p>
          <ol style={{ paddingLeft: '16px' }}>
            {[
              'Go to aistudio.google.com',
              'Sign in with Google',
              'Click "Get API Key" → "Create API key"',
              'Copy and paste it below',
            ].map((step, i) => (
              <li key={i} style={{ fontSize: '13px', color: '#8BA0CC', marginBottom: '4px', lineHeight: 1.5 }}>{step}</li>
            ))}
          </ol>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: '#00D4FF', textDecoration: 'underline' }}>
            → Open AI Studio
          </a>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', color: '#6B7FA3', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            PASTE YOUR API KEY:
          </label>
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            placeholder="AIzaSy..."
            style={{
              width: '100%', background: '#040810', border: `1px solid ${error ? '#FF3366' : '#1E2D4A'}`,
              borderRadius: '8px', color: '#C8D8F0', padding: '12px 16px',
              fontSize: '14px', outline: 'none', fontFamily: 'monospace',
            }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          {error && <p style={{ fontSize: '12px', color: '#FF3366', marginTop: '6px' }}>⚠️ {error}</p>}
        </div>

        <button className="btn-cyber" onClick={handleSave} disabled={!key.trim()}
          style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 700 }}>
          Save & Start Scanning
        </button>

        <p style={{ fontSize: '11px', color: '#3A4D6A', textAlign: 'center', marginTop: '12px' }}>
          Your key is stored locally in your browser — never sent to any server except Google.
        </p>
      </div>
    </div>
  );
};

export default ApiKeySetup;
