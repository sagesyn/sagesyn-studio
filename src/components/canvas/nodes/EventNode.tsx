import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Zap, MessageSquare, Play, Square } from "lucide-react";

interface EventNodeData {
  label: string;
  eventType?: "input" | "output" | "start" | "stop" | "custom";
}

function EventNode({ data, selected }: NodeProps) {
  const nodeData = data as EventNodeData;

  const getIcon = () => {
    switch (nodeData.eventType) {
      case "input":
        return <MessageSquare className="w-4 h-4 text-green-200" />;
      case "start":
        return <Play className="w-4 h-4 text-green-200" />;
      case "stop":
        return <Square className="w-4 h-4 text-green-200" />;
      default:
        return <Zap className="w-4 h-4 text-green-200" />;
    }
  };

  return (
    <div
      className={`px-4 py-2 rounded-full bg-gradient-to-br from-green-600 to-green-800 border-2 min-w-[140px] shadow-lg ${
        selected ? "border-white" : "border-green-400"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-green-300 !border-2 !border-green-600"
      />

      <div className="flex items-center justify-center gap-2">
        {getIcon()}
        <span className="font-medium text-white text-sm">{nodeData.label}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-300 !border-2 !border-green-600"
      />
    </div>
  );
}

export default memo(EventNode);
