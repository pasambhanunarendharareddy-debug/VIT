import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ScanResult } from '../types';
import { chatWithSecurityAgent } from '../services/geminiService';

interface ChatAgentProps {
  chatHistory: ChatMessage[];
  onUpdateHistory: (msgs: ChatMessage[]) => void;
  scanResult: ScanResult | null;
}

const SUGGESTIONS = [
  'What is SQL injection and how do I prevent it?',
  'Explain XSS attacks with examples',
  'How do I store passwords securely?',
  'What is the OWASP Top 10?',
];

const ChatAgent: React.FC<ChatAgentProps> = ({ chatHistory, onUpdateHistory, scanResult }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const send = async (query: string) => {
    if (!query.trim() || loading) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: query, timestamp: new Date().toISOString() };
    const updated = [...chatHistory, userMsg];
    onUpdateHistory(updated);
    setInput(''); setLoading(true);
    try {
      const reply = await chatWithSecurityAgent(query, updated);
      onUpdateHistory([...updated, { id: `a-${Date.now()}`, role: 'assistant', content: reply, timestamp: new Date().toISOString() }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid #1E2D4A', flexShrink: 0 }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#E8F0FF', marginBottom: '2px' }}>🤖 AI Security Chat</h1>
        <p style={{ fontSize: '13px', color: '#4A5C82' }}>Ask anything about cybersecurity</p>
      </div>

      {/* Messages */}
      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛡️</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#E8F0FF', marginBottom: '8px' }}>CyberGuard Security Expert</h2>
            <p style={{ color: '#4A5C82', fontSize: '13px', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
              Ask me anything about cybersecurity, vulnerabilities, secure coding, or your scan results.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)',
                  color: '#8BA0CC', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
                  transition: 'all 0.2s', textAlign: 'left',
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {chatHistory.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '100%' }}>
            <div style={{ maxWidth: '80%' }}>
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <div style={{
                    width: '24px', height: '24px', background: 'linear-gradient(135deg,#00D4FF,#0055FF)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                  }}>🛡️</div>
                  <span style={{ fontSize: '11px', color: '#4A5C82' }}>CyberGuard AI</span>
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ padding: '12px 16px' }}>
                <p style={{ fontSize: '14px', color: '#C8D8F0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
              <p style={{ fontSize: '10px', color: '#2A3D5A', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', maxWidth: '120px' }} className="chat-bubble-ai">
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%', background: '#00D4FF',
                animation: `typing 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 28px', borderTop: '1px solid #1E2D4A', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Ask about vulnerabilities, secure coding, cybersecurity threats..."
            style={{
              flex: 1, background: '#0D1526', border: '1px solid #1E2D4A', borderRadius: '10px',
              color: '#C8D8F0', padding: '12px 16px', fontSize: '14px', outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button className="btn-cyber" onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{ padding: '12px 20px', fontSize: '14px', flexShrink: 0 }}>
            Send →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
