'use client';

import { useState, useEffect } from 'react';
import URLInput from '@/components/URLInput';
import ComprehensiveFeatureSelector from '@/components/ComprehensiveFeatureSelector';
import OutputPanel from '@/components/OutputPanel';
import HeaderAnalysis from '@/components/HeaderAnalysis';
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

  /* 🔥 Smooth Flip + Scale */
  @keyframes floatScale {
    0%,100% { transform: scale(1) rotateY(0deg); }
    50% { transform: scale(1.05) rotateY(180deg); }
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }

  .floating-bit { animation: float 6s ease-in-out infinite; }
  .pulsing-bit { animation: pulse 4s ease-in-out infinite; }

  .flipping-favicon {
    animation: floatScale 12s ease-in-out infinite;
  }
`;

/* ================== TYPES ================== */
interface ScanResult {
  headers: {
    [key: string]: string;
    'content-security-policy'?: string;
    'strict-transport-security'?: string;
    'x-frame-options'?: string;
    'x-content-type-options'?: string;
    'referrer-policy'?: string;
    'permissions-policy'?: string;
    'x-xss-protection'?: string;
    'cache-control'?: string;
    'server'?: string;
    'x-powered-by'?: string;
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
    window.history.pushState({ step: 2 }, '', '#step2');
  };

  const handleFeatureSelection = (features: string[]) => {
    setSelectedFeatures(features);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentStep(4);
    window.history.pushState({ step: 4 }, '', '#step4');
  };

  const goBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      // Update URL hash for history tracking
      window.history.pushState({ step: newStep }, '', `#step${newStep}`);
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        setCurrentStep(event.state.step);
      } else {
        // If no state, go back to step 1 (login)
        setCurrentStep(1);
      }
    };

    // Handle initial hash
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#step')) {
        const step = parseInt(hash.replace('#step', ''));
        if (step >= 1 && step <= 4) {
          setCurrentStep(step);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update history when step changes
  useEffect(() => {
    if (currentStep > 1) {
      window.history.replaceState({ step: currentStep }, '', `#step${currentStep}`);
    } else {
      window.history.replaceState({ step: 1 }, '', window.location.pathname);
    }
  }, [currentStep]);

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

        {/* 🔥 BIG CENTER FLIPPING LOGO */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/favicon.png"
            className="w-[1200px] h-[1200px] object-contain opacity-20 flipping-favicon drop-shadow-[0_0_80px_rgba(239,68,68,0.25)]"
            alt="bg"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* ===== HEADER ===== */}
        <header className="fixed top-0 left-0 right-0 z-50 h-24 border-b border-red-900/30 bg-black/60 backdrop-blur-md shadow-lg shadow-red-900/10">
          <div className="w-full px-6 h-full flex items-center justify-between">
            
            <div className="h-full flex items-center">
              <img
                src="/logo.png"
                className="h-full w-auto object-contain"
                alt="SecNova Logo"
              />
            </div>

            <h1 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-red-500 via-black to-red-700 bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientMove_4s_linear_infinite]">
              Precision Web Security Analysis
            </h1>
          </div>
        </header>

        {/* ===== PROGRESS BAR ===== */}
        <div className="fixed top-24 left-0 right-0 z-40 border-b border-red-900/40 bg-black/70 backdrop-blur-sm">
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

        {/* ===== CONTENT ===== */}
        <div className="relative z-10 w-full px-6 pt-44 pb-10 min-h-screen">

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
                <HeaderAnalysis 
                  scanResult={scanResult} 
                  onReScan={() => setCurrentStep(1)}
                />
                <ComprehensiveFeatureSelector
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