# Backend API

Simple Express.js backend API for DevOps CI/CD learning project.

## Application Structure

```
CICD-PROJECT/
|src/
    ├── app.js           # Main application file
    ├── test.js          # Simple test file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Endpoints

- `GET /` - Root endpoint with API information
- `GET /health` - Health check endpoint
- `GET /api` - Main API endpoint
- `GET /api/users` - Get users list (mock data)
- `GET /api/info` - System information

## Environment Variables

- `PORT` - Server port (default: 3000)
- `VERSION` - Application version (default: 1.0.0)
- `ENVIRONMENT` - Environment name (default: development)

## Running Locally

### Without Docker

```bash
# Install dependencies
npm install

# Run application
npm start

# Run in development mode (with auto-reload)
npm run dev

# Run tests
npm test
```

### With Docker (Your Challenge!)

Create your own `Dockerfile` that:

1. Uses Node.js Alpine base image (node:20-alpine recommended)
2. Sets working directory
3. Copies package files and installs dependencies
4. Copies application code
5. Exposes port 3000
6. Runs the application

**Build and run:**
```bash
# Build image
docker build -t my-backend:1.0 .

# Run container
docker run -p 3000:3000 my-backend:1.0

# Test
curl http://localhost:3000/health
```

## Testing the API

```bash
# Health check
curl http://localhost:3000/health

# Root endpoint
curl http://localhost:3000/

# API endpoint
curl http://localhost:3000/api

# Users endpoint
curl http://localhost:3000/api/users

# System info
curl http://localhost:3000/api/info
```

## Docker Build Tips

Consider these best practices when creating your Dockerfile:

1. **Multi-stage builds** - Separate build and runtime stages
2. **Layer optimization** - Copy package.json first, then source code
3. **Use .dockerignore** - Exclude node_modules, .git, etc.
4. **Non-root user** - Run as non-privileged user for security
5. **Health check** - Add HEALTHCHECK instruction
6. **Small image size** - Use Alpine base image
7. **Production dependencies** - Use `npm ci --only=production`

## Expected Output

When running successfully, you should see:

```
=================================
🚀 Backend API Server Started
=================================
📍 URL: http://localhost:3000
🌍 Environment: development
📦 Version: 1.0.0
⚙️  Node: v20.x.x
=================================
```

## Dockerfile Challenges

Try to achieve these goals with your Dockerfile:

### Beginner Level
- ✅ Application runs successfully
- ✅ All dependencies installed
- ✅ Port 3000 exposed
- ✅ Image builds without errors

### Intermediate Level
- ✅ Multi-stage build
- ✅ Production dependencies only
- ✅ Image size under 150MB
- ✅ .dockerignore file created

### Advanced Level
- ✅ Non-root user
- ✅ HEALTHCHECK instruction
- ✅ Image size under 100MB
- ✅ Build-time arguments for VERSION
- ✅ Proper layer caching

Good luck! 🐳