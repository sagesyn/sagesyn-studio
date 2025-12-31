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
        return <MessageSquare className="w-4 h-4 text-[#00ff88]" />;
      case "start":
        return <Play className="w-4 h-4 text-[#00ff88]" />;
      case "stop":
        return <Square className="w-4 h-4 text-[#00ff88]" />;
      default:
        return <Zap className="w-4 h-4 text-[#00ff88]" />;
    }
  };

  return (
    <div
      className={`px-4 py-2 rounded-full border-2 min-w-[140px] backdrop-blur-sm transition-all duration-200 ${
        selected
          ? "border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.5)]"
          : "border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(0,255,136,0.15) 0%, rgba(0,255,136,0.05) 100%)",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-[#00ff88] !border-2 !border-[#00ff88]/50"
        style={{ boxShadow: "0 0 8px rgba(0,255,136,0.6)" }}
      />

      <div className="flex items-center justify-center gap-2">
        {getIcon()}
        <span className="font-medium text-white text-sm" style={{ textShadow: "0 0 10px rgba(0,255,136,0.5)" }}>
          {nodeData.label}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[#00ff88] !border-2 !border-[#00ff88]/50"
        style={{ boxShadow: "0 0 8px rgba(0,255,136,0.6)" }}
      />
    </div>
  );
}

export default memo(EventNode);
