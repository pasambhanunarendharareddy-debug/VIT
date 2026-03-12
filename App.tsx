import React, { useState, useEffect } from 'react';
import { AppView, ScanResult, ChatMessage, SecurityIssue } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ScanProgress from './components/ScanProgress';
import FixPanel from './components/FixPanel';
import ApiKeySetup from './components/ApiKeySetup';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import IssuesList from './pages/IssuesList';
import ChatAgent from './pages/ChatAgent';
import ReportPage from './pages/ReportPage';
import { scanCodeForVulnerabilities, isApiKeySet } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('LANDING');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | null>(null);
  const [fixPanelOpen, setFixPanelOpen] = useState(false);
  const [scanCode, setScanCode] = useState('');
  const [scanLanguage, setScanLanguage] = useState('javascript');
  const [scanError, setScanError] = useState<string | null>(null);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(isApiKeySet());

  // On mount: if no valid key found, show setup modal automatically
  useEffect(() => {
    const ready = isApiKeySet();
    setApiKeyReady(ready);
    if (!ready) setShowApiSetup(true);
  }, []);

  const handleScan = async (code: string, language: string, agentMode: string = 'FULL') => {
    if (!isApiKeySet()) { setShowApiSetup(true); return; }
    setScanCode(code);
    setScanLanguage(language);
    setScanError(null);
    setView('SCANNING');
    try {
      const result = await scanCodeForVulnerabilities(code, language, agentMode);
      setScanResult(result);
      setView('DASHBOARD');
    } catch (err: any) {
      const msg: string = err?.message || '';
      if (msg === 'NO_API_KEY' || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('400')) {
        setScanError('Invalid API key. Please update your Gemini API key.');
        setShowApiSetup(true);
      } else {
        setScanError(msg || 'Scan failed. Please try again.');
      }
      setView('LANDING');
    }
  };

  const handleApiKeySaved = (_key: string) => {
    setShowApiSetup(false);
    setApiKeyReady(true);
    setScanError(null);
  };

  const handleOpenFix = (issue: SecurityIssue) => {
    setSelectedIssue(issue);
    setFixPanelOpen(true);
  };

  const handleNewScan = () => {
    setFixPanelOpen(false);
    setSelectedIssue(null);
    setView('LANDING');
  };

  const hasSidebar = ['DASHBOARD', 'ISSUES', 'CHAT', 'REPORT'].includes(view);

  return (
    <div style={{ minHeight: '100vh', background: '#080C14' }}>
      {hasSidebar && <Header onNewScan={handleNewScan} scanResult={scanResult} />}
      <div style={{ display: 'flex' }}>
        {hasSidebar && (
          <Sidebar currentView={view} onNavigate={setView} onNewScan={handleNewScan} />
        )}
        <main style={{ flex: 1, overflow: 'auto', minHeight: hasSidebar ? 'calc(100vh - 60px)' : '100vh' }}>
          {view === 'LANDING' && (
            <LandingPage
              onScan={handleScan}
              onOpenApiKey={() => setShowApiSetup(true)}
              error={scanError}
              hasApiKey={apiKeyReady}
            />
          )}
          {view === 'SCANNING' && <ScanProgress language={scanLanguage} />}
          {view === 'DASHBOARD' && scanResult && (
            <Dashboard scanResult={scanResult} onViewIssues={() => setView('ISSUES')} onOpenFix={handleOpenFix} />
          )}
          {view === 'ISSUES' && scanResult && (
            <IssuesList issues={scanResult.issues} onOpenFix={handleOpenFix} />
          )}
          {view === 'CHAT' && (
            <ChatAgent chatHistory={chatHistory} onUpdateHistory={setChatHistory} scanResult={scanResult} />
          )}
          {view === 'REPORT' && scanResult && <ReportPage scanResult={scanResult} />}
        </main>
      </div>

      {/* API Key Modal */}
      {showApiSetup && (
        <ApiKeySetup onSave={handleApiKeySaved} />
      )}

      {/* Fix Panel */}
      {fixPanelOpen && selectedIssue && (
        <FixPanel issue={selectedIssue} codeContext={scanCode} onClose={() => setFixPanelOpen(false)} />
      )}
    </div>
  );
};

export default App;
