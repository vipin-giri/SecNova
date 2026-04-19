const analyzeService = require('../services/analyzeService');

const analyzeFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    
    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: 'Features array is required' });
    }

    const results = await analyzeService.analyzeFeatures(features);
    res.json(results);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error during analysis' });
  }
};

module.exports = {
  analyzeFeatures
};
