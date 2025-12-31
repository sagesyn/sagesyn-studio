import { Bot, Wrench, Zap, Database } from "lucide-react";

const nodeTypes = [
  {
    type: "agent",
    label: "Agent",
    icon: Bot,
    color: "#00f2fe",
    description: "AI agent with tools and handlers",
  },
  {
    type: "tool",
    label: "Tool",
    icon: Wrench,
    color: "#ff00ff",
    description: "Function the agent can call",
  },
  {
    type: "event",
    label: "Event",
    icon: Zap,
    color: "#00ff88",
    description: "Event handler trigger",
  },
  {
    type: "state",
    label: "State",
    icon: Database,
    color: "#ff6b35",
    description: "Persistent agent state",
  },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-48 bg-[#12121a] border-r border-[#2a2a3a] p-3 flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2">
        Components
      </h3>

      {nodeTypes.map((node) => (
        <div
          key={node.type}
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${node.color}15 0%, ${node.color}05 100%)`,
            borderColor: `${node.color}50`,
            boxShadow: `0 0 10px ${node.color}20`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 20px ${node.color}40`;
            e.currentTarget.style.borderColor = node.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 0 10px ${node.color}20`;
            e.currentTarget.style.borderColor = `${node.color}50`;
          }}
        >
          <node.icon className="w-4 h-4" style={{ color: node.color }} />
          <div>
            <div className="text-sm font-medium text-white">{node.label}</div>
            <div className="text-xs" style={{ color: `${node.color}99` }}>
              {node.description}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4 pt-4 border-t border-[#2a2a3a]">
        <h3 className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2">
          Tips
        </h3>
        <ul className="text-xs text-[#555566] space-y-1">
          <li>• Drag components to canvas</li>
          <li>• Connect nodes by dragging handles</li>
          <li>• Click node to select</li>
          <li>• Delete key to remove</li>
        </ul>
      </div>
    </div>
  );
}
