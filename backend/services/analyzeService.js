const securityData = require('../data/securityData.json');

const analyzeFeatures = async (features) => {
  try {
    const results = {
      tests: [],
      payloads: [],
      explanations: []
    };

    features.forEach(feature => {
      const featureData = securityData[feature];
      if (featureData) {
        results.tests.push(...(featureData.tests || []));
        results.payloads.push(...(featureData.payloads || []));
        results.explanations.push(...(featureData.explanations || []));
      }
    });

    // Remove duplicates
    results.tests = [...new Set(results.tests)];
    results.payloads = [...new Set(results.payloads)];
    results.explanations = [...new Set(results.explanations)];

    return results;
  } catch (error) {
    console.error('Analyze service error:', error);
    throw new Error('Failed to analyze features');
  }
};

module.exports = {
  analyzeFeatures
};
