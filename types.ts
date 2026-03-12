export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IssueCategory =
  | 'INJECTION' | 'BROKEN_AUTH' | 'SENSITIVE_DATA' | 'XXE'
  | 'BROKEN_ACCESS' | 'SECURITY_MISCONFIGURATION' | 'XSS'
  | 'INSECURE_DESERIALIZATION' | 'VULNERABLE_COMPONENTS'
  | 'LOGGING_MONITORING' | 'OTHER';

export type ScanStatus = 'IDLE' | 'SCANNING' | 'COMPLETE' | 'ERROR';

export type AppView = 'LANDING' | 'SCANNING' | 'DASHBOARD' | 'ISSUES' | 'CHAT' | 'REPORT';

export interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  category: IssueCategory;
  lineNumber?: number;
  codeSnippet?: string;
  recommendation: string;
  cweId?: string;
  owaspCategory?: string;
  fixAvailable: boolean;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  language: string;
  securityScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: SecurityIssue[];
  summary: string;
  scannedCode: string;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FixResult {
  fixedCode: string;
  explanation: string;
  changes: string[];
}
