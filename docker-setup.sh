#!/bin/bash

# CoolRides Docker Setup Script
# This script helps you set up and run CoolRides with Docker

set -e

echo "🛺 CoolRides Docker Setup"
echo "=========================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed: $(docker --version)"
echo "✅ Docker Compose is installed: $(docker-compose --version)"
echo ""

# Check if .env.docker exists
if [ ! -f ".env.docker" ]; then
    echo "⚠️  .env.docker not found. Creating from template..."
    cat > .env.docker << 'EOF'
# Docker Environment Variables
JWT_SECRET=docker-dev-secret-change-in-production-123456789
JWT_REFRESH_SECRET=docker-dev-refresh-secret-change-in-production-987654321
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
POSTGRES_DB=coolrides_db
POSTGRES_USER=coolrides_user
POSTGRES_PASSWORD=coolrides_pass
API_URL=http://backend:5000/api/v1
SOCKET_URL=http://backend:5000
EOF
    echo "✅ Created .env.docker"
fi

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

# Create web .env if it doesn't exist
if [ ! -f "web/.env" ]; then
    echo "⚠️  web/.env not found. Creating from .env.example..."
    cp web/.env.example web/.env
    echo "✅ Created web/.env"
fi

echo ""
echo "📦 Building Docker images..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose build

echo ""
echo "✅ Build complete!"
echo ""
echo "🚀 Starting services..."
echo ""

docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ CoolRides is now running!"
echo ""
echo "📋 Access your application:"
echo "   - Frontend:  http://localhost:3000"
echo "   - Backend:   http://localhost:5000"
echo "   - Admin:     http://localhost:3001"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
echo "📚 For more information, see DOCKER_SETUP.md"
echo ""
echo "Happy coding! 🛺🇬🇭"
