const express = require('express');
const cors = require('cors');
const https = require('https');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Keep Render free tier awake — ping every 14 minutes
const RENDER_URL = 'https://task-manager-api-t14k.onrender.com';
setInterval(() => {
  https.get(RENDER_URL, (res) => {
    console.log(`Keep-alive ping: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log('Keep-alive ping failed:', err.message);
  });
}, 14 * 60 * 1000);