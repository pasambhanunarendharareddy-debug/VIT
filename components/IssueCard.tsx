import React, { useState } from 'react';
import { SecurityIssue } from '../types';
import SeverityBadge from './SeverityBadge';

const catLabels: Record<string, string> = {
  INJECTION: 'Injection', BROKEN_AUTH: 'Broken Auth', SENSITIVE_DATA: 'Sensitive Data',
  XSS: 'XSS', BROKEN_ACCESS: 'Broken Access', SECURITY_MISCONFIGURATION: 'Misconfiguration',
  XXE: 'XXE', INSECURE_DESERIALIZATION: 'Deserialization',
  VULNERABLE_COMPONENTS: 'Vuln. Components', LOGGING_MONITORING: 'Logging', OTHER: 'Other',
};

interface IssueCardProps {
  issue: SecurityIssue;
  onOpenFix: (issue: SecurityIssue) => void;
  index: number;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onOpenFix, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="cyber-card animate-fade-in"
      style={{ padding: '16px', cursor: 'pointer', animationDelay: `${index * 0.06}s`, opacity: 0 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <SeverityBadge severity={issue.severity} />
            <span style={{
              color: '#8BA0CC', fontSize: '10px',
              background: 'rgba(139,160,204,0.08)', border: '1px solid rgba(139,160,204,0.18)',
              borderRadius: '4px', padding: '2px 8px', fontWeight: 600, letterSpacing: '0.05em',
            }}>{catLabels[issue.category] || issue.category}</span>
            {issue.cweId && <span style={{ fontSize: '10px', color: '#4A5C82' }}>{issue.cweId}</span>}
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#E8F0FF', marginBottom: '2px' }}>{issue.title}</h3>
          {issue.lineNumber && (
            <span style={{ fontSize: '11px', color: '#4A5C82', fontFamily: 'monospace' }}>Line {issue.lineNumber}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button className="btn-cyber" style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={e => { e.stopPropagation(); onOpenFix(issue); }}>
            🔧 Fix
          </button>
          <button style={{
            background: 'transparent', border: '1px solid #1E2D4A', color: '#6B7FA3',
            padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
          }}>{expanded ? '▲' : '▼'}</button>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #1E2D4A' }}>
          <p style={{ fontSize: '13px', color: '#8BA0CC', lineHeight: 1.7, marginBottom: '12px' }}>{issue.description}</p>
          {issue.codeSnippet && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '10px', color: '#4A5C82', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px' }}>VULNERABLE CODE:</p>
              <pre style={{
                background: '#040810', border: '1px solid rgba(255,51,102,0.2)',
                borderRadius: '6px', padding: '12px', fontSize: '12px', color: '#FF8C00',
                overflow: 'auto', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5,
              }}>{issue.codeSnippet}</pre>
            </div>
          )}
          <div style={{
            background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.18)',
            borderRadius: '8px', padding: '12px',
          }}>
            <p style={{ fontSize: '10px', color: '#00FF88', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px' }}>💡 RECOMMENDATION:</p>
            <p style={{ fontSize: '13px', color: '#8BA0CC', lineHeight: 1.6 }}>{issue.recommendation}</p>
          </div>
          {issue.owaspCategory && (
            <p style={{ fontSize: '11px', color: '#4A5C82', marginTop: '8px' }}>📌 {issue.owaspCategory}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueCard;
