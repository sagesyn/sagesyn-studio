import { Bot, Wrench, Zap, Database } from "lucide-react";

const nodeTypes = [
  {
    type: "agent",
    label: "Agent",
    icon: Bot,
    color: "bg-purple-600 hover:bg-purple-500 border-purple-400",
    description: "AI agent with tools and handlers",
  },
  {
    type: "tool",
    label: "Tool",
    icon: Wrench,
    color: "bg-blue-600 hover:bg-blue-500 border-blue-400",
    description: "Function the agent can call",
  },
  {
    type: "event",
    label: "Event",
    icon: Zap,
    color: "bg-green-600 hover:bg-green-500 border-green-400",
    description: "Event handler trigger",
  },
  {
    type: "state",
    label: "State",
    icon: Database,
    color: "bg-amber-600 hover:bg-amber-500 border-amber-400",
    description: "Persistent agent state",
  },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-48 bg-gray-900 border-r border-gray-800 p-3 flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Components
      </h3>

      {nodeTypes.map((node) => (
        <div
          key={node.type}
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing transition-colors ${node.color}`}
        >
          <node.icon className="w-4 h-4 text-white" />
          <div>
            <div className="text-sm font-medium text-white">{node.label}</div>
            <div className="text-xs text-white/60">{node.description}</div>
          </div>
        </div>
      ))}

      <div className="mt-4 pt-4 border-t border-gray-800">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Tips
        </h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Drag components to canvas</li>
          <li>• Connect nodes by dragging handles</li>
          <li>• Click node to select</li>
          <li>• Delete key to remove</li>
        </ul>
      </div>
    </div>
  );
}
