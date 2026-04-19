'use client';

import { FiShield, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

interface ScanResultsProps {
  result: {
    headers: {
      [key: string]: string;
      'content-security-policy'?: string;
      'strict-transport-security'?: string;
      'x-frame-options'?: string;
      'x-content-type-options'?: string;
      'referrer-policy'?: string;
    };
    issues: string[];
    server: string;
    ssl: {
      valid: boolean;
      issuer: string;
    };
  };
}

export default function ScanResults({ result }: ScanResultsProps) {
  const getHeaderStatus = (value: string | undefined) => {
    const present = !!value;
    return present ? (
      <div className="flex items-center text-green-400">
        <FiCheckCircle className="mr-2" />
        <span>Present</span>
      </div>
    ) : (
      <div className="flex items-center text-red-400">
        <FiAlertTriangle className="mr-2" />
        <span>Missing</span>
      </div>
    );
  };

  const getRiskLevel = (issueCount: number) => {
    if (issueCount === 0) return { level: 'Low', color: 'text-green-400' };
    if (issueCount <= 2) return { level: 'Medium', color: 'text-yellow-400' };
    return { level: 'High', color: 'text-accent-red' };
  };

  const riskLevel = getRiskLevel(result.issues.length);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card glass-effect">
        <div className="flex items-center mb-6">
          <FiShield className="text-accent-red text-3xl mr-3" />
          <h2 className="text-2xl font-bold text-text-primary">
            Security Scan Results
          </h2>
        </div>

        {/* Risk Level */}
        <div className="mb-6 p-4 bg-obsidian rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Risk Level:</span>
            <span className={`font-bold text-lg ${riskLevel.color}`}>
              {riskLevel.level}
            </span>
          </div>
        </div>

        {/* Security Headers */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Security Headers Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-obsidian rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">Content Security Policy</span>
                {getHeaderStatus(result.headers['content-security-policy'])}
              </div>
              <p className="text-sm text-text-secondary">
                Prevents XSS attacks by controlling which resources can be loaded
              </p>
            </div>

            <div className="p-4 bg-obsidian rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">X-Frame-Options</span>
                {getHeaderStatus(result.headers['x-frame-options'])}
              </div>
              <p className="text-sm text-text-secondary">
                Protects against clickjacking attacks
              </p>
            </div>

            <div className="p-4 bg-obsidian rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">HTTP Strict Transport Security</span>
                {getHeaderStatus(result.headers['strict-transport-security'])}
              </div>
              <p className="text-sm text-text-secondary">
                Enforces HTTPS connections for better security
              </p>
            </div>

            <div className="p-4 bg-obsidian rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">X-Content-Type-Options</span>
                {getHeaderStatus(result.headers['x-content-type-options'])}
              </div>
              <p className="text-sm text-text-secondary">
                Prevents MIME-type sniffing attacks
              </p>
            </div>

            <div className="p-4 bg-obsidian rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">Referrer Policy</span>
                {getHeaderStatus(result.headers['referrer-policy'])}
              </div>
              <p className="text-sm text-text-secondary">
                Controls how much referrer information is sent
              </p>
            </div>

            <div className="p-4 bg-obsidian rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">SSL Certificate</span>
                <div className="flex items-center">
                  {result.ssl.valid ? (
                    <div className="flex items-center text-green-400">
                      <FiCheckCircle className="mr-2" />
                      <span>Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-accent-red">
                      <FiAlertTriangle className="mr-2" />
                      <span>Invalid</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                {result.ssl.issuer}
              </p>
            </div>
          </div>
        </div>

        {/* Security Issues */}
        {result.issues.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Security Issues Found
            </h3>
            <div className="space-y-3">
              {result.issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 bg-red-900/20 border border-red-800/30 rounded-lg"
                >
                  <FiAlertTriangle className="text-accent-red mt-1 mr-3 flex-shrink-0" />
                  <span className="text-text-secondary">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Server Information */}
        <div className="p-4 bg-obsidian rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <FiInfo className="text-text-secondary mr-2" />
            <span className="text-sm text-text-secondary">
              Server: {result.server}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
