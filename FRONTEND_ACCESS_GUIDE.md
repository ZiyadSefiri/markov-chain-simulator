# Accessing the Markov Chain Simulator Frontend

The frontend server is now running on port 5173. Follow these steps to access it:

## 1. Make sure both servers are running

You should have two terminal windows open:

- **Terminal 1**: Running the backend server on port 8000
  ```
  cd C:\Users\PRO\Markov_Chain_Simulator\backend
  python main.py
  ```

- **Terminal 2**: Running the frontend server on port 5173
  ```
  cd C:\Users\PRO\Markov_Chain_Simulator\frontend
  npm run dev -- --strictPort --port 5173
  ```

## 2. Access the frontend in your browser

Open your web browser and navigate to:
```
http://localhost:5173
```

## 3. If you still can't access the frontend

Try these troubleshooting steps:

1. **Check if the server is running**
   - Look at the terminal where you ran `npm run dev`
   - You should see: `VITE v7.0.4 ready in XXXX ms`
   - And: `Local: http://localhost:5173/`

2. **Try a different browser**
   - Sometimes browser cache or extensions can cause issues
   - Try Chrome, Firefox, or Edge

3. **Check your network connection**
   - Make sure your computer's network settings allow localhost connections
   - Try disabling any VPN or proxy services temporarily

4. **Check your firewall settings**
   - Windows Firewall might be blocking the connection
   - Add an exception for Node.js or for port 5173

5. **Try with the IP address instead of localhost**
   - Instead of `http://localhost:5173`, try `http://127.0.0.1:5173`

6. **Restart the frontend server with the host flag**
   - Stop the current server with Ctrl+C
   - Restart with: `npm run dev -- --host --strictPort --port 5173`
   - This will expose the server on your network IP as well

7. **Check for errors in the browser console**
   - Open browser developer tools (F12)
   - Look for any errors in the Console tab

## 4. Using the application

Once you can access the frontend:

1. Click on the canvas to create nodes
2. Select nodes and create edges between them
3. Set probabilities for nodes and edges
4. Click "Run Simulation" to see the Markov chain evolution

Remember that the frontend communicates with the backend at http://localhost:8000, so both servers need to be running for the application to work properly. 