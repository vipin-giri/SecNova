const scanService = require('../services/scanService');

const performScan = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const results = await scanService.scanHeaders(url);
    res.json(results);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Internal server error during scan' });
  }
};

module.exports = {
  performScan
};
