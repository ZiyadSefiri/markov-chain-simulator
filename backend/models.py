from pydantic import BaseModel, validator
from typing import List, Optional, Tuple
import numpy as np

class Position(BaseModel):
    x: float
    y: float

class NodeData(BaseModel):
    id: str
    position: Position
    probability: float
    
    @validator('probability')
    def validate_probability(cls, v):
        if v < 0 or v > 1:
            raise ValueError('Probability must be between 0 and 1')
        return v

class EdgeData(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    probability: float
    
    @validator('probability')
    def validate_probability(cls, v):
        if v < 0 or v > 1:
            raise ValueError('Probability must be between 0 and 1')
        return v

class SimulationRequest(BaseModel):
    nodes: List[NodeData]
    edges: List[EdgeData]

class SimulationStep(BaseModel):
    step: int
    nodes: List[NodeData]

class SimulationResponse(BaseModel):
    steps: List[SimulationStep]
    normalized_nodes: List[NodeData]
    warnings: List[str]

class ValidationWarning(BaseModel):
    node_id: str
    message: str
    current_sum: float 