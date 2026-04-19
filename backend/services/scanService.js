const axios = require('axios');
const https = require('https');

const scanHeaders = async (url) => {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Make actual HTTP request to get real headers
    const response = await axios.head(url, {
      timeout: 10000,
      validateStatus: () => true, // Accept any status code
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Allow self-signed certificates for scanning
      })
    });

    const headers = response.headers;
    const issues = [];

    // Extract security headers
    const securityHeaders = {
      'content-security-policy': headers['content-security-policy'] || '',
      'strict-transport-security': headers['strict-transport-security'] || '',
      'x-frame-options': headers['x-frame-options'] || '',
      'x-content-type-options': headers['x-content-type-options'] || '',
      'referrer-policy': headers['referrer-policy'] || '',
      'permissions-policy': headers['permissions-policy'] || '',
      'x-xss-protection': headers['x-xss-protection'] || '',
      'cache-control': headers['cache-control'] || '',
      'server': headers['server'] || '',
      'x-powered-by': headers['x-powered-by'] || ''
    };

    // Check for missing headers and generate issues
    if (!securityHeaders['content-security-policy']) {
      issues.push("Missing Content Security Policy - vulnerable to XSS attacks");
    }
    if (!securityHeaders['strict-transport-security']) {
      issues.push("Missing HTTP Strict Transport Security - vulnerable to protocol downgrade attacks");
    }
    if (!securityHeaders['x-frame-options']) {
      issues.push("Missing X-Frame-Options - vulnerable to clickjacking");
    }
    if (!securityHeaders['x-content-type-options']) {
      issues.push("Missing X-Content-Type-Options - vulnerable to MIME sniffing");
    }
    if (!securityHeaders['referrer-policy']) {
      issues.push("Missing Referrer Policy - may leak sensitive information");
    }
    if (!securityHeaders['permissions-policy']) {
      issues.push("Missing Permissions Policy - may expose sensitive browser features");
    }
    if (!securityHeaders['x-xss-protection']) {
      issues.push("Missing X-XSS-Protection - limited XSS filtering");
    }
    if (securityHeaders['x-powered-by']) {
      issues.push(`X-Powered-By exposes technology: ${securityHeaders['x-powered-by']}`);
    }

    return {
      headers: securityHeaders,
      issues: issues,
      server: securityHeaders['server'] || 'Unknown',
      ssl: {
        valid: url.startsWith('https://'),
        issuer: url.startsWith('https://') ? 'HTTPS Enabled' : 'HTTP Only'
      }
    };
  } catch (error) {
    console.error('Scan service error:', error);
    
    // Return error response but don't crash
    return {
      headers: {
        'content-security-policy': '',
        'strict-transport-security': '',
        'x-frame-options': '',
        'x-content-type-options': '',
        'referrer-policy': '',
        'permissions-policy': '',
        'x-xss-protection': '',
        'cache-control': '',
        'server': '',
        'x-powered-by': ''
      },
      issues: [`Failed to scan URL: ${error.message}`],
      server: 'Unknown',
      ssl: {
        valid: false,
        issuer: 'Connection Failed'
      }
    };
  }
};

module.exports = {
  scanHeaders
};
