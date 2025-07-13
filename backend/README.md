# Markov Chain Simulator Backend

FastAPI backend for the Markov Chain Simulator application.

## Features

- RESTful API for Markov chain simulation
- Automatic probability normalization
- Edge validation and completion
- 20-step simulation with transition matrices
- CORS support for React frontend

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Running the Server

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## API Endpoints

### POST `/simulate`
Run a Markov chain simulation for 20 steps.

**Request Body:**
```json
{
  "nodes": [
    {
      "id": "node1",
      "position": {"x": 100, "y": 100},
      "probability": 0.5
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "sender_id": "node1",
      "receiver_id": "node2",
      "probability": 0.3
    }
  ]
}
```

**Response:**
```json
{
  "steps": [...],
  "normalized_nodes": [...],
  "warnings": [...]
}
```

### GET `/validate`
Validate a Markov chain configuration without running simulation.

### GET `/health`
Health check endpoint.

## Features

- **Probability Normalization**: Node probabilities are automatically normalized to sum to 1
- **Edge Validation**: Warns if outgoing edges sum to more than 1
- **Edge Completion**: Automatically adds self-loops to complete probabilities to 1
- **Transition Matrix**: Builds and uses transition matrices for simulation
- **Error Handling**: Comprehensive error handling and logging 