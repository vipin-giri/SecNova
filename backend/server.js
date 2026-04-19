const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const scanRoutes = require('./routes/scan');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scan', scanRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SecNova API is running' });
});

app.listen(PORT, () => {
  console.log(`SecNova API server running on port ${PORT}`);
});

module.exports = app;
