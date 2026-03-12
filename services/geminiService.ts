import { GoogleGenAI, Type } from "@google/genai";
import { SecurityIssue, ScanResult, ChatMessage, FixResult } from "../types";

// Only accept real Gemini keys (start with AIza) — ignores .env placeholders
const getApiKey = (): string => {
  // localStorage takes priority so user-saved keys always win
  const local = localStorage.getItem('cyberguard_api_key') || '';
  if (local.startsWith('AIza')) return local;
  const env = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (env.startsWith('AIza')) return env;
  return '';
};

export const isApiKeySet = () => getApiKey().length > 0;

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

const assertKey = () => {
  if (!getApiKey()) throw new Error('NO_API_KEY');
};

export const scanCodeForVulnerabilities = async (
  code: string,
  language: string,
  agentMode: string = 'FULL'
): Promise<ScanResult> => {
  assertKey();
  const ai = getAI();
  const model = 'gemini-2.5-flash';

  const agentFocus: Record<string, string> = {
    FULL: 'Perform a comprehensive security analysis covering ALL vulnerability types.',
    INJECTION: 'Focus specifically on injection attacks: SQL Injection, Command Injection, Code Injection, LDAP Injection, XPath Injection, and Template Injection.',
    XSS: 'Focus specifically on Cross-Site Scripting (XSS): Reflected XSS, Stored XSS, DOM-based XSS, and related client-side injection issues.',
    SECRETS: 'Focus specifically on exposed secrets: hardcoded passwords, API keys, tokens, private keys, connection strings, credentials, and sensitive configuration values.',
    AUTH: 'Focus specifically on authentication and authorization issues: weak passwords, broken auth, insecure sessions, missing access controls, JWT issues, CSRF, privilege escalation.',
  };

  const prompt = `You are CyberGuard AI, an expert cybersecurity scanner running in ${agentMode} agent mode.

${agentFocus[agentMode] || agentFocus.FULL}

Analyze this ${language} code:
\`\`\`${language}
${code}
\`\`\`

Also check for: hardcoded secrets, insecure crypto, path traversal, IDOR, race conditions, and logic flaws.
For each issue, specify exact lineNumber and codeSnippet from the code.

Security Score (0-100): 90-100=A, 75-89=B, 60-74=C, 40-59=D, 0-39=F`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          securityScore: { type: Type.NUMBER },
          grade: { type: Type.STRING },
          summary: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING },
                category: { type: Type.STRING },
                lineNumber: { type: Type.NUMBER },
                codeSnippet: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                cweId: { type: Type.STRING },
                owaspCategory: { type: Type.STRING },
              },
              required: ['title', 'description', 'severity', 'category', 'recommendation']
            }
          }
        },
        required: ['securityScore', 'grade', 'summary', 'issues', 'recommendations']
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}');
  const issues: SecurityIssue[] = (parsed.issues || []).map((issue: any, i: number) => ({
    ...issue,
    id: `issue-${Date.now()}-${i}`,
    // Normalize to uppercase — AI may return 'critical', 'Critical', or 'CRITICAL'
    severity: (issue.severity || 'INFO').toUpperCase(),
    category: (issue.category || 'OTHER').toUpperCase(),
    fixAvailable: true,
  }));

  return {
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    language,
    securityScore: Math.round(Math.max(0, Math.min(100, parsed.securityScore || 50))),
    grade: parsed.grade || 'F',
    issues,
    summary: parsed.summary || 'Scan complete.',
    scannedCode: code,
    criticalCount: issues.filter(i => i.severity === 'CRITICAL').length,
    highCount: issues.filter(i => i.severity === 'HIGH').length,
    mediumCount: issues.filter(i => i.severity === 'MEDIUM').length,
    lowCount: issues.filter(i => i.severity === 'LOW').length,
    infoCount: issues.filter(i => i.severity === 'INFO').length,
    recommendations: parsed.recommendations || [],
  };
};

export const generateFix = async (
  issue: SecurityIssue,
  codeContext: string
): Promise<FixResult> => {
  assertKey();
  const ai = getAI();
  const model = 'gemini-2.5-flash';

  const prompt = `You are CyberGuard AI. Fix this security vulnerability.

VULNERABILITY: ${issue.title} (${issue.severity}) - ${issue.cweId || ''}
DESCRIPTION: ${issue.description}
${issue.codeSnippet ? `VULNERABLE CODE:\n${issue.codeSnippet}` : ''}

FULL CODE CONTEXT:
${codeContext.slice(0, 3000)}

Provide the fixed secure code, explanation of changes, and list of specific changes made.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fixedCode: { type: Type.STRING },
          explanation: { type: Type.STRING },
          changes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['fixedCode', 'explanation', 'changes']
      }
    }
  });

  return JSON.parse(response.text || '{}') as FixResult;
};

export const chatWithSecurityAgent = async (
  query: string,
  history: ChatMessage[]
): Promise<string> => {
  assertKey();
  const ai = getAI();

  const historyText = history.slice(-6).map(m =>
    `${m.role === 'user' ? 'User' : 'CyberGuard AI'}: ${m.content}`
  ).join('\n');

  const prompt = `You are CyberGuard AI, an expert cybersecurity assistant specializing in OWASP Top 10, vulnerability analysis, secure coding, penetration testing, and security architecture.

${historyText ? `Conversation so far:\n${historyText}\n\n` : ''}User: ${query}

Answer like a cybersecurity expert. Be specific, practical, use markdown formatting.`;

  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text || "I couldn't generate a response. Please try again.";
};
