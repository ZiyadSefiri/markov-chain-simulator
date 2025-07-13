# How to Access the Markov Chain Simulator Frontend

We've created multiple ways to access the frontend. Please follow the steps below to find the method that works best for you.

## Option 1: Simple HTML Version (Recommended)

We've created a simplified HTML version that doesn't require complex build tools:

1. Make sure the backend server is running:
   ```
   cd C:\Users\PRO\Markov_Chain_Simulator\backend
   python main.py
   ```
   
2. In a new terminal window, start the simple HTTP server:
   ```
   cd C:\Users\PRO\Markov_Chain_Simulator\frontend
   npx serve public -l 8080
   ```

3. Open your browser and go to:
   ```
   http://localhost:8080/simple-app.html
   ```

This simplified version provides all the core functionality without requiring React or complex build tools.

## Option 2: Test Page

To verify that the server is working correctly:

1. With the server running (from Option 1), visit:
   ```
   http://localhost:8080/test.html
   ```

2. Click the "Test Backend Connection" button to verify that your backend is accessible.

## Option 3: Try Different Ports

If you're having issues with specific ports:

1. Try these alternative URLs:
   ```
   http://127.0.0.1:8080/simple-app.html
   http://localhost:5173
   http://localhost:5174
   ```

2. Check your terminal output for the actual URL where the server is running.

## Option 4: Use a Different Browser

Sometimes browser extensions or cache issues can cause problems:

1. Try using a different browser (Chrome, Firefox, Edge, etc.)
2. Or try using an incognito/private window

## Troubleshooting

If you're still having issues:

1. **Check the backend server** - Make sure it's running at http://localhost:8000

2. **Check for firewall issues** - Windows Firewall might be blocking connections

3. **Look for console errors** - Open browser developer tools (F12) and check the Console tab

4. **Try with IP address** - Use http://127.0.0.1:8080 instead of localhost

5. **Check network settings** - Disable any VPN or proxy services temporarily

## Next Steps

Once you can access the frontend:

1. Click on the canvas to create nodes
2. Select nodes and create edges between them
3. Set probabilities for nodes and edges
4. Click "Run Simulation" to see the Markov chain evolution 