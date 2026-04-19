'use client';

import { FiCode, FiClipboard, FiCheck } from 'react-icons/fi';

interface PayloadCardProps {
  payloads: string[];
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

export default function PayloadCard({ payloads, onCopy, copiedId }: PayloadCardProps) {
  return (
    <div className="card glass-effect">
      <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
        <FiCode className="mr-2 text-accent-red" />
        Security Test Payloads
      </h3>
      
      <div className="space-y-3">
        {payloads.map((payload, index) => {
          const payloadId = `payload-${index}`;
          const isCopied = copiedId === payloadId;
          
          return (
            <div
              key={index}
              className="p-4 bg-obsidian rounded-lg border border-border"
            >
              <div className="flex items-center justify-between">
                <code className="text-text-primary font-mono text-sm flex-1 mr-4 break-all">
                  {payload}
                </code>
                <button
                  onClick={() => onCopy(payload, payloadId)}
                  className="flex items-center space-x-2 px-3 py-1 bg-obsidian border border-border rounded-lg hover:border-accent-red transition-colors flex-shrink-0"
                >
                  {isCopied ? (
                    <>
                      <FiCheck className="text-green-400" />
                      <span className="text-green-400 text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiClipboard className="text-text-secondary" />
                      <span className="text-text-secondary text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {payloads.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary">No payloads available for selected features.</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-obsidian rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          How to use these payloads:
        </h4>
        <ul className="text-xs text-text-secondary space-y-1">
          <li>• Copy payloads to test input fields and parameters</li>
          <li>• Test in a controlled environment with proper authorization</li>
          <li>• Monitor application responses for vulnerabilities</li>
          <li>• Document any security findings for remediation</li>
        </ul>
      </div>
    </div>
  );
}
