import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Zap, MessageSquare, Play, Square } from "lucide-react";

interface EventNodeData {
  label: string;
  eventType?: "input" | "output" | "start" | "stop" | "custom";
}

function EventNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as EventNodeData;

  const getIcon = () => {
    switch (nodeData.eventType) {
      case "input":
        return <MessageSquare className="w-3.5 h-3.5 text-[#6b9b6b]" />;
      case "start":
        return <Play className="w-3.5 h-3.5 text-[#6b9b6b]" />;
      case "stop":
        return <Square className="w-3.5 h-3.5 text-[#6b9b6b]" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-[#6b9b6b]" />;
    }
  };

  return (
    <div
      className={`px-3 py-1.5 rounded-full border min-w-[120px] transition-colors ${
        selected
          ? "border-[#6b9b6b] bg-[#2a2a2a]"
          : "border-[#444] bg-[#232323] hover:border-[#555]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-[#6b9b6b] !border !border-[#444]"
      />

      <div className="flex items-center justify-center gap-1.5">
        {getIcon()}
        <span className="font-medium text-[#d4d4d4] text-xs">
          {nodeData.label}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-[#6b9b6b] !border !border-[#444]"
      />
    </div>
  );
}

export default memo(EventNode);
