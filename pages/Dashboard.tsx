import React from 'react';
import { ScanResult, SecurityIssue } from '../types';
import SecurityScore from '../components/SecurityScore';
import IssueCard from '../components/IssueCard';

interface DashboardProps {
  scanResult: ScanResult;
  onViewIssues: () => void;
  onOpenFix: (issue: SecurityIssue) => void;
}

const StatCard: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div className="cyber-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
    <div style={{ fontSize: '30px', fontWeight: 800, color }}>{count}</div>
    <div style={{ fontSize: '11px', color: '#6B7FA3', fontWeight: 600, letterSpacing: '0.08em', marginTop: '4px' }}>{label}</div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ scanResult, onViewIssues, onOpenFix }) => {
  const topIssues = scanResult.issues
    .sort((a, b) => {
      const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };
      return (order[a.severity] ?? 5) - (order[b.severity] ?? 5);
    })
    .slice(0, 4);

  return (
    <div style={{ padding: '28px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#E8F0FF', marginBottom: '4px' }}>Security Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#4A5C82' }}>
          Scanned {scanResult.language.toUpperCase()} · {new Date(scanResult.timestamp).toLocaleString()} · {scanResult.issues.length} issues found
        </p>
      </div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', marginBottom: '24px', alignItems: 'start' }}>
        <div className="cyber-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SecurityScore score={scanResult.securityScore} grade={scanResult.grade} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            <StatCard label="CRITICAL" count={scanResult.criticalCount} color="#FF3366" />
            <StatCard label="HIGH" count={scanResult.highCount} color="#FF8C00" />
            <StatCard label="MEDIUM" count={scanResult.mediumCount} color="#FFD700" />
            <StatCard label="LOW" count={scanResult.lowCount} color="#00D4FF" />
            <StatCard label="INFO" count={scanResult.infoCount} color="#8BA0CC" />
          </div>
          {/* Summary */}
          <div className="cyber-card" style={{ padding: '20px', flex: 1 }}>
            <p style={{ fontSize: '11px', color: '#00D4FF', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>AI SUMMARY:</p>
            <p style={{ fontSize: '13px', color: '#8BA0CC', lineHeight: 1.7 }}>{scanResult.summary}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {scanResult.recommendations.length > 0 && (
        <div className="cyber-card" style={{ padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: '#00FF88', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>🛡️ TOP RECOMMENDATIONS:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scanResult.recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00D4FF', flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>
                <span style={{ fontSize: '13px', color: '#8BA0CC', lineHeight: 1.6 }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Issues */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#E8F0FF' }}>Top Issues</h2>
          {scanResult.issues.length > 4 && (
            <button className="btn-outline" onClick={onViewIssues} style={{ padding: '6px 16px', fontSize: '12px' }}>
              View All {scanResult.issues.length} →
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topIssues.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} onOpenFix={onOpenFix} index={i} />
          ))}
          {scanResult.issues.length === 0 && (
            <div className="cyber-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <p style={{ color: '#00FF88', fontWeight: 700 }}>No vulnerabilities found!</p>
              <p style={{ color: '#4A5C82', fontSize: '13px', marginTop: '8px' }}>Your code looks secure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
