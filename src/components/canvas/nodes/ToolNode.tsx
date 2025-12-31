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
      className={`px-3 py-2 rounded border min-w-[140px] transition-colors ${
        selected
          ? "border-[#8b6b8b] bg-[#2a2a2a]"
          : "border-[#444] bg-[#232323] hover:border-[#555]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-[#8b6b8b] !border !border-[#444]"
      />

      <div className="flex items-center gap-2 mb-1">
        <Wrench className="w-3.5 h-3.5 text-[#8b6b8b]" />
        <span className="font-medium text-[#d4d4d4] text-xs">
          {nodeData.label}
        </span>
      </div>

      {nodeData.params && (
        <div className="text-[10px] text-[#666] font-mono">
          ({nodeData.params})
        </div>
      )}

      {nodeData.returns && (
        <div className="text-[10px] text-[#888] font-mono mt-0.5">
          → {nodeData.returns}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#8b6b8b] !border !border-[#444]"
      />
    </div>
  );
}

export default memo(ToolNode);
