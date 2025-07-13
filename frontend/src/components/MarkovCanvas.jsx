import React, { useRef, useEffect, useState, useCallback } from 'react'
import './MarkovCanvas.css'

const MarkovCanvas = ({ 
  nodes, 
  edges, 
  selectedNode, 
  isCreatingEdge, 
  onNodeClick, 
  onCanvasClick, 
  onEdgeCreate, 
  isSimulating 
}) => {
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [tempEdge, setTempEdge] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Handle canvas click
  const handleCanvasClick = useCallback((e) => {
    if (isSimulating) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on a node
    const clickedNode = nodes.find(node => {
      const dx = x - node.position.x
      const dy = y - node.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance <= getNodeRadius(node.probability)
    })

    if (clickedNode) {
      if (isCreatingEdge && selectedNode && selectedNode.id !== clickedNode.id) {
        // Create edge from selected node to clicked node
        const probability = parseFloat(prompt('Enter edge probability (0-1):') || '0.5')
        if (probability >= 0 && probability <= 1) {
          onEdgeCreate(selectedNode.id, clickedNode.id, probability)
        }
        setTempEdge(null)
        onNodeClick(null)
      } else {
        // Select node
        onNodeClick(clickedNode)
      }
    } else if (!isCreatingEdge) {
      // Create new node
      const probability = parseFloat(prompt('Enter node probability (0-1):') || '0.5')
      if (probability >= 0 && probability <= 1) {
        onCanvasClick(x, y, probability)
      }
    }
  }, [nodes, selectedNode, isCreatingEdge, onNodeClick, onCanvasClick, onEdgeCreate, isSimulating])

  // Handle mouse move for temporary edge visualization
  const handleMouseMove = useCallback((e) => {
    if (isCreatingEdge && selectedNode) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePos({ x, y })
      setTempEdge({
        from: selectedNode.position,
        to: { x, y }
      })
    }
  }, [isCreatingEdge, selectedNode])

  // Get node radius based on probability
  const getNodeRadius = (probability) => {
    return Math.max(10, Math.min(50, probability * 50))
  }

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    edges.forEach(edge => {
      const senderNode = nodes.find(n => n.id === edge.sender_id)
      const receiverNode = nodes.find(n => n.id === edge.receiver_id)
      
      if (senderNode && receiverNode) {
        drawEdge(ctx, senderNode, receiverNode, edge)
      }
    })

    // Draw temporary edge
    if (tempEdge) {
      ctx.strokeStyle = '#999'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(tempEdge.from.x, tempEdge.from.y)
      ctx.lineTo(tempEdge.to.x, tempEdge.to.y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw nodes
    nodes.forEach(node => {
      drawNode(ctx, node)
    })
  }, [nodes, edges, tempEdge])

  // Draw a single node
  const drawNode = (ctx, node) => {
    const radius = getNodeRadius(node.probability)
    const isSelected = selectedNode && selectedNode.id === node.id

    // Node circle
    ctx.beginPath()
    ctx.arc(node.position.x, node.position.y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = isSelected ? '#4CAF50' : '#2196F3'
    ctx.fill()
    
    // Node border
    ctx.strokeStyle = isSelected ? '#2E7D32' : '#1976D2'
    ctx.lineWidth = isSelected ? 3 : 2
    ctx.stroke()

    // Node label
    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.probability.toFixed(2), node.position.x, node.position.y)
  }

  // Draw a single edge
  const drawEdge = (ctx, senderNode, receiverNode, edge) => {
    const senderRadius = getNodeRadius(senderNode.probability)
    const receiverRadius = getNodeRadius(receiverNode.probability)
    
    // Calculate edge start and end points (not overlapping with nodes)
    const dx = receiverNode.position.x - senderNode.position.x
    const dy = receiverNode.position.y - senderNode.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance === 0) {
      // Self-loop
      const centerX = senderNode.position.x + senderRadius + 20
      const centerY = senderNode.position.y - 20
      const loopRadius = 15
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, loopRadius, 0, 2 * Math.PI)
      ctx.strokeStyle = '#FF5722'
      ctx.lineWidth = Math.max(2, edge.probability * 8)
      ctx.stroke()
      
      // Self-loop label
      ctx.fillStyle = '#FF5722'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(edge.probability.toFixed(2), centerX, centerY)
      return
    }
    
    const unitX = dx / distance
    const unitY = dy / distance
    
    const startX = senderNode.position.x + unitX * senderRadius
    const startY = senderNode.position.y + unitY * senderRadius
    const endX = receiverNode.position.x - unitX * receiverRadius
    const endY = receiverNode.position.y - unitY * receiverRadius
    
    // Draw edge line
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = '#666'
    ctx.lineWidth = Math.max(2, edge.probability * 8)
    ctx.stroke()
    
    // Draw arrowhead
    const arrowLength = 10
    const arrowAngle = Math.PI / 6
    const angle = Math.atan2(dy, dx)
    
    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    )
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    )
    ctx.stroke()
    
    // Draw edge label
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2
    
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(edge.probability.toFixed(2), midX, midY - 8)
  }

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        setCanvasSize({
          width: container.clientWidth,
          height: container.clientHeight
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Redraw when nodes or edges change
  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="markov-canvas-container">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="markov-canvas"
      />
      {isCreatingEdge && selectedNode && (
        <div className="canvas-hint">
          Click on a target node to create an edge from "{selectedNode.id}"
        </div>
      )}
    </div>
  )
}

export default MarkovCanvas 