'use client';

import { useState } from 'react';
import URLInput from '@/components/URLInput';
import ScanResults from '@/components/ScanResults';
import FeatureSelector from '@/components/FeatureSelector';
import OutputPanel from '@/components/OutputPanel';
import { FiShield, FiLock, FiSearch, FiArrowLeft } from 'react-icons/fi';

/* ================== STYLES ================== */
const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  ::-webkit-scrollbar-thumb {
    background: #ef4444;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #dc2626;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.5; }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .floating-bit { animation: float 6s ease-in-out infinite; }
  .pulsing-bit { animation: pulse 4s ease-in-out infinite; }
  .rotating-favicon { animation: rotate 20s linear infinite; }
`;

/* ================== TYPES ================== */
interface ScanResult {
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
}

interface AnalysisResult {
  tests: string[];
  payloads: string[];
  explanations: string[];
}

/* ================== MAIN ================== */
export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setCurrentStep(2);
  };

  const handleFeatureSelection = (features: string[]) => {
    setSelectedFeatures(features);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentStep(4);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <style jsx global>{scrollbarStyles}</style>

      <main className="min-h-screen bg-black text-white">

        {/* ===== BACKGROUND ===== */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24px,rgba(255,0,0,0.03)_24px,rgba(255,0,0,0.03)_48px,transparent_48px)] bg-[size:48px_48px]"></div>
        </div>

        {/* Floating Bits */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-red-500/30 rounded-full floating-bit"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-red-500/25 rounded-full floating-bit" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-red-500/20 rounded-full floating-bit" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Rotating Background Logo */}
        <div className="fixed inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <img
            src="/favicon.png"
            className="w-[700px] h-[700px] object-contain rotating-favicon"
            alt="bg"
          />
        </div>

        {/* ===== HEADER ===== */}
        <header className="fixed top-0 left-0 right-0 z-50 h-28 border-b border-red-900/30 bg-black/60 backdrop-blur-md shadow-lg shadow-red-900/10">
          <div className="w-full px-6 h-full flex items-center justify-between">

            {/* BIG LOGO */}
            <img
              src="/logo.png"
              className="h-full w-auto object-contain scale-110"
              alt="SecNova Logo"
            />

            {/* Cool Title */}
            <h1 className="text-2xl font-semibold tracking-wide text-red-500">
              Cyber Security Testing Suite
            </h1>

          </div>
        </header>

        {/* ===== PROGRESS BAR ===== */}
        <div className="fixed top-28 left-0 right-0 z-40 border-b border-red-900/40 bg-black/70 backdrop-blur-sm">
          <div className="w-full px-6 py-2">
            <div className="flex items-center justify-between max-w-4xl mx-auto">

              {[
                { icon: <FiSearch />, label: 'Scan', step: 1 },
                { icon: <FiLock />, label: 'Features', step: 2 },
                { icon: <FiShield />, label: 'Results', step: 4 },
              ].map((item, i) => {
                const active = currentStep >= item.step;

                return (
                  <div key={i} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${active ? 'text-red-500' : 'text-gray-600'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                        active ? 'bg-red-500 border-red-500' : 'border-gray-700'
                      }`}>
                        {item.icon}
                      </div>

                      <span className="text-xs font-medium">{item.label}</span>
                    </div>

                    {i !== 2 && (
                      <div className={`w-12 h-[2px] mx-3 ${
                        active ? 'bg-red-500' : 'bg-gray-700'
                      }`}></div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="relative z-10 w-full px-6 pt-48 pb-10 min-h-screen">

          {/* Back Button */}
          {currentStep > 1 && (
            <div className="mb-6">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded border border-gray-800 transition"
              >
                <FiArrowLeft />
                <span>Back</span>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="max-w-6xl mx-auto">

            {currentStep === 1 && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center">
                <h2 className="text-3xl font-bold mb-4">Enter Target URL</h2>
                <p className="text-gray-400 mb-8">Start security analysis</p>
                <URLInput onScanComplete={handleScanComplete} setLoading={setLoading} />
              </div>
            )}

            {currentStep === 2 && scanResult && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <ScanResults result={scanResult} />
                <FeatureSelector
                  onFeaturesSelected={handleFeatureSelection}
                  onAnalysisComplete={handleAnalysisComplete}
                  setLoading={setLoading}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="w-8 h-8 border-2 border-t-red-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Analyzing...</p>
              </div>
            )}

            {currentStep === 4 && analysisResult && (
              <div className="max-w-4xl mx-auto">
                <OutputPanel
                  analysisResult={analysisResult}
                  scanResult={scanResult}
                  selectedFeatures={selectedFeatures}
                />
              </div>
            )}

          </div>
        </div>

      </main>
    </>
  );
}