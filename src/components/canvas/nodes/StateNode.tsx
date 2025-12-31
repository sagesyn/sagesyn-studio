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
      className={`px-3 py-2 rounded border min-w-[130px] transition-colors ${
        selected
          ? "border-[#9b8b6b] bg-[#2a2a2a]"
          : "border-[#444] bg-[#232323] hover:border-[#555]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-[#9b8b6b] !border !border-[#444]"
      />

      <div className="flex items-center gap-2 mb-1">
        <Database className="w-3.5 h-3.5 text-[#9b8b6b]" />
        <span className="font-medium text-[#d4d4d4] text-xs">
          {nodeData.label}
        </span>
      </div>

      {nodeData.fields && nodeData.fields.length > 0 && (
        <div className="space-y-0.5">
          {nodeData.fields.map((field, index) => (
            <div
              key={index}
              className="text-[10px] text-[#666] font-mono bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#333]"
            >
              {field}
            </div>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-[#9b8b6b] !border !border-[#444]"
      />
    </div>
  );
}

export default memo(StateNode);
