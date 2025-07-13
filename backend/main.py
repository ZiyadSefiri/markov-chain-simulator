from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import SimulationRequest, SimulationResponse
from markov_simulator import MarkovChainSimulator
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Markov Chain Simulator API",
    description="Backend API for the Markov Chain Simulator",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global simulator instance
simulator = MarkovChainSimulator()

@app.get("/")
async def root():
    """Root endpoint for health check"""
    return {"message": "Markov Chain Simulator API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "markov-chain-simulator"}

@app.post("/simulate", response_model=SimulationResponse)
async def simulate_markov_chain(request: SimulationRequest):
    """
    Simulate a Markov chain for 20 steps
    
    Args:
        request: SimulationRequest containing nodes and edges
        
    Returns:
        SimulationResponse containing the simulation steps, normalized nodes, and warnings
    """
    try:
        logger.info(f"Received simulation request with {len(request.nodes)} nodes and {len(request.edges)} edges")
        
        # Validate input
        if not request.nodes:
            raise HTTPException(status_code=400, detail="At least one node is required")
        
        # Process the simulation
        result = simulator.process_simulation_request(request)
        
        logger.info(f"Simulation completed with {len(result.steps)} steps and {len(result.warnings)} warnings")
        
        return result
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/validate")
async def validate_markov_chain(request: SimulationRequest):
    """
    Validate a Markov chain configuration without running simulation
    
    Args:
        request: SimulationRequest containing nodes and edges
        
    Returns:
        Validation result with warnings
    """
    try:
        logger.info(f"Received validation request with {len(request.nodes)} nodes and {len(request.edges)} edges")
        
        # Create a temporary simulator instance for validation
        temp_simulator = MarkovChainSimulator()
        temp_simulator.nodes = request.nodes
        temp_simulator.edges = request.edges
        temp_simulator.warnings = []
        
        # Run validation steps
        normalized_nodes = temp_simulator._normalize_node_probabilities()
        temp_simulator._validate_and_complete_edges()
        
        return {
            "valid": True,
            "normalized_nodes": normalized_nodes,
            "warnings": temp_simulator.warnings,
            "completed_edges": temp_simulator.edges
        }
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return {
            "valid": False,
            "error": str(e),
            "warnings": []
        }
    except Exception as e:
        logger.error(f"Unexpected error during validation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 