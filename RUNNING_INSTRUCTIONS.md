# How to Run the Markov Chain Simulator

This guide provides step-by-step instructions to run both the backend and frontend of the Markov Chain Simulator application.

## Prerequisites

- Python 3.8+ (for the backend)
- Node.js and npm (for the frontend)
- A modern web browser

## Running the Backend

1. **Activate the virtual environment**

   ```
   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1

   # Windows (Command Prompt)
   .\venv\Scripts\activate.bat

   # macOS/Linux
   source venv/bin/activate
   ```

   You should see `(venv)` at the beginning of your command prompt.

2. **Navigate to the backend directory**

   ```
   cd backend
   ```

3. **Start the backend server**

   ```
   python main.py
   ```

   The server will start on http://localhost:8000

## Running the Frontend

1. **Open a new terminal window**

2. **Navigate to the frontend directory**

   ```
   cd frontend
   ```

3. **Start the frontend development server**

   ```
   npm run dev
   ```

   The frontend will be available at http://localhost:3001

## Using the Application

1. Open your web browser and navigate to http://localhost:3001

2. **Creating a Markov Chain**:
   - Click on the canvas to create nodes
   - Select a node and click "Create Edge" to create connections
   - Set probabilities for nodes and edges

3. **Running the Simulation**:
   - Click "Run Simulation" to compute the Markov chain evolution
   - Use the playback controls to visualize the simulation steps

## Troubleshooting

- **Port conflicts**: If port 8000 or 3001 is already in use, you may need to modify the port settings in:
  - Backend: `backend/main.py`
  - Frontend: `frontend/vite.config.js`

- **API connection issues**: Ensure the backend server is running before using the frontend

- **Package issues**: If you encounter package errors, try:
  ```
  # Backend
  pip install -r backend/requirements.txt

  # Frontend
  cd frontend
  npm install
  ```

## Stopping the Servers

To stop either server, press `Ctrl+C` in the respective terminal window. 