import React, { useEffect, useState } from 'react'
import './SimulationDisplay.css'

const SimulationDisplay = ({
  simulationData,
  currentStep,
  isPlaying,
  onStepChange,
  onPlay,
  onStop
}) => {
  const [selectedStepDetail, setSelectedStepDetail] = useState(null)

  const handleStepClick = (stepIndex) => {
    onStepChange(stepIndex)
    setSelectedStepDetail(stepIndex)
  }

  const getCurrentStepData = () => {
    if (!simulationData || !simulationData.steps || !simulationData.steps[currentStep]) {
      return null
    }
    return simulationData.steps[currentStep]
  }

  const formatProbability = (prob) => {
    return (prob * 100).toFixed(1) + '%'
  }

  if (!simulationData) {
    return null
  }

  return (
    <div className="simulation-display">
      <h3>Simulation Results</h3>
      
      {/* Playback Controls */}
      <div className="playback-controls">
        <button 
          onClick={onPlay}
          disabled={isPlaying}
          className="play-btn"
        >
          {isPlaying ? 'Playing...' : 'Play Simulation'}
        </button>
        <button 
          onClick={onStop}
          disabled={!isPlaying}
          className="stop-btn"
        >
          Stop
        </button>
        <div className="step-info">
          Step {currentStep} of {simulationData.steps.length - 1}
        </div>
      </div>

      {/* Step Slider */}
      <div className="step-slider">
        <input
          type="range"
          min="0"
          max={simulationData.steps.length - 1}
          value={currentStep}
          onChange={(e) => onStepChange(parseInt(e.target.value))}
          disabled={isPlaying}
          className="slider"
        />
        <div className="step-labels">
          <span>0</span>
          <span>{simulationData.steps.length - 1}</span>
        </div>
      </div>

      {/* Current Step Details */}
      <div className="current-step-details">
        <h4>Step {currentStep} Details</h4>
        {getCurrentStepData() && (
          <div className="step-nodes">
            {getCurrentStepData().nodes.map(node => (
              <div key={node.id} className="step-node">
                <strong>{node.id}</strong>
                <span className="probability">
                  {formatProbability(node.probability)}
                </span>
                <div className="probability-bar">
                  <div 
                    className="probability-fill"
                    style={{ width: `${node.probability * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step Timeline */}
      <div className="step-timeline">
        <h4>Timeline</h4>
        <div className="timeline-steps">
          {simulationData.steps.map((step, index) => (
            <div
              key={index}
              className={`timeline-step ${index === currentStep ? 'active' : ''}`}
              onClick={() => handleStepClick(index)}
            >
              <div className="step-number">{index}</div>
              <div className="step-nodes-mini">
                {step.nodes.map(node => (
                  <div
                    key={node.id}
                    className="mini-node"
                    style={{
                      backgroundColor: `hsl(${node.id.hashCode() % 360}, 70%, 50%)`,
                      height: `${Math.max(4, node.probability * 30)}px`,
                      width: `${Math.max(4, node.probability * 30)}px`
                    }}
                    title={`${node.id}: ${formatProbability(node.probability)}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Step View */}
      {selectedStepDetail !== null && (
        <div className="step-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Step {selectedStepDetail} Details</h4>
              <button 
                onClick={() => setSelectedStepDetail(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detailed-nodes">
                {simulationData.steps[selectedStepDetail].nodes.map(node => (
                  <div key={node.id} className="detailed-node">
                    <div className="node-header">
                      <strong>{node.id}</strong>
                      <span className="probability-value">
                        {node.probability.toFixed(6)}
                      </span>
                    </div>
                    <div className="node-position">
                      Position: ({node.position.x.toFixed(0)}, {node.position.y.toFixed(0)})
                    </div>
                    <div className="probability-bar large">
                      <div 
                        className="probability-fill"
                        style={{ width: `${node.probability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="simulation-stats">
        <h4>Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <label>Total Steps:</label>
            <span>{simulationData.steps.length}</span>
          </div>
          <div className="stat-item">
            <label>Nodes:</label>
            <span>{simulationData.steps[0]?.nodes.length || 0}</span>
          </div>
          <div className="stat-item">
            <label>Warnings:</label>
            <span>{simulationData.warnings.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate consistent colors for nodes
String.prototype.hashCode = function() {
  let hash = 0
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export default SimulationDisplay 