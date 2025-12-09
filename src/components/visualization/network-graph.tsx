'use client'

import * as React from 'react'
import { User, Presentation } from 'lucide-react'

interface Node {
  id: string
  type: 'voter' | 'session'
  label: string
  x: number
  y: number
  cluster?: number
  votes?: number
}

interface Edge {
  from: string
  to: string
  weight: number
}

interface NetworkGraphProps {
  width?: number
  height?: number
}

export function NetworkGraph({ width = 800, height = 600 }: NetworkGraphProps) {
  const [hoveredNode, setHoveredNode] = React.useState<Node | null>(null)
  const [selectedCluster, setSelectedCluster] = React.useState<number | null>(null)

  // Mock data - in real app, this would come from API
  const sessions: Node[] = [
    { id: 's1', type: 'session', label: 'Decentralized Identity', x: 400, y: 150, votes: 89 },
    { id: 's2', type: 'session', label: 'Quadratic Funding', x: 600, y: 200, votes: 76 },
    { id: 's3', type: 'session', label: 'DAO Governance', x: 200, y: 250, votes: 68 },
    { id: 's4', type: 'session', label: 'Zero-Knowledge Proofs', x: 500, y: 400, votes: 54 },
    { id: 's5', type: 'session', label: 'Web3 UX Design', x: 300, y: 450, votes: 52 },
  ]

  const voters: Node[] = [
    { id: 'v1', type: 'voter', label: 'Alice', x: 350, y: 100, cluster: 1 },
    { id: 'v2', type: 'voter', label: 'Bob', x: 450, y: 120, cluster: 1 },
    { id: 'v3', type: 'voter', label: 'Carol', x: 550, y: 150, cluster: 2 },
    { id: 'v4', type: 'voter', label: 'David', x: 650, y: 250, cluster: 2 },
    { id: 'v5', type: 'voter', label: 'Emma', x: 150, y: 200, cluster: 3 },
    { id: 'v6', type: 'voter', label: 'Frank', x: 250, y: 300, cluster: 3 },
    { id: 'v7', type: 'voter', label: 'Grace', x: 400, y: 350, cluster: 1 },
    { id: 'v8', type: 'voter', label: 'Henry', x: 550, y: 450, cluster: 2 },
    { id: 'v9', type: 'voter', label: 'Iris', x: 200, y: 500, cluster: 3 },
    { id: 'v10', type: 'voter', label: 'Jack', x: 450, y: 250, cluster: 1 },
  ]

  const edges: Edge[] = [
    // Cluster 1 - votes for identity & governance
    { from: 'v1', to: 's1', weight: 3 },
    { from: 'v1', to: 's3', weight: 2 },
    { from: 'v2', to: 's1', weight: 2 },
    { from: 'v2', to: 's3', weight: 3 },
    { from: 'v7', to: 's1', weight: 2 },
    { from: 'v7', to: 's3', weight: 2 },
    { from: 'v10', to: 's1', weight: 1 },
    { from: 'v10', to: 's3', weight: 2 },

    // Cluster 2 - votes for funding & ZK
    { from: 'v3', to: 's2', weight: 3 },
    { from: 'v3', to: 's4', weight: 2 },
    { from: 'v4', to: 's2', weight: 2 },
    { from: 'v4', to: 's4', weight: 3 },
    { from: 'v8', to: 's2', weight: 2 },
    { from: 'v8', to: 's4', weight: 2 },

    // Cluster 3 - votes for governance & UX
    { from: 'v5', to: 's3', weight: 2 },
    { from: 'v5', to: 's5', weight: 3 },
    { from: 'v6', to: 's3', weight: 1 },
    { from: 'v6', to: 's5', weight: 3 },
    { from: 'v9', to: 's5', weight: 3 },
    { from: 'v9', to: 's4', weight: 1 },
  ]

  const nodes = [...sessions, ...voters]

  const clusterColors = {
    1: '#3b82f6', // blue
    2: '#10b981', // green
    3: '#f59e0b', // amber
  }

  const getClusterColor = (cluster?: number) => {
    if (!cluster) return '#6b7280'
    return clusterColors[cluster as keyof typeof clusterColors]
  }

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        className="border rounded-lg bg-muted/10"
        style={{ maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Draw edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)
          if (!fromNode || !toNode) return null

          const isHighlighted =
            hoveredNode?.id === edge.from ||
            hoveredNode?.id === edge.to ||
            (selectedCluster !== null &&
              (fromNode.type === 'voter' && fromNode.cluster === selectedCluster))

          return (
            <line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isHighlighted ? getClusterColor(fromNode.cluster) : '#e5e7eb'}
              strokeWidth={isHighlighted ? edge.weight * 1.5 : edge.weight * 0.8}
              strokeOpacity={isHighlighted ? 0.6 : 0.2}
              className="transition-all duration-300"
            />
          )
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const isHighlighted =
            hoveredNode?.id === node.id ||
            (selectedCluster !== null &&
              node.type === 'voter' &&
              node.cluster === selectedCluster) ||
            (hoveredNode &&
              edges.some(
                (e) =>
                  (e.from === hoveredNode.id && e.to === node.id) ||
                  (e.to === hoveredNode.id && e.from === node.id)
              ))

          const size = node.type === 'session' ? 40 : 24
          const color =
            node.type === 'session'
              ? '#8b5cf6'
              : getClusterColor(node.cluster)

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() =>
                node.type === 'voter' && node.cluster
                  ? setSelectedCluster(
                      selectedCluster === node.cluster ? null : node.cluster
                    )
                  : null
              }
              className="cursor-pointer"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={isHighlighted ? size / 2 + 3 : size / 2}
                fill={color}
                fillOpacity={isHighlighted ? 1 : 0.8}
                stroke="#fff"
                strokeWidth={isHighlighted ? 3 : 2}
                className="transition-all duration-300"
              />
              {node.type === 'session' && (
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {node.votes}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 p-3 bg-background border rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            {hoveredNode.type === 'session' ? (
              <Presentation className="h-4 w-4 text-primary" />
            ) : (
              <User className="h-4 w-4 text-primary" />
            )}
            <span className="font-medium text-sm">{hoveredNode.label}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {hoveredNode.type === 'session' ? (
              <>
                <div>Total Votes: {hoveredNode.votes}</div>
                <div className="mt-1">
                  Connected voters:{' '}
                  {edges.filter((e) => e.to === hoveredNode.id).length}
                </div>
              </>
            ) : (
              <>
                <div>Type: Voter</div>
                <div>Cluster: {hoveredNode.cluster}</div>
                <div className="mt-1">
                  Votes cast: {edges.filter((e) => e.from === hoveredNode.id).length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#8b5cf6] border-2 border-white" />
          <span className="text-muted-foreground">Sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <span className="text-muted-foreground">Cluster 1 (Identity & Governance)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="text-muted-foreground">Cluster 2 (Funding & ZK)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span className="text-muted-foreground">Cluster 3 (Governance & UX)</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        <p>
          • Hover over nodes to see details • Click voter nodes to highlight their
          cluster • Line thickness represents vote strength
        </p>
      </div>
    </div>
  )
}
