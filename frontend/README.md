# Markov Chain Simulator Frontend

React frontend for the Markov Chain Simulator application.

## Features

- **Interactive Canvas**: Click to place nodes and create edges between them
- **Node Management**: Set probabilities for each node, view normalized values
- **Edge Creation**: Create directed edges between nodes with custom probabilities
- **Automatic Validation**: Warns when edge probabilities exceed 1.0, auto-completes to 1.0
- **Real-time Simulation**: Visualize 20-step Markov chain evolution
- **Animated Visualization**: Node sizes change based on probability during simulation
- **Playback Controls**: Step through simulation manually or play automatically
- **Responsive Design**: Works on desktop and mobile devices

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Creating a Markov Chain

1. **Add Nodes**: Click on empty space in the canvas to create a new node
2. **Set Probabilities**: Use the controls panel to set initial probabilities for each node
3. **Create Edges**: 
   - Select a node by clicking on it
   - Click "Create Edge" in the controls panel
   - Click on another node to create a directed edge
   - Set the edge probability when prompted

### Running Simulation

1. **Normalize**: The system automatically normalizes node probabilities to sum to 1
2. **Validate**: Warnings appear if edge probabilities don't sum correctly
3. **Simulate**: Click "Run Simulation" to compute 20 steps of the Markov chain
4. **Visualize**: Watch nodes grow and shrink based on their probabilities
5. **Control Playback**: Use the playback controls to step through or play the simulation

### Controls

- **Node Management**: Edit probabilities, view outgoing edge totals, delete nodes
- **Edge Management**: Edit edge probabilities, view connections, delete edges
- **Warnings**: View validation warnings about probability distributions
- **Simulation**: Run simulation and clear all data

## Components

### App.jsx
Main application component that manages state and coordinates between child components.

### MarkovCanvas.jsx
Interactive canvas component for node placement and edge creation using HTML5 Canvas.

### Controls.jsx
Control panel for managing nodes, edges, and simulation settings.

### SimulationDisplay.jsx
Displays simulation results with playback controls and detailed step information.

## API Integration

The frontend communicates with the FastAPI backend via REST endpoints:

- `POST /simulate` - Run Markov chain simulation
- `GET /validate` - Validate chain configuration
- `GET /health` - Backend health check

## Animations

- **Node Size Animation**: Nodes grow/shrink based on probability during simulation
- **Edge Visualization**: Edges show probability through line thickness
- **Smooth Transitions**: Animated transitions between simulation steps
- **Interactive Feedback**: Visual feedback for user interactions

## Build

To build for production:
```bash
npm run build
```

Built files will be in the `dist` directory.

## Dependencies

- **React**: UI framework
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API calls
- **HTML5 Canvas**: For interactive node/edge visualization

## Browser Support

- Modern browsers with ES6+ support
- HTML5 Canvas support required
- Responsive design for mobile devices 