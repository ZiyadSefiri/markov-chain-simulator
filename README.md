# Markov Chain Simulator

A modern web application for creating, visualizing, and simulating Markov chains. Built with React frontend and FastAPI backend.

## Features

### 🎯 Interactive Chain Creation
- Click-to-place nodes on an interactive canvas
- Create directed edges between nodes with custom probabilities
- Real-time probability validation and normalization
- Visual feedback for node selection and edge creation

### 🔄 Automatic Validation
- Node probabilities automatically normalized to sum to 1
- Edge probability validation with warnings for invalid configurations
- Auto-completion of probability distributions with self-loops

### 📊 Advanced Simulation
- 20-step Markov chain evolution computation
- Real-time visualization of probability changes
- Step-by-step playback with manual and automatic modes
- Detailed step information and statistics

### 🎨 Modern UI/UX
- Responsive design for desktop and mobile
- Smooth animations and transitions
- Interactive canvas with HTML5 Canvas
- Modern React components with CSS styling

## Architecture

```
Markov Chain Simulator/
├── backend/          # FastAPI backend
│   ├── main.py      # FastAPI application
│   ├── models.py    # Pydantic data models
│   └── markov_simulator.py  # Core simulation logic
├── frontend/        # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx         # Main application
│   │   └── index.jsx       # Entry point
│   └── public/     # Static files
└── README.md       # This file
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Creating a Markov Chain

1. **Add Nodes**
   - Click on empty space in the canvas
   - Set initial probability for each node
   - Nodes are automatically normalized to sum to 1

2. **Create Edges**
   - Select a node by clicking on it
   - Click "Create Edge" in the controls
   - Click on target node to create directed edge
   - Set edge probability (0-1)

3. **Validation**
   - System warns if outgoing edges > 1.0
   - Auto-completes edges < 1.0 with self-loops
   - View warnings in the controls panel

### Running Simulation

1. **Setup Complete Chain**
   - Ensure all nodes have probabilities
   - Review edge configurations
   - Check validation warnings

2. **Start Simulation**
   - Click "Run Simulation"
   - Backend computes 20 steps
   - Results sent back to frontend

3. **Visualize Results**
   - Watch nodes grow/shrink based on probabilities
   - Use playback controls to step through
   - View detailed step information

## API Endpoints

### Backend (FastAPI)
- `POST /simulate` - Run 20-step Markov chain simulation
- `GET /validate` - Validate chain configuration
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

### Data Models
- **Node**: ID, position, probability
- **Edge**: ID, sender, receiver, probability
- **Simulation**: Steps with node states over time

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and serialization
- **NumPy**: Matrix operations for Markov chains
- **Uvicorn**: ASGI server

### Frontend
- **React**: UI framework with hooks
- **Vite**: Build tool and development server
- **HTML5 Canvas**: Interactive node/edge visualization
- **Axios**: HTTP client for API communication
- **CSS3**: Modern styling with animations

## Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
python main.py
```

## Mathematical Background

### Markov Chain Theory
- **States**: Nodes represent states in the chain
- **Transition Matrix**: Edges form the transition probability matrix
- **Steady State**: System evolves according to P(t+1) = P(t) × T
- **Normalization**: Probabilities sum to 1 at each step

### Simulation Process
1. Initial distribution from node probabilities
2. Transition matrix from edge probabilities
3. 20 iterations of matrix multiplication
4. Visualization of probability evolution

## Features in Detail

### 🎨 Interactive Canvas
- HTML5 Canvas for smooth interactions
- Click-to-place nodes with custom positioning
- Visual edge creation with temporary line preview
- Node selection highlighting and feedback

### 🔧 Probability Management
- Real-time probability validation
- Automatic normalization algorithms
- Warning system for invalid configurations
- Self-loop completion for incomplete distributions

### 📱 Responsive Design
- Mobile-friendly interface
- Adaptive layout for different screen sizes
- Touch-friendly controls for mobile devices
- Responsive canvas with proper scaling

### 🎬 Animation System
- Smooth node size transitions during simulation
- Animated probability bar updates
- Step-by-step playback controls
- Visual feedback for user interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source. See the LICENSE file for details.

## Future Enhancements

- [ ] Export simulation results to CSV/JSON
- [ ] Import/export chain configurations
- [ ] Additional visualization modes
- [ ] Convergence analysis tools
- [ ] Multiple chain comparison
- [ ] Advanced animation controls

## Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description
4. Provide steps to reproduce any bugs

---

**Built with ❤️ using React and FastAPI** 