#!/bin/bash

# CoolRides - Simple App Starter Script
# This script helps you start both backend and frontend easily

echo "=============================================="
echo "🛺 CoolRides App Starter"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the cool-ride directory"
    echo "   Example: cd cool-ride && ./start-app.sh"
    exit 1
fi

# Check if web dependencies are installed
if [ ! -d "web/node_modules" ]; then
    echo "📦 Installing web dependencies..."
    echo "   This may take a minute..."
    cd web && npm install && cd ..
    echo "✅ Web dependencies installed!"
    echo ""
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    echo "   This may take a minute..."
    cd backend && npm install && cd ..
    echo "✅ Backend dependencies installed!"
    echo ""
fi

echo "=============================================="
echo "🚀 Starting CoolRides App"
echo "=============================================="
echo ""
echo "ℹ️  IMPORTANT:"
echo "   - Backend will start on: http://localhost:5000"
echo "   - Frontend will start on: http://localhost:3000"
echo ""
echo "   👉 Visit http://localhost:3000 for your website!"
echo "   👉 DON'T visit port 5000 (that's API only)"
echo ""
echo "=============================================="
echo ""
echo "🔧 Starting in 3 seconds..."
sleep 1
echo "🔧 Starting in 2 seconds..."
sleep 1  
echo "🔧 Starting in 1 second..."
sleep 1
echo ""

# Start both servers in background
echo "🔄 Starting backend server..."
cd backend && npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Log file: backend.log"
echo ""

sleep 3

echo "🔄 Starting frontend server..."
cd ../web && npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Log file: frontend.log"
echo ""

echo "=============================================="
echo "✅ Both servers are starting!"
echo "=============================================="
echo ""
echo "📝 To view logs:"
echo "   - Backend:  tail -f backend.log"
echo "   - Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   - Backend:  kill $BACKEND_PID"
echo "   - Frontend: kill $FRONTEND_PID"
echo "   - OR: Press Ctrl+C and run: killall node"
echo ""
echo "🌐 Your app will open automatically in ~30 seconds"
echo "   URL: http://localhost:3000"
echo ""
echo "=============================================="
echo "🎉 Enjoy your CoolRides app!"
echo "=============================================="

# Wait a bit for servers to start
sleep 25

# Try to open browser (works on some systems)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000 2>/dev/null
elif command -v open > /dev/null; then
    open http://localhost:3000 2>/dev/null
else
    echo "📱 Please open http://localhost:3000 in your browser"
fi

# Keep script running
echo ""
echo "Press Ctrl+C to stop both servers..."
wait
