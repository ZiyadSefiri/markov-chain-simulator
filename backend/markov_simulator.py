import numpy as np
from typing import List, Dict, Tuple
from models import NodeData, EdgeData, SimulationRequest, SimulationResponse, SimulationStep, Position
import copy

class MarkovChainSimulator:
    def __init__(self):
        self.nodes: List[NodeData] = []
        self.edges: List[EdgeData] = []
        self.transition_matrix: np.ndarray = None
        self.warnings: List[str] = []
    
    def process_simulation_request(self, request: SimulationRequest) -> SimulationResponse:
        """Process a simulation request and return the simulation results"""
        self.nodes = request.nodes
        self.edges = request.edges
        self.warnings = []
        
        # Step 1: Normalize node probabilities
        normalized_nodes = self._normalize_node_probabilities()
        
        # Step 2: Validate and complete edges
        self._validate_and_complete_edges()
        
        # Step 3: Build transition matrix
        self._build_transition_matrix()
        
        # Step 4: Run simulation for 20 steps
        steps = self._run_simulation(20)
        
        return SimulationResponse(
            steps=steps,
            normalized_nodes=normalized_nodes,
            warnings=self.warnings
        )
    
    def _normalize_node_probabilities(self) -> List[NodeData]:
        """Normalize node probabilities so they sum to 1"""
        if not self.nodes:
            return []
        
        # Calculate total probability
        total_prob = sum(node.probability for node in self.nodes)
        
        if total_prob == 0:
            # If all probabilities are 0, set them all to equal values
            equal_prob = 1.0 / len(self.nodes)
            normalized_nodes = []
            for node in self.nodes:
                normalized_node = copy.deepcopy(node)
                normalized_node.probability = equal_prob
                normalized_nodes.append(normalized_node)
            self.warnings.append("All node probabilities were 0, set to equal distribution")
        else:
            # Normalize probabilities
            normalized_nodes = []
            for node in self.nodes:
                normalized_node = copy.deepcopy(node)
                normalized_node.probability = node.probability / total_prob
                normalized_nodes.append(normalized_node)
        
        # Update internal nodes list
        self.nodes = normalized_nodes
        return normalized_nodes
    
    def _validate_and_complete_edges(self):
        """Validate edges and complete them if they don't sum to 1"""
        node_dict = {node.id: node for node in self.nodes}
        
        # Group edges by sender
        edges_by_sender: Dict[str, List[EdgeData]] = {}
        for edge in self.edges:
            if edge.sender_id not in edges_by_sender:
                edges_by_sender[edge.sender_id] = []
            edges_by_sender[edge.sender_id].append(edge)
        
        # Check each node's outgoing edges
        for node in self.nodes:
            outgoing_edges = edges_by_sender.get(node.id, [])
            total_outgoing_prob = sum(edge.probability for edge in outgoing_edges)
            
            if total_outgoing_prob > 1.0:
                # Warn if outgoing edges sum to more than 1
                self.warnings.append(f"Node {node.id} has outgoing edges that sum to {total_outgoing_prob:.3f} (> 1.0)")
            elif total_outgoing_prob < 1.0:
                # Complete to 1 with a self-loop
                self_loop_prob = 1.0 - total_outgoing_prob
                if self_loop_prob > 0:
                    # Check if there's already a self-loop
                    existing_self_loop = None
                    for edge in outgoing_edges:
                        if edge.receiver_id == node.id:
                            existing_self_loop = edge
                            break
                    
                    if existing_self_loop:
                        # Update existing self-loop
                        existing_self_loop.probability += self_loop_prob
                    else:
                        # Create new self-loop
                        self_loop = EdgeData(
                            id=f"self_loop_{node.id}",
                            sender_id=node.id,
                            receiver_id=node.id,
                            probability=self_loop_prob
                        )
                        self.edges.append(self_loop)
                        edges_by_sender[node.id].append(self_loop)
    
    def _build_transition_matrix(self):
        """Build the transition matrix from nodes and edges"""
        if not self.nodes:
            self.transition_matrix = np.array([])
            return
        
        n = len(self.nodes)
        self.transition_matrix = np.zeros((n, n))
        
        # Create node index mapping
        node_to_index = {node.id: i for i, node in enumerate(self.nodes)}
        
        # Fill transition matrix
        for edge in self.edges:
            sender_idx = node_to_index[edge.sender_id]
            receiver_idx = node_to_index[edge.receiver_id]
            self.transition_matrix[sender_idx][receiver_idx] = edge.probability
    
    def _run_simulation(self, steps: int) -> List[SimulationStep]:
        """Run the Markov chain simulation for the specified number of steps"""
        if not self.nodes or self.transition_matrix is None:
            return []
        
        # Initial distribution (normalized node probabilities)
        current_distribution = np.array([node.probability for node in self.nodes])
        
        simulation_steps = []
        
        # Add initial state
        initial_nodes = []
        for i, node in enumerate(self.nodes):
            node_copy = copy.deepcopy(node)
            node_copy.probability = current_distribution[i]
            initial_nodes.append(node_copy)
        
        simulation_steps.append(SimulationStep(step=0, nodes=initial_nodes))
        
        # Run simulation
        for step in range(1, steps + 1):
            # Update distribution: new_distribution = current_distribution * transition_matrix
            current_distribution = current_distribution @ self.transition_matrix
            
            # Create nodes for this step
            step_nodes = []
            for i, node in enumerate(self.nodes):
                node_copy = copy.deepcopy(node)
                node_copy.probability = current_distribution[i]
                step_nodes.append(node_copy)
            
            simulation_steps.append(SimulationStep(step=step, nodes=step_nodes))
        
        return simulation_steps 