import React, { useState } from 'react';
import { ScanResult } from '../types';

interface ReportPageProps { scanResult: ScanResult; }

const severityColor: Record<string, string> = {
  CRITICAL: '#FF3366', HIGH: '#FF8C00', MEDIUM: '#FFD700', LOW: '#00D4FF', INFO: '#8BA0CC',
};

const ReportPage: React.FC<ReportPageProps> = ({ scanResult }) => {
  const [copied, setCopied] = useState(false);

  const reportText = [
    `# CyberGuard AI Security Report`,
    `Generated: ${new Date(scanResult.timestamp).toLocaleString()}`,
    `Language: ${scanResult.language.toUpperCase()}`,
    ``,
    `## Security Score: ${scanResult.securityScore}/100 (Grade ${scanResult.grade})`,
    ``,
    `## Summary`,
    scanResult.summary,
    ``,
    `## Issue Counts`,
    `- Critical: ${scanResult.criticalCount}`,
    `- High: ${scanResult.highCount}`,
    `- Medium: ${scanResult.mediumCount}`,
    `- Low: ${scanResult.lowCount}`,
    `- Info: ${scanResult.infoCount}`,
    ``,
    `## Vulnerabilities`,
    ...scanResult.issues.map((issue, i) => [
      `### ${i + 1}. [${issue.severity}] ${issue.title}`,
      `Category: ${issue.category}${issue.lineNumber ? ` | Line: ${issue.lineNumber}` : ''}${issue.cweId ? ` | ${issue.cweId}` : ''}`,
      ``,
      issue.description,
      ``,
      `**Recommendation:** ${issue.recommendation}`,
      ``,
    ].join('\n')),
    `## Recommendations`,
    ...scanResult.recommendations.map((r, i) => `${i + 1}. ${r}`),
  ].join('\n');

  const copy = () => { navigator.clipboard.writeText(reportText); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ padding: '28px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#E8F0FF', marginBottom: '4px' }}>📋 Full Security Report</h1>
          <p style={{ fontSize: '13px', color: '#4A5C82' }}>{new Date(scanResult.timestamp).toLocaleString()}</p>
        </div>
        <button onClick={copy} className="btn-cyber" style={{ padding: '10px 20px', fontSize: '13px' }}>
          {copied ? '✓ Copied!' : '📋 Copy Report'}
        </button>
      </div>

      {/* Score banner */}
      <div className="cyber-card" style={{
        padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px',
        borderColor: scanResult.securityScore >= 80 ? 'rgba(0,255,136,0.3)' : scanResult.securityScore >= 60 ? 'rgba(255,215,0,0.3)' : 'rgba(255,51,102,0.3)',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
          background: `conic-gradient(${scanResult.securityScore >= 80 ? '#00FF88' : scanResult.securityScore >= 60 ? '#FFD700' : '#FF3366'} ${scanResult.securityScore * 3.6}deg, #1E2D4A 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: '#0D1526', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#E8F0FF' }}>{scanResult.securityScore}</span>
            <span style={{ fontSize: '11px', color: '#4A5C82' }}>/ 100</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#E8F0FF' }}>Grade {scanResult.grade}</p>
          <p style={{ fontSize: '14px', color: '#8BA0CC', marginTop: '4px' }}>{scanResult.summary}</p>
        </div>
      </div>

      {/* Issue count pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'CRITICAL', count: scanResult.criticalCount },
          { label: 'HIGH', count: scanResult.highCount },
          { label: 'MEDIUM', count: scanResult.mediumCount },
          { label: 'LOW', count: scanResult.lowCount },
          { label: 'INFO', count: scanResult.infoCount },
        ].map(({ label, count }) => (
          <span key={label} style={{
            padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700,
            color: severityColor[label], background: `${severityColor[label]}12`, border: `1px solid ${severityColor[label]}35`,
          }}>{count} {label}</span>
        ))}
      </div>

      {/* All issues */}
      {scanResult.issues.map((issue, i) => (
        <div key={issue.id} className="cyber-card" style={{ padding: '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontWeight: 800, color: '#4A5C82', flexShrink: 0, fontFamily: 'monospace' }}>#{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: severityColor[issue.severity] || '#8BA0CC',
                  background: `${severityColor[issue.severity] || '#8BA0CC'}15`,
                  border: `1px solid ${severityColor[issue.severity] || '#8BA0CC'}40`,
                  borderRadius: '4px', padding: '2px 8px', letterSpacing: '0.08em',
                }}>{issue.severity}</span>
                {issue.cweId && <span style={{ fontSize: '11px', color: '#4A5C82' }}>{issue.cweId}</span>}
                {issue.lineNumber && <span style={{ fontSize: '11px', color: '#4A5C82', fontFamily: 'monospace' }}>Line {issue.lineNumber}</span>}
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#E8F0FF', marginBottom: '6px' }}>{issue.title}</h3>
              <p style={{ fontSize: '13px', color: '#6B7FA3', lineHeight: 1.6, marginBottom: '10px' }}>{issue.description}</p>
              <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '6px', padding: '10px 14px' }}>
                <span style={{ fontSize: '11px', color: '#00FF88', fontWeight: 700 }}>RECOMMENDATION: </span>
                <span style={{ fontSize: '13px', color: '#6B7FA3' }}>{issue.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Recommendations */}
      {scanResult.recommendations.length > 0 && (
        <div className="cyber-card" style={{ padding: '20px', marginTop: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#00D4FF', letterSpacing: '0.08em', marginBottom: '14px' }}>🛡️ SECURITY RECOMMENDATIONS:</p>
          {scanResult.recommendations.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#00D4FF', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: '13px', color: '#8BA0CC', lineHeight: 1.6 }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
