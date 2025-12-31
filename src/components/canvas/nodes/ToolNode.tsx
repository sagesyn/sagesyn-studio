import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Wrench } from "lucide-react";

interface ToolNodeData {
  label: string;
  params?: string;
  returns?: string;
}

function ToolNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ToolNodeData;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 min-w-[160px] backdrop-blur-sm transition-all duration-200 ${
        selected
          ? "border-[#ff00ff] shadow-[0_0_30px_rgba(255,0,255,0.5)]"
          : "border-[#ff00ff]/50 shadow-[0_0_15px_rgba(255,0,255,0.2)]"
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(255,0,255,0.15) 0%, rgba(255,0,255,0.05) 100%)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#ff00ff] !border-2 !border-[#ff00ff]/50"
        style={{ boxShadow: "0 0 8px rgba(255,0,255,0.6)" }}
      />

      <div className="flex items-center gap-2 mb-1">
        <Wrench className="w-4 h-4 text-[#ff00ff]" />
        <span className="font-semibold text-white text-sm" style={{ textShadow: "0 0 10px rgba(255,0,255,0.5)" }}>
          {nodeData.label}
        </span>
      </div>

      {nodeData.params && (
        <div className="text-xs text-[#ff00ff]/70 font-mono">
          ({nodeData.params})
        </div>
      )}

      {nodeData.returns && (
        <div className="text-xs text-[#ff00ff]/90 font-mono mt-1">
          → {nodeData.returns}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#ff00ff] !border-2 !border-[#ff00ff]/50"
        style={{ boxShadow: "0 0 8px rgba(255,0,255,0.6)" }}
      />
    </div>
  );
}

export default memo(ToolNode);
