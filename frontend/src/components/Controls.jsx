import React, { useState } from 'react'
import './Controls.css'

const Controls = ({
  nodes,
  edges,
  selectedNode,
  isCreatingEdge,
  onNodeProbabilityChange,
  onEdgeProbabilityChange,
  onDeleteNode,
  onDeleteEdge,
  onClearAll,
  onCreateEdge,
  onCancelCreateEdge,
  onRunSimulation,
  isSimulating,
  warnings
}) => {
  const [showWarnings, setShowWarnings] = useState(true)

  const handleProbabilityChange = (id, value, type) => {
    const probability = parseFloat(value)
    if (isNaN(probability) || probability < 0 || probability > 1) {
      return
    }
    
    if (type === 'node') {
      onNodeProbabilityChange(id, probability)
    } else if (type === 'edge') {
      onEdgeProbabilityChange(id, probability)
    }
  }

  const getTotalNodeProbability = () => {
    return nodes.reduce((sum, node) => sum + node.probability, 0)
  }

  const getNodeOutgoingProbability = (nodeId) => {
    return edges
      .filter(edge => edge.sender_id === nodeId)
      .reduce((sum, edge) => sum + edge.probability, 0)
  }

  return (
    <div className="controls">
      <h3>Controls</h3>
      
      {/* Node Management */}
      <div className="control-section">
        <h4>Nodes ({nodes.length})</h4>
        <div className="probability-sum">
          Total Probability: {getTotalNodeProbability().toFixed(3)}
        </div>
        
        <div className="nodes-list">
          {nodes.map(node => (
            <div key={node.id} className={`node-item ${selectedNode?.id === node.id ? 'selected' : ''}`}>
              <div className="node-info">
                <strong>{node.id}</strong>
                <span className="node-position">
                  ({node.position.x.toFixed(0)}, {node.position.y.toFixed(0)})
                </span>
              </div>
              <div className="node-controls">
                <label>
                  Probability:
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={node.probability}
                    onChange={(e) => handleProbabilityChange(node.id, e.target.value, 'node')}
                    disabled={isSimulating}
                  />
                </label>
                <button 
                  onClick={() => onDeleteNode(node.id)}
                  className="delete-btn"
                  disabled={isSimulating}
                >
                  Delete
                </button>
              </div>
              <div className="outgoing-info">
                Outgoing: {getNodeOutgoingProbability(node.id).toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edge Management */}
      <div className="control-section">
        <h4>Edges ({edges.length})</h4>
        <div className="edge-actions">
          {selectedNode && !isCreatingEdge && (
            <button 
              onClick={onCreateEdge}
              className="create-edge-btn"
              disabled={isSimulating}
            >
              Create Edge from {selectedNode.id}
            </button>
          )}
          {isCreatingEdge && (
            <button 
              onClick={onCancelCreateEdge}
              className="cancel-edge-btn"
            >
              Cancel Edge Creation
            </button>
          )}
        </div>
        
        <div className="edges-list">
          {edges.map(edge => (
            <div key={edge.id} className="edge-item">
              <div className="edge-info">
                <strong>{edge.id}</strong>
                <span className="edge-direction">
                  {edge.sender_id} → {edge.receiver_id}
                </span>
              </div>
              <div className="edge-controls">
                <label>
                  Probability:
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={edge.probability}
                    onChange={(e) => handleProbabilityChange(edge.id, e.target.value, 'edge')}
                    disabled={isSimulating}
                  />
                </label>
                <button 
                  onClick={() => onDeleteEdge(edge.id)}
                  className="delete-btn"
                  disabled={isSimulating}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="control-section">
          <h4>
            Warnings ({warnings.length})
            <button 
              onClick={() => setShowWarnings(!showWarnings)}
              className="toggle-warnings-btn"
            >
              {showWarnings ? 'Hide' : 'Show'}
            </button>
          </h4>
          {showWarnings && (
            <div className="warnings-list">
              {warnings.map((warning, index) => (
                <div key={index} className="warning-item">
                  ⚠️ {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Simulation Controls */}
      <div className="control-section">
        <h4>Simulation</h4>
        <div className="simulation-controls">
          <button 
            onClick={onRunSimulation}
            className="run-simulation-btn"
            disabled={isSimulating || nodes.length === 0}
          >
            {isSimulating ? 'Running...' : 'Run Simulation'}
          </button>
          <button 
            onClick={onClearAll}
            className="clear-all-btn"
            disabled={isSimulating}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="control-section">
        <h4>Instructions</h4>
        <div className="instructions">
          <p>1. Click on empty space to create a new node</p>
          <p>2. Click on a node to select it</p>
          <p>3. With a node selected, click "Create Edge" then click another node</p>
          <p>4. Set probabilities for nodes and edges</p>
          <p>5. Click "Run Simulation" to see the Markov chain evolution</p>
        </div>
      </div>
    </div>
  )
}

export default Controls 