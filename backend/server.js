const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const scanRoutes = require('./routes/scan');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());

// CORS configuration - allow frontend domain
const corsOptions = {
  origin: [
    'https://sec-nova.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

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
