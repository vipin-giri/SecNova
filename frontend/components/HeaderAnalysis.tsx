'use client';

import { useState } from 'react';
import { FiShield, FiAlertTriangle, FiInfo, FiCheckCircle, FiX, FiRefreshCw } from 'react-icons/fi';

interface HeaderResult {
  name: string;
  value: string;
  status: 'GOOD' | 'WEAK' | 'MISSING';
  risk: 'Low' | 'Medium' | 'High';
  explanation: string;
  recommendation?: string;
}

interface HeaderAnalysisProps {
  scanResult: {
    headers: {
      [key: string]: string;
    };
    server?: string;
  };
  onReScan?: () => void;
}

interface TestResult {
  status: 'GOOD' | 'WEAK' | 'MISSING';
  risk: 'Low' | 'Medium' | 'High';
  explanation: string;
}

const headerConfigs: Array<{
  name: string;
  key: string;
  description: string;
  test: (value: string) => TestResult;
}> = [
  {
    name: 'Content-Security-Policy',
    key: 'content-security-policy',
    description: 'Controls which resources can be loaded',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'High', explanation: 'CSP header not present' };
      if (value.includes('unsafe-inline') || value.includes('unsafe-eval') || value.includes('*')) {
        return { status: 'WEAK', risk: 'High', explanation: 'Contains unsafe directives' };
      }
      return { status: 'GOOD', risk: 'Low', explanation: 'Properly configured without unsafe directives' };
    }
  },
  {
    name: 'Strict-Transport-Security',
    key: 'strict-transport-security',
    description: 'Enforces HTTPS connections',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'High', explanation: 'HSTS header not present' };
      const maxAge = value.match(/max-age=(\d+)/);
      if (!maxAge || !value.includes('includeSubDomains') || parseInt(maxAge[1]) < 31536000) {
        return { status: 'WEAK', risk: 'Medium', explanation: 'Max-age less than 1 year or missing includeSubDomains' };
      }
      return { status: 'GOOD', risk: 'Low', explanation: 'Properly configured with max-age >= 1 year and includeSubDomains' };
    }
  },
  {
    name: 'X-Frame-Options',
    key: 'x-frame-options',
    description: 'Prevents clickjacking attacks',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'High', explanation: 'X-Frame-Options header not present' };
      if (value === 'SAMEORIGIN') {
        return { status: 'WEAK', risk: 'Medium', explanation: 'Allows same-origin framing (vulnerable to clickjacking)' };
      }
      return { status: 'GOOD', risk: 'Low', explanation: 'DENY or SAMEORIGIN prevents clickjacking' };
    }
  },
  {
    name: 'X-Content-Type-Options',
    key: 'x-content-type-options',
    description: 'Prevents MIME-type sniffing attacks',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'High', explanation: 'X-Content-Type-Options header not present' };
      if (value.includes('nosniff')) {
        return { status: 'GOOD', risk: 'Low', explanation: 'Prevents MIME-type sniffing' };
      }
      return { status: 'WEAK', risk: 'Medium', explanation: 'Missing nosniff directive' };
    }
  },
  {
    name: 'Referrer-Policy',
    key: 'referrer-policy',
    description: 'Controls referrer information sent',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'Medium', explanation: 'Referrer-Policy header not present' };
      if (value.includes('strict-origin-when-cross-origin') || value.includes('no-referrer')) {
        return { status: 'GOOD', risk: 'Low', explanation: 'Properly configured to protect privacy' };
      }
      return { status: 'WEAK', risk: 'Medium', explanation: 'May leak referrer information' };
    }
  },
  {
    name: 'Permissions-Policy',
    key: 'permissions-policy',
    description: 'Controls browser feature access',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'Medium', explanation: 'Permissions-Policy header not present' };
      const restrictiveFeatures = ['camera=()', 'microphone=()', 'geolocation=()'];
      const hasRestrictive = restrictiveFeatures.some(feature => value.includes(feature));
      if (hasRestrictive) {
        return { status: 'GOOD', risk: 'Low', explanation: 'Restrictive policy protects privacy' };
      }
      return { status: 'WEAK', risk: 'Medium', explanation: 'Permissive policy may expose sensitive features' };
    }
  },
  {
    name: 'X-XSS-Protection',
    key: 'x-xss-protection',
    description: 'Prevents cross-site scripting',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'High', explanation: 'X-XSS-Protection header not present' };
      if (value.includes('1') && value.includes('mode=block')) {
        return { status: 'GOOD', risk: 'Low', explanation: 'XSS filtering enabled with block mode' };
      }
      return { status: 'WEAK', risk: 'High', explanation: 'XSS protection not properly configured' };
    }
  },
  {
    name: 'Cache-Control',
    key: 'cache-control',
    description: 'Controls browser caching behavior',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'Medium', explanation: 'Cache-Control header not present' };
      if (value.includes('no-store') || value.includes('no-cache')) {
        return { status: 'GOOD', risk: 'Low', explanation: 'Prevents sensitive data caching' };
      }
      return { status: 'WEAK', risk: 'Medium', explanation: 'May allow caching of sensitive data' };
    }
  },
  {
    name: 'Server',
    key: 'server',
    description: 'Server software information',
    test: (value: string) => {
      if (!value) return { status: 'MISSING', risk: 'Low', explanation: 'Server header not present' };
      const genericServers = ['Apache', 'nginx', 'IIS'];
      if (genericServers.some(server => value.toLowerCase().includes(server.toLowerCase()))) {
        return { status: 'WEAK', risk: 'Low', explanation: 'Generic server may expose vulnerabilities' };
      }
      return { status: 'GOOD', risk: 'Low', explanation: 'Custom or non-generic server detected' };
    }
  },
  {
    name: 'X-Powered-By',
    key: 'x-powered-by',
    description: 'Server technology information',
    test: (value: string) => {
      if (!value) return { status: 'GOOD', risk: 'Low', explanation: 'X-Powered-By header not present (good for security)' };
      return { status: 'WEAK', risk: 'Medium', explanation: 'Server technology exposed (information disclosure)' };
    }
  }
];

export default function HeaderAnalysis({ scanResult, onReScan }: HeaderAnalysisProps) {
  const [expandedHeaders, setExpandedHeaders] = useState<string[]>([]);

  const analyzeHeaders = () => {
    const results: HeaderResult[] = [];
    
    headerConfigs.forEach(config => {
      const value = scanResult.headers[config.key];
      const result = config.test(value);
      results.push({
        name: config.name,
        value: value || 'Not Present',
        ...result
      });
    });

    return results;
  };

  const results = analyzeHeaders();
  const goodCount = results.filter(r => r.status === 'GOOD').length;
  const weakCount = results.filter(r => r.status === 'WEAK').length;
  const missingCount = results.filter(r => r.status === 'MISSING').length;
  const overallScore = Math.round(((goodCount * 3) / results.length) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GOOD': return 'text-green-400';
      case 'WEAK': return 'text-yellow-400';
      case 'MISSING': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const toggleHeader = (headerName: string) => {
    setExpandedHeaders(prev => 
      prev.includes(headerName) 
        ? prev.filter(h => h !== headerName)
        : [...prev, headerName]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-purple-950/90 via-obsidian/80 to-red-900/70 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/50 shadow-red-500/30">
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FiShield className="mr-3 text-red-500" />
              Security Headers Analysis
            </h2>
            {onReScan && (
              <button
                onClick={onReScan}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FiRefreshCw />
                <span>Re-scan</span>
              </button>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-950/50 rounded-lg p-6 border border-purple-500/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{goodCount}</div>
                <div className="text-sm text-gray-400">GOOD</div>
              </div>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-6 border border-purple-500/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{weakCount}</div>
                <div className="text-sm text-gray-400">WEAK</div>
              </div>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-6 border border-purple-500/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{missingCount}</div>
                <div className="text-sm text-gray-400">MISSING</div>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-purple-950/50 rounded-lg p-6 border border-purple-500/30 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">{overallScore}%</div>
              <div className="text-sm text-gray-400">Overall Security Score</div>
              <div className="mt-4">
                <div className="w-full bg-purple-900/30 rounded-full h-4">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${overallScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-purple-950/30 rounded-lg border border-purple-500/30 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-6 cursor-pointer transition-colors hover:bg-purple-900/50"
                  onClick={() => toggleHeader(result.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {result.status === 'GOOD' && <FiCheckCircle className="text-green-400" />}
                      {result.status === 'WEAK' && <FiAlertTriangle className="text-yellow-400" />}
                      {result.status === 'MISSING' && <FiX className="text-red-400" />}
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">{result.name}</div>
                      <div className="text-xs text-gray-400">{result.value}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getRiskColor(result.risk)}`}>
                      {result.risk}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedHeaders.includes(result.name) && (
                  <div className="border-t border-purple-500/30 p-6 bg-purple-900/20">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <FiInfo className="text-purple-400 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-white mb-2">Analysis Details</div>
                          <div className="text-xs text-gray-400">{result.explanation}</div>
                        </div>
                      </div>
                      {result.recommendation && (
                        <div className="flex items-start space-x-2">
                          <FiCheckCircle className="text-green-400 mt-1" />
                          <div>
                            <div className="text-sm font-medium text-white mb-2">Recommendation</div>
                            <div className="text-xs text-gray-400">{result.recommendation}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
