import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Database } from "lucide-react";

interface StateNodeData {
  label: string;
  fields?: string[];
}

function StateNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as StateNodeData;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 min-w-[150px] backdrop-blur-sm transition-all duration-200 ${
        selected
          ? "border-[#ff6b35] shadow-[0_0_30px_rgba(255,107,53,0.5)]"
          : "border-[#ff6b35]/50 shadow-[0_0_15px_rgba(255,107,53,0.2)]"
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0.05) 100%)",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-[#ff6b35] !border-2 !border-[#ff6b35]/50"
        style={{ boxShadow: "0 0 8px rgba(255,107,53,0.6)" }}
      />

      <div className="flex items-center gap-2 mb-2">
        <Database className="w-4 h-4 text-[#ff6b35]" />
        <span className="font-semibold text-white text-sm" style={{ textShadow: "0 0 10px rgba(255,107,53,0.5)" }}>
          {nodeData.label}
        </span>
      </div>

      {nodeData.fields && nodeData.fields.length > 0 && (
        <div className="space-y-1">
          {nodeData.fields.map((field, index) => (
            <div
              key={index}
              className="text-xs text-[#ff6b35]/80 font-mono bg-[#ff6b35]/10 px-2 py-0.5 rounded border border-[#ff6b35]/20"
            >
              {field}
            </div>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[#ff6b35] !border-2 !border-[#ff6b35]/50"
        style={{ boxShadow: "0 0 8px rgba(255,107,53,0.6)" }}
      />
    </div>
  );
}

export default memo(StateNode);
