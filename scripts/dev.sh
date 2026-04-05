#!/bin/bash
# Start both frontend and backend in development mode
echo "Starting Fieldcraft Digital development servers..."
npx concurrently \
  --names "FRONT,BACK" \
  --prefix-colors "cyan,green" \
  "npm run dev -w frontend" \
  "npm run dev -w backend"
