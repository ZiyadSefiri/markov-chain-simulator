# Markov Chain Simulator - Frontend Access Guide

## Fixed Frontend Access

The frontend has been built and is now being served correctly. You can access it at:

```
http://localhost:3002/public/index.html
```

This will load the React application properly with all assets correctly referenced.

## Alternative Access Methods

If you encounter any issues with the above URL, you can try these alternatives:

1. Direct access to the built HTML file:
   ```
   http://localhost:3002/public/index.html
   ```

2. Access the simple HTML versions:
   ```
   http://localhost:3002/simple-app.html
   http://localhost:3002/test.html
   ```

## Troubleshooting

If you still encounter issues:

1. Make sure the server is running (you should see a message like "Serving at http://localhost:3002")
2. Check that no other service is using port 3002
3. Try a different port by running: `serve -l <port>` (e.g., `serve -l 8080`)
4. Check browser console for specific error messages

## Running the Backend

Remember to run the backend server separately:

```
cd ../backend
python -m uvicorn main:app --reload
```

The backend will be accessible at `http://localhost:8000`.

## Connecting Frontend to Backend

The frontend is configured to connect to the backend at `http://localhost:8000`. If your backend is running on a different port or host, you'll need to update the API URLs in the frontend code. 