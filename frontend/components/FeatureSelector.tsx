'use client';

import { useState } from 'react';
import { FiSettings, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

interface FeatureSelectorProps {
  onFeaturesSelected: (features: string[]) => void;
  onAnalysisComplete: (result: any) => void;
  setLoading: (loading: boolean) => void;
}

const features = [
  { id: 'login', name: 'Login', description: 'User authentication and login functionality' },
  { id: 'registration', name: 'Registration', description: 'User account creation and registration' },
  { id: 'upload', name: 'File Upload', description: 'File upload and management features' },
  { id: 'download', name: 'Download', description: 'File download and content serving' },
  { id: 'api', name: 'API', description: 'REST API or web service endpoints' },
  { id: 'roles', name: 'User Roles', description: 'Role-based access control and permissions' },
  { id: 'payment', name: 'Payment', description: 'Payment processing and financial transactions' },
];

export default function FeatureSelector({ 
  onFeaturesSelected, 
  onAnalysisComplete, 
  setLoading 
}: FeatureSelectorProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleFeatureToggle = (featureId: string) => {
    console.log('Toggling feature:', featureId);
    setSelectedFeatures(prev => {
      const newSelection = prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      console.log('New selection:', newSelection);
      return newSelection;
    });
  };

  const handleCheckboxChange = (featureId: string) => {
    handleFeatureToggle(featureId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedFeatures.length === 0) {
      setError('Please select at least one feature to analyze');
      return;
    }

    setLoading(true);
    onFeaturesSelected(selectedFeatures);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sec-nova-x9sv.vercel.app';
      const response = await axios.post(`${API_URL}/api/analyze`, { features: selectedFeatures });
      onAnalysisComplete(response.data);
    } catch (err) {
      setError('Failed to analyze features. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="card glass-effect">
        <div className="text-center mb-8">
          <FiSettings className="text-accent-red text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Select Application Features
          </h2>
          <p className="text-text-secondary">
            Choose the features present in your web application to get targeted security testing guidance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  selectedFeatures.includes(feature.id)
                    ? 'border-accent-red bg-red-900/20 red-glow'
                    : 'border-border bg-obsidian hover:border-accent-red/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={feature.id}
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => handleCheckboxChange(feature.id)}
                    className="checkbox-custom mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={feature.id}
                      className="block font-medium text-text-primary cursor-pointer"
                    >
                      {feature.name}
                    </label>
                    <p className="text-sm text-text-secondary mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
              <p className="text-accent-red text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
            </div>
            <button
              type="submit"
              disabled={selectedFeatures.length === 0}
              className="btn-primary flex items-center space-x-2 red-glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Analyze Security</span>
              <FiArrowRight />
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-obsidian rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What you'll get:
          </h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Comprehensive security testing checklist</li>
            <li>• Ready-to-use security payloads</li>
            <li>• Detailed explanations of vulnerabilities</li>
            <li>• Risk assessment and impact analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
