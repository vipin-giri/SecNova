'use client';

import { FiBookOpen, FiAlertTriangle, FiInfo } from 'react-icons/fi';

interface ExplanationCardProps {
  explanations: string[];
}

export default function ExplanationCard({ explanations }: ExplanationCardProps) {
  const getSeverityIcon = (explanation: string) => {
    const lowerExplanation = explanation.toLowerCase();
    if (lowerExplanation.includes('critical') || lowerExplanation.includes('severe') || lowerExplanation.includes('high')) {
      return <FiAlertTriangle className="text-accent-red" />;
    }
    return <FiInfo className="text-text-secondary" />;
  };

  const getSeverityColor = (explanation: string) => {
    const lowerExplanation = explanation.toLowerCase();
    if (lowerExplanation.includes('critical') || lowerExplanation.includes('severe') || lowerExplanation.includes('high')) {
      return 'border-red-800/30 bg-red-900/20';
    }
    return 'border-border bg-obsidian';
  };

  return (
    <div className="card glass-effect">
      <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
        <FiBookOpen className="mr-2 text-accent-red" />
        Security Explanations
      </h3>
      
      <div className="space-y-4">
        {explanations.map((explanation, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all duration-300 hover:border-accent-red/50 ${getSeverityColor(explanation)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {getSeverityIcon(explanation)}
              </div>
              <div className="flex-1">
                <p className="text-text-primary leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {explanations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary">No explanations available for selected features.</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-obsidian rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          Understanding Security Risks:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary">
          <div>
            <strong className="text-accent-red">Critical/High:</strong>
            <p>Immediate attention required, can lead to system compromise</p>
          </div>
          <div>
            <strong className="text-yellow-400">Medium:</strong>
            <p>Should be addressed in next development cycle</p>
          </div>
          <div>
            <strong className="text-green-400">Low:</strong>
            <p>Minor security improvements, good practice to fix</p>
          </div>
          <div>
            <strong className="text-blue-400">Informational:</strong>
            <p>Security best practices and recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
