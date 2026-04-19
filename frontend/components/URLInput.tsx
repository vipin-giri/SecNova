'use client';

import { useState } from 'react';
import { FiGlobe, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

interface URLInputProps {
  onScanComplete: (result: any) => void;
  setLoading: (loading: boolean) => void;
}

export default function URLInput({ onScanComplete, setLoading }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoadingState] = useState(false);

  const validateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoadingState(true);
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sec-nova-x9sv.vercel.app';
      const response = await axios.post(`${API_URL}/api/scan`, { url });
      onScanComplete(response.data);
    } catch (err) {
      setError('Failed to scan the URL. Please try again.');
      console.error('Scan error:', err);
    } finally {
      setLoadingState(false);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-br from-purple-950/90 via-obsidian/80 to-red-900/70 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/50 shadow-red-500/30">
        <div className="relative z-10">
          <div className="text-center mb-8">
            <FiGlobe className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Enter Target URL
            </h2>
            <p className="text-gray-400">
              Start by entering the URL of the web application you want to test
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-400 mb-2">
                Target URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 backdrop-blur-sm transition-all duration-200"
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <FiGlobe className="text-gray-400" />
                </div>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/25"
            >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Start Security Scan</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-obsidian/50 rounded-lg border border-red-900/30 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-2">
            What we'll check:
          </h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>Security headers (CSP, X-Frame-Options, HSTS)</li>
            <li>Server header exposure</li>
            <li>SSL/TLS configuration</li>
            <li>Basic security misconfigurations</li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
}
