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
      className={`px-3 py-2 rounded border min-w-[160px] transition-colors ${
        selected
          ? "border-[#6b8b9b] bg-[#2a2a2a]"
          : "border-[#444] bg-[#232323] hover:border-[#555]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-[#6b8b9b] !border !border-[#444]"
      />

      <div className="flex items-center gap-2 mb-1">
        <Bot className="w-4 h-4 text-[#6b8b9b]" />
        <span className="font-medium text-[#d4d4d4] text-sm">
          {nodeData.label}
        </span>
      </div>

      {nodeData.description && (
        <p className="text-[10px] text-[#666]">{nodeData.description}</p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#6b8b9b] !border !border-[#444]"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="state"
        className="!w-2 !h-2 !bg-[#9b8b6b] !border !border-[#444]"
      />
    </div>
  );
}

export default memo(AgentNode);
