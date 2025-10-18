#!/bin/bash

# Build the frontend
npm run build

# Start the preview server
npm run preview -- --host 0.0.0.0 --port $PORT
