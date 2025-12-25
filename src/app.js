const express = require('express');
const app = express();

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const VERSION = process.env.VERSION || '1.0.0';
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: ENVIRONMENT,
    version: VERSION,
    nodeVersion: process.version
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevOps Backend API',
    version: VERSION,
    environment: ENVIRONMENT,
    endpoints: {
      health: '/health',
      api: '/api',
      users: '/api/users',
      info: '/api/info'
    }
  });
});

// API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from Local DevOps Setup!',
    environment: ENVIRONMENT,
    version: VERSION,
    deployment: 'Minikube + Jenkins + ArgoCD',
    timestamp: new Date().toISOString()
  });
});

// Users endpoint (mock data)
app.get('/api/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Developer' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'DevOps' }
    ],
    count: 3,
    environment: ENVIRONMENT,
    version: VERSION
  });
});

// System info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
      },
      uptime: Math.round(process.uptime()) + 's'
    },
    app: {
      version: VERSION,
      environment: ENVIRONMENT,
      port: PORT
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'The requested endpoint does not exist'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    environment: ENVIRONMENT
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('🚀 Backend API Server Started');
  console.log('=================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${ENVIRONMENT}`);
  console.log(`📦 Version: ${VERSION}`);
  console.log(`⚙️  Node: ${process.version}`);
  console.log('=================================');
});