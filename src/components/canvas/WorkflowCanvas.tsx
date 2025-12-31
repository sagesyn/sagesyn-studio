import { useCallback, useRef, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import AgentNode from "./nodes/AgentNode";
import ToolNode from "./nodes/ToolNode";
import EventNode from "./nodes/EventNode";
import StateNode from "./nodes/StateNode";
import NodePalette from "./NodePalette";
import { parseSagCode, generateNodesFromParsed } from "../../lib/sagParser";

interface WorkflowCanvasProps {
  code?: string;
  onWorkflowChange?: (nodes: Node[], edges: Edge[]) => void;
}

// Custom node types
const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  event: EventNode,
  state: StateNode,
};

// Fallback nodes when no code is provided
const defaultNodes: Node[] = [
  {
    id: "agent-1",
    type: "agent",
    position: { x: 250, y: 100 },
    data: { label: "WeatherAgent", description: "Gets weather information" },
  },
  {
    id: "tool-1",
    type: "tool",
    position: { x: 100, y: 300 },
    data: { label: "get_weather", params: "city: string", returns: "WeatherData" },
  },
  {
    id: "event-1",
    type: "event",
    position: { x: 250, y: 500 },
    data: { label: "user_message", eventType: "input" },
  },
];

const defaultEdges: Edge[] = [
  { id: "e1-1", source: "agent-1", target: "tool-1", animated: true },
  { id: "e1-3", source: "event-1", target: "agent-1", animated: true, style: { stroke: "#22c55e" } },
];

let id = 0;
const getId = () => `node_${id++}`;

// Get edge style based on node types
function getEdgeStyle(source: string, target: string) {
  if (source.startsWith("event-") || target.startsWith("event-")) {
    return { stroke: "#22c55e" };
  }
  if (source.startsWith("state-") || target.startsWith("state-")) {
    return { stroke: "#f59e0b", strokeDasharray: "5,5" };
  }
  return { stroke: "#6b7280" };
}

function Flow({ code, onWorkflowChange }: { code?: string; onWorkflowChange?: (nodes: Node[], edges: Edge[]) => void }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // Track if we're currently syncing from code to prevent loops
  const isSyncingFromCode = useRef(false);
  // Track the last code we synced from
  const lastSyncedCode = useRef<string | null>(null);

  // Parse code and generate nodes when code changes
  const parsedWorkflow = useMemo(() => {
    if (!code) return null;
    const parsed = parseSagCode(code);
    return generateNodesFromParsed(parsed);
  }, [code]);

  // Update nodes/edges when parsed workflow changes
  useEffect(() => {
    if (parsedWorkflow && code !== lastSyncedCode.current) {
      isSyncingFromCode.current = true;
      lastSyncedCode.current = code || null;

      setNodes(parsedWorkflow.nodes as Node[]);
      setEdges(
        parsedWorkflow.edges.map((e) => ({
          ...e,
          animated: true,
          style: getEdgeStyle(e.source, e.target),
        })) as Edge[]
      );
      // Fit view after updating nodes
      setTimeout(() => {
        fitView({ padding: 0.2 });
        isSyncingFromCode.current = false;
      }, 50);
    }
  }, [parsedWorkflow, code, setNodes, setEdges, fitView]);

  // Notify parent when workflow changes from user interaction
  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
      // Only notify if change was from user, not code sync
      if (!isSyncingFromCode.current && onWorkflowChange) {
        // Defer to next tick to get updated nodes
        setTimeout(() => {
          onWorkflowChange(nodes, edges);
        }, 0);
      }
    },
    [onNodesChange, onWorkflowChange, nodes, edges]
  );

  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes);
      if (!isSyncingFromCode.current && onWorkflowChange) {
        setTimeout(() => {
          onWorkflowChange(nodes, edges);
        }, 0);
      }
    },
    [onEdgesChange, onWorkflowChange, nodes, edges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge({ ...params, animated: true }, eds);
        if (onWorkflowChange && !isSyncingFromCode.current) {
          setTimeout(() => onWorkflowChange(nodes, newEdges), 0);
        }
        return newEdges;
      });
    },
    [setEdges, onWorkflowChange, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        if (onWorkflowChange && !isSyncingFromCode.current) {
          setTimeout(() => onWorkflowChange(newNodes, edges), 0);
        }
        return newNodes;
      });
    },
    [screenToFlowPosition, setNodes, onWorkflowChange, edges]
  );

  return (
    <div className="flex h-full">
      <NodePalette />
      <div ref={reactFlowWrapper} className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: "#6b7280" },
          }}
        >
          <Background color="#374151" gap={20} size={1} />
          <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg" />
          <MiniMap
            className="!bg-gray-900 !border-gray-700 !rounded-lg"
            nodeColor={(node) => {
              switch (node.type) {
                case "agent":
                  return "#8b5cf6";
                case "tool":
                  return "#3b82f6";
                case "event":
                  return "#22c55e";
                case "state":
                  return "#f59e0b";
                default:
                  return "#6b7280";
              }
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

function getDefaultNodeData(type: string) {
  switch (type) {
    case "agent":
      return { label: "NewAgent", description: "Agent description" };
    case "tool":
      return { label: "new_tool", params: "", returns: "void" };
    case "event":
      return { label: "custom_event", eventType: "custom" };
    case "state":
      return { label: "State", fields: [] };
    default:
      return { label: "Node" };
  }
}

export default function WorkflowCanvas({ code, onWorkflowChange }: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <Flow code={code} onWorkflowChange={onWorkflowChange} />
    </ReactFlowProvider>
  );
}
