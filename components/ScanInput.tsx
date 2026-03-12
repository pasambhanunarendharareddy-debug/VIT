import React, { useState } from 'react';

const LANGUAGES = ['javascript','typescript','python','java','c','cpp','csharp','php','ruby','go','rust','swift','kotlin','sql','bash','html','other'];

const DEMO_CODE = `// ⚠️ This code has intentional vulnerabilities for demo purposes
const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// VULNERABILITY: Hardcoded credentials
const db = mysql.createConnection({
  host: 'localhost', user: 'root', password: 'admin123', database: 'users'
});

// VULNERABILITY: SQL Injection
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query, (err, result) => res.json(result));
});

// VULNERABILITY: XSS
app.get('/greet', (req, res) => {
  res.send('<h1>Hello ' + req.query.name + '</h1>');
});

// VULNERABILITY: Insecure auth - no password hashing
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.query('INSERT INTO users VALUES (?, ?)', [username, password]);
  res.json({ success: true });
});

app.listen(3000);`;

interface ScanInputProps {
  onScan: (code: string, language: string) => void;
  isLoading?: boolean;
}

const ScanInput: React.FC<ScanInputProps> = ({ onScan, isLoading }) => {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('javascript');

  return (
    <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '11px', color: '#6B7FA3', fontWeight: 700, letterSpacing: '0.1em' }}>LANGUAGE</label>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{
            background: '#0D1526', border: '1px solid #1E2D4A', color: '#C8D8F0',
            padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', cursor: 'pointer',
          }}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
          </select>
        </div>
        <button onClick={() => setCode(DEMO_CODE)} style={{
          background: 'transparent', border: '1px dashed #2A3D5A', color: '#6B7FA3',
          padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = '#00D4FF'); (e.currentTarget.style.color = '#00D4FF'); }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = '#2A3D5A'); (e.currentTarget.style.color = '#6B7FA3'); }}
        >Try Demo Code</button>
      </div>
      <textarea
        className="code-input"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={`// Paste your ${lang} code here...\n// CyberGuard AI will scan for OWASP Top 10, SQL Injection, XSS, secrets exposure, and more.`}
        rows={18}
        spellCheck={false}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span style={{ fontSize: '12px', color: '#3A4D6A', fontFamily: 'monospace' }}>
          {code.split('\n').length} lines · {code.length} chars
        </span>
        <button className="btn-cyber" onClick={() => code.trim() && onScan(code, lang)}
          disabled={!code.trim() || isLoading}
          style={{ padding: '13px 36px', fontSize: '15px', letterSpacing: '0.05em' }}>
          {isLoading ? '⟳ Analyzing...' : '🔍 SCAN NOW'}
        </button>
      </div>
    </div>
  );
};

export default ScanInput;
