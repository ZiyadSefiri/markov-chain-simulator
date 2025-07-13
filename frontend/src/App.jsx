import React, { useState, useRef, useCallback } from 'react'
import axios from 'axios'
import MarkovCanvas from './components/MarkovCanvas'
import Controls from './components/Controls'
import SimulationDisplay from './components/SimulationDisplay'
import './App.css'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [isCreatingEdge, setIsCreatingEdge] = useState(false)
  const [simulationData, setSimulationData] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [warnings, setWarnings] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const nodeIdCounter = useRef(0)
  const edgeIdCounter = useRef(0)

  const generateNodeId = () => `node_${nodeIdCounter.current++}`
  const generateEdgeId = () => `edge_${edgeIdCounter.current++}`

  const addNode = useCallback((x, y, probability = 0.5) => {
    const newNode = {
      id: generateNodeId(),
      position: { x, y },
      probability: probability
    }
    setNodes(prev => [...prev, newNode])
  }, [])

  const updateNodeProbability = useCallback((nodeId, probability) => {
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, probability } : node
      )
    )
  }, [])

  const addEdge = useCallback((senderId, receiverId, probability = 0.5) => {
    const newEdge = {
      id: generateEdgeId(),
      sender_id: senderId,
      receiver_id: receiverId,
      probability: probability
    }
    setEdges(prev => [...prev, newEdge])
  }, [])

  const updateEdgeProbability = useCallback((edgeId, probability) => {
    setEdges(prev => 
      prev.map(edge => 
        edge.id === edgeId ? { ...edge, probability } : edge
      )
    )
  }, [])

  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setEdges(prev => prev.filter(edge => 
      edge.sender_id !== nodeId && edge.receiver_id !== nodeId
    ))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }, [selectedNode])

  const deleteEdge = useCallback((edgeId) => {
    setEdges(prev => prev.filter(edge => edge.id !== edgeId))
  }, [])

  const clearAll = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
    setIsCreatingEdge(false)
    setSimulationData(null)
    setIsSimulating(false)
    setWarnings([])
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const runSimulation = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Please add at least one node before running the simulation')
      return
    }

    setIsSimulating(true)
    setWarnings([])

    try {
      const response = await axios.post(`${API_BASE_URL}/simulate`, {
        nodes: nodes,
        edges: edges
      })

      setSimulationData(response.data)
      setWarnings(response.data.warnings || [])
      setCurrentStep(0)
      
      // Update nodes with normalized probabilities
      if (response.data.normalized_nodes) {
        setNodes(response.data.normalized_nodes)
      }
      
    } catch (error) {
      console.error('Simulation error:', error)
      alert('Error running simulation: ' + (error.response?.data?.detail || error.message))
    } finally {
      setIsSimulating(false)
    }
  }, [nodes, edges])

  const playSimulation = useCallback(() => {
    if (!simulationData || !simulationData.steps) return

    setIsPlaying(true)
    setCurrentStep(0)

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= simulationData.steps.length - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 500) // 500ms between steps

    return () => clearInterval(interval)
  }, [simulationData])

  const stopSimulation = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(0)
  }, [])

  const getCurrentNodes = useCallback(() => {
    if (!simulationData || !simulationData.steps || !simulationData.steps[currentStep]) {
      return nodes
    }
    return simulationData.steps[currentStep].nodes
  }, [simulationData, currentStep, nodes])

  return (
    <div className="app">
      <div className="app-header">
        <h1>Markov Chain Simulator</h1>
        <p>Click to add nodes, select nodes to create edges, then run simulation</p>
      </div>
      
      <div className="app-content">
        <div className="canvas-container">
          <MarkovCanvas
            nodes={getCurrentNodes()}
            edges={edges}
            selectedNode={selectedNode}
            isCreatingEdge={isCreatingEdge}
            onNodeClick={setSelectedNode}
            onCanvasClick={addNode}
            onEdgeCreate={addEdge}
            isSimulating={isSimulating || isPlaying}
          />
        </div>
        
        <div className="controls-container">
          <Controls
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            isCreatingEdge={isCreatingEdge}
            onNodeProbabilityChange={updateNodeProbability}
            onEdgeProbabilityChange={updateEdgeProbability}
            onDeleteNode={deleteNode}
            onDeleteEdge={deleteEdge}
            onClearAll={clearAll}
            onCreateEdge={() => setIsCreatingEdge(true)}
            onCancelCreateEdge={() => setIsCreatingEdge(false)}
            onRunSimulation={runSimulation}
            isSimulating={isSimulating}
            warnings={warnings}
          />
        </div>
      </div>
      
      {simulationData && (
        <SimulationDisplay
          simulationData={simulationData}
          currentStep={currentStep}
          isPlaying={isPlaying}
          onStepChange={setCurrentStep}
          onPlay={playSimulation}
          onStop={stopSimulation}
        />
      )}
    </div>
  )
}

export default App 