import { Bot, Wrench, Zap, Database } from "lucide-react";

const nodeTypes = [
  {
    type: "agent",
    label: "Agent",
    icon: Bot,
    color: "#6b8b9b",
    description: "AI agent with tools",
  },
  {
    type: "tool",
    label: "Tool",
    icon: Wrench,
    color: "#8b6b8b",
    description: "Callable function",
  },
  {
    type: "event",
    label: "Event",
    icon: Zap,
    color: "#6b9b6b",
    description: "Event handler",
  },
  {
    type: "state",
    label: "State",
    icon: Database,
    color: "#9b8b6b",
    description: "Persistent state",
  },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-44 bg-[#232323] border-r border-[#333] p-2 flex flex-col gap-1.5">
      <h3 className="text-[10px] font-medium text-[#666] uppercase tracking-wider mb-1 px-1">
        Components
      </h3>

      {nodeTypes.map((node) => (
        <div
          key={node.type}
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
          className="flex items-center gap-2 px-2 py-1.5 rounded border border-[#333] bg-[#1a1a1a] cursor-grab active:cursor-grabbing transition-colors hover:border-[#444] hover:bg-[#2a2a2a]"
        >
          <node.icon className="w-3.5 h-3.5" style={{ color: node.color }} />
          <div>
            <div className="text-xs font-medium text-[#d4d4d4]">{node.label}</div>
            <div className="text-[10px] text-[#555]">
              {node.description}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-3 pt-3 border-t border-[#333]">
        <h3 className="text-[10px] font-medium text-[#666] uppercase tracking-wider mb-1.5 px-1">
          Tips
        </h3>
        <ul className="text-[10px] text-[#555] space-y-0.5 px-1">
          <li>• Drag to canvas</li>
          <li>• Connect via handles</li>
          <li>• Delete key removes</li>
        </ul>
      </div>
    </div>
  );
}
