# Complete Setup Guide for Markov Chain Simulator

This guide provides detailed instructions to set up and run the Markov Chain Simulator application, including troubleshooting steps for common issues.

## Prerequisites

- Python 3.8+ (for the backend)
- Node.js 14+ and npm (for the frontend)
- A modern web browser

## Step 1: Set Up the Virtual Environment

```powershell
# Navigate to the project root
cd C:\Users\PRO\Markov_Chain_Simulator

# Create a virtual environment (if not already created)
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1
```

You should see `(venv)` at the beginning of your command prompt.

## Step 2: Install Backend Dependencies

```powershell
# Navigate to the backend directory
cd backend

# Install required packages
pip install fastapi uvicorn pydantic numpy python-multipart
```

## Step 3: Start the Backend Server

```powershell
# Make sure you're in the backend directory
cd C:\Users\PRO\Markov_Chain_Simulator\backend

# Start the server
python main.py
```

The server should start and display:
```
INFO:     Started server process [...]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Keep this terminal window open.

## Step 4: Set Up the Frontend

Open a new terminal window and:

```powershell
# Navigate to the frontend directory
cd C:\Users\PRO\Markov_Chain_Simulator\frontend

# Install dependencies
npm install
```

## Step 5: Start the Frontend Server

```powershell
# Make sure you're in the frontend directory
cd C:\Users\PRO\Markov_Chain_Simulator\frontend

# Start the development server
npm run dev
```

You should see output like:
```
> frontend@1.0.0 dev
> vite

VITE v7.0.4 ready in XXX ms
➜  Local:   http://localhost:3002/
➜  Network: http://192.168.XXX.XXX:3002/
```

## Step 6: Access the Application

Open your web browser and navigate to:
```
http://localhost:3002
```

## Troubleshooting

### 1. Port Conflicts

If you see "Port XXXX is in use, trying another one...", you have two options:

a) Use the automatically assigned port (check the terminal output for the new URL)

b) Update the port in the configuration:
   - Edit `frontend/vite.config.js` and change the port number
   - Restart the frontend server

### 2. Backend Connection Issues

If the frontend can't connect to the backend:

a) Make sure the backend server is running at http://localhost:8000

b) Check the API base URL in `frontend/src/App.jsx`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000'
   ```

c) Check for CORS issues in the browser console (F12)

### 3. Missing Dependencies

If you see errors about missing packages:

```powershell
# For backend
pip install -r backend/requirements.txt

# For frontend
npm install
```

### 4. React Rendering Issues

If you see React-related errors:

```powershell
# Try downgrading React to a stable version
npm install react@18.2.0 react-dom@18.2.0
```

### 5. File Not Found Errors

Ensure all required files exist:

```powershell
# Check frontend structure
dir frontend\src
dir frontend\public
```

The structure should include:
- `src/index.jsx`
- `src/App.jsx`
- `src/components/` with all component files
- `public/index.html`

### 6. Blank Screen Issues

If you see a blank screen:

a) Check the browser console (F12) for errors

b) Verify the root element exists:
   ```html
   <!-- in public/index.html -->
   <div id="root"></div>
   ```

c) Check that the correct entry point is specified:
   ```html
   <script type="module" src="/src/index.jsx"></script>
   ```

## Complete Application Flow

1. **Backend (http://localhost:8000)**
   - Handles API requests
   - Performs Markov chain calculations
   - Returns simulation results

2. **Frontend (http://localhost:3002)**
   - Provides the user interface
   - Sends requests to the backend
   - Visualizes the Markov chain and simulation results

## Stopping the Application

To stop the servers:

1. Press `Ctrl+C` in each terminal window
2. Deactivate the virtual environment with `deactivate` 