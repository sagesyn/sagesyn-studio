import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Bot } from "lucide-react";

interface AgentNodeData {
  label: string;
  description?: string;
}

function AgentNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as AgentNodeData;

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 min-w-[180px] backdrop-blur-sm transition-all duration-200 ${
        selected
          ? "border-[#00f2fe] shadow-[0_0_30px_rgba(0,242,254,0.5)]"
          : "border-[#00f2fe]/50 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(0,242,254,0.15) 0%, rgba(0,242,254,0.05) 100%)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#00f2fe] !border-2 !border-[#00f2fe]/50"
        style={{ boxShadow: "0 0 8px rgba(0,242,254,0.6)" }}
      />

      <div className="flex items-center gap-2 mb-1">
        <Bot className="w-5 h-5 text-[#00f2fe]" />
        <span className="font-bold text-white" style={{ textShadow: "0 0 10px rgba(0,242,254,0.5)" }}>
          {nodeData.label}
        </span>
      </div>

      {nodeData.description && (
        <p className="text-xs text-[#00f2fe]/70">{nodeData.description}</p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#00f2fe] !border-2 !border-[#00f2fe]/50"
        style={{ boxShadow: "0 0 8px rgba(0,242,254,0.6)" }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="state"
        className="!w-3 !h-3 !bg-[#ff6b35] !border-2 !border-[#ff6b35]/50"
        style={{ boxShadow: "0 0 8px rgba(255,107,53,0.6)" }}
      />
    </div>
  );
}

export default memo(AgentNode);
