#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/frontend"

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Setup complete. To develop, run: cd frontend && npm run dev"
