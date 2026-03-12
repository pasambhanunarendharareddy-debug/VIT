import React, { useState } from 'react';
import { SecurityIssue, SeverityLevel } from '../types';
import IssueCard from '../components/IssueCard';

interface IssuesListProps {
  issues: SecurityIssue[];
  onOpenFix: (issue: SecurityIssue) => void;
}

const SEVERITIES: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const severityColor: Record<SeverityLevel, string> = {
  CRITICAL: '#FF3366', HIGH: '#FF8C00', MEDIUM: '#FFD700', LOW: '#00D4FF', INFO: '#8BA0CC',
};

const IssuesList: React.FC<IssuesListProps> = ({ issues, onOpenFix }) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = issues.filter(issue => {
    const matchSev = severityFilter === 'ALL' || issue.severity === severityFilter;
    const matchSearch = !search || issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.description.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchSearch;
  }).sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };
    return (order[a.severity] ?? 5) - (order[b.severity] ?? 5);
  });

  return (
    <div style={{ padding: '28px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#E8F0FF', marginBottom: '4px' }}>All Issues</h1>
        <p style={{ fontSize: '13px', color: '#4A5C82' }}>{issues.length} total vulnerabilities detected</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search issues..."
          style={{
            background: '#0D1526', border: '1px solid #1E2D4A', borderRadius: '8px',
            color: '#C8D8F0', padding: '8px 14px', fontSize: '13px', outline: 'none',
            flex: '1', minWidth: '200px',
          }}
        />
        <button onClick={() => setSeverityFilter('ALL')} style={{
          padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', border: '1px solid',
          background: severityFilter === 'ALL' ? 'rgba(0,212,255,0.15)' : 'transparent',
          color: '#00D4FF', borderColor: severityFilter === 'ALL' ? '#00D4FF' : '#1E2D4A',
        }}>ALL ({issues.length})</button>
        {SEVERITIES.map(sev => {
          const count = issues.filter(i => i.severity === sev).length;
          if (count === 0) return null;
          return (
            <button key={sev} onClick={() => setSeverityFilter(sev)} style={{
              padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', border: '1px solid', transition: 'all 0.2s',
              color: severityColor[sev],
              background: severityFilter === sev ? `${severityColor[sev]}18` : 'transparent',
              borderColor: severityFilter === sev ? severityColor[sev] : '#1E2D4A',
            }}>{sev} ({count})</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="cyber-card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#4A5C82' }}>No issues match your filters.</p>
          </div>
        ) : (
          filtered.map((issue, i) => <IssueCard key={issue.id} issue={issue} onOpenFix={onOpenFix} index={i} />)
        )}
      </div>
    </div>
  );
};

export default IssuesList;
