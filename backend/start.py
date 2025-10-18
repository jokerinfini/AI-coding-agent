#!/usr/bin/env python3
"""
Railway startup script for AI Coding Agent backend
"""
import subprocess
import sys
import os

def main():
    # Ensure we're in the right directory
    os.chdir('/app')
    
    # Install dependencies if needed (Railway should handle this, but just in case)
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                       check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        print(f"Warning: pip install failed: {e}")
    
    # Start the uvicorn server
    cmd = [
        sys.executable, '-m', 'uvicorn', 
        'app.main:app', 
        '--host', '0.0.0.0', 
        '--port', os.environ.get('PORT', '8000')
    ]
    
    print(f"Starting server with command: {' '.join(cmd)}")
    subprocess.run(cmd)

if __name__ == '__main__':
    main()
