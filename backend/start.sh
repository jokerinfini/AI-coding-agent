#!/bin/bash

# Ensure we're in the right directory
cd /app

# Install dependencies if not already installed
pip install -r requirements.txt

# Start the application
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
