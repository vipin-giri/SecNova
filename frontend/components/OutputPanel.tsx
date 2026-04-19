'use client';

import { useState } from 'react';
import { FiClipboard, FiCheck, FiShield, FiCode, FiBookOpen, FiCheckSquare, FiSquare, FiAlertTriangle, FiInfo } from 'react-icons/fi';

interface OutputPanelProps {
  analysisResult: {
    tests: string[];
    payloads: string[];
    explanations: string[];
  };
  scanResult: {
    headers: {
      csp: boolean;
      x_frame: boolean;
      hsts: boolean;
      x_content_type_options: boolean;
      referrer_policy: boolean;
    };
    issues: string[];
    server: string;
    ssl: {
      valid: boolean;
      issuer: string;
    };
  };
  selectedFeatures: string[];
}

export default function OutputPanel({ 
  analysisResult, 
  scanResult, 
  selectedFeatures 
}: OutputPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [completedTests, setCompletedTests] = useState<Set<number>>(new Set());
  const [completedPayloads, setCompletedPayloads] = useState<Set<number>>(new Set());
  const [completedExplanations, setCompletedExplanations] = useState<Set<number>>(new Set());

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleTestComplete = (index: number) => {
    setCompletedTests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const togglePayloadComplete = (index: number) => {
    setCompletedPayloads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleExplanationComplete = (index: number) => {
    setCompletedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getTotalProgress = () => {
    const total = analysisResult.tests.length + analysisResult.payloads.length + analysisResult.explanations.length;
    const completed = completedTests.size + completedPayloads.size + completedExplanations.size;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <FiShield className="text-accent-red text-4xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Security Analysis Results
        </h2>
        <p className="text-text-secondary">
          Comprehensive security testing guidance for your application
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card glass-effect text-center">
          <div className="text-3xl font-bold text-accent-red mb-2">
            {analysisResult.tests.length}
          </div>
          <div className="text-text-secondary">Security Tests</div>
          <div className="text-sm text-green-400 mt-1">{completedTests.size} completed</div>
        </div>
        <div className="card glass-effect text-center">
          <div className="text-3xl font-bold text-accent-red mb-2">
            {analysisResult.payloads.length}
          </div>
          <div className="text-text-secondary">Test Payloads</div>
          <div className="text-sm text-green-400 mt-1">{completedPayloads.size} completed</div>
        </div>
        <div className="card glass-effect text-center">
          <div className="text-3xl font-bold text-accent-red mb-2">
            {analysisResult.explanations.length}
          </div>
          <div className="text-text-secondary">Explanations</div>
          <div className="text-sm text-green-400 mt-1">{completedExplanations.size} completed</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <div className="relative bg-gradient-to-br from-purple-950/90 via-obsidian/80 to-red-900/70 backdrop-blur-md border border-purple-500/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/50 shadow-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiCheckSquare className="text-red-500 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Overall Progress</h3>
            </div>
            <span className="text-2xl font-bold text-green-400">{getTotalProgress()}%</span>
          </div>
          <div className="w-full bg-gray-900/50 rounded-full h-4">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${getTotalProgress()}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Click on any test, payload, or explanation to mark it as completed
          </p>
        </div>
      </div>

      {/* Security Tests Checklist */}
      <div className="mb-8">
        <div className="relative bg-gradient-to-br from-purple-950/90 via-obsidian/80 to-red-900/70 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/50 shadow-red-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiCheckSquare className="text-red-500 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Security Tests Checklist</h3>
            </div>
            <span className="text-sm text-green-400">{completedTests.size}/{analysisResult.tests.length} done</span>
          </div>
          <div className="space-y-3">
            {analysisResult.tests.map((test, index) => (
              <div 
                key={index} 
                onClick={() => toggleTestComplete(index)}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                  completedTests.has(index) 
                    ? 'bg-green-900/30 border-green-500/50' 
                    : 'bg-black/50 border-red-900/30 hover:bg-purple-900/30'
                }`}
              >
                <div className="mr-3 mt-1">
                  {completedTests.has(index) ? (
                    <FiCheckSquare className="text-green-400" />
                  ) : (
                    <FiSquare className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${completedTests.has(index) ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {test}
                  </p>
                  {completedTests.has(index) && (
                    <span className="text-xs text-green-400 mt-1">✓ Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Payloads Checklist */}
      <div className="mb-8">
        <div className="relative bg-gradient-to-br from-purple-950/90 via-obsidian/80 to-red-900/70 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/50 shadow-red-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiCode className="text-red-500 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Test Payloads Checklist</h3>
            </div>
            <span className="text-sm text-green-400">{completedPayloads.size}/{analysisResult.payloads.length} done</span>
          </div>
          <div className="space-y-3">
            {analysisResult.payloads.map((payload, index) => (
              <div 
                key={index} 
                className={`flex items-start p-4 rounded-lg border transition-all ${
                  completedPayloads.has(index) 
                    ? 'bg-green-900/30 border-green-500/50' 
                    : 'bg-black/50 border-red-900/30'
                }`}
              >
                <div 
                  onClick={() => togglePayloadComplete(index)}
                  className="mr-3 mt-1 cursor-pointer"
                >
                  {completedPayloads.has(index) ? (
                    <FiCheckSquare className="text-green-400" />
                  ) : (
                    <FiSquare className="text-gray-400 hover:text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-mono bg-gray-900/50 p-2 rounded ${completedPayloads.has(index) ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {payload}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(payload, `payload-${index}`);
                      }}
                      className="flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      {copiedId === `payload-${index}` ? (
                        <>
                          <FiCheck className="text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiClipboard />
                          <span>Copy Payload</span>
                        </>
                      )}
                    </button>
                    {completedPayloads.has(index) && (
                      <span className="text-xs text-green-400">✓ Tested</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Explanations Checklist */}
      <div className="mb-8">
        <div className="relative bg-gradient-to-br from-purple-950/90 via-obsidian/80 to-red-900/70 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/50 shadow-red-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiInfo className="text-red-500 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Security Explanations Checklist</h3>
            </div>
            <span className="text-sm text-green-400">{completedExplanations.size}/{analysisResult.explanations.length} done</span>
          </div>
          <div className="space-y-3">
            {analysisResult.explanations.map((explanation, index) => (
              <div 
                key={index} 
                onClick={() => toggleExplanationComplete(index)}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                  completedExplanations.has(index) 
                    ? 'bg-green-900/30 border-green-500/50' 
                    : 'bg-black/50 border-red-900/30 hover:bg-purple-900/30'
                }`}
              >
                <div className="mr-3 mt-1">
                  {completedExplanations.has(index) ? (
                    <FiCheckSquare className="text-green-400" />
                  ) : (
                    <FiSquare className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${completedExplanations.has(index) ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                    {explanation}
                  </p>
                  {completedExplanations.has(index) && (
                    <span className="text-xs text-green-400 mt-1">✓ Reviewed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Features Summary */}
      <div className="card glass-effect">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Analysis Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {selectedFeatures.map((feature) => (
            <div key={feature} className="px-3 py-2 bg-obsidian rounded-lg border border-border">
              <span className="text-sm text-text-primary capitalize">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
