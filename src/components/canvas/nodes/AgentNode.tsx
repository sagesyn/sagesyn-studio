import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Bot } from "lucide-react";

interface AgentNodeData {
  label: string;
  description?: string;
}

function AgentNode({ data, selected }: NodeProps) {
  const nodeData = data as AgentNodeData;

  return (
    <div
      className={`px-4 py-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 border-2 min-w-[180px] shadow-lg ${
        selected ? "border-white" : "border-purple-400"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-300 !border-2 !border-purple-600"
      />

      <div className="flex items-center gap-2 mb-1">
        <Bot className="w-5 h-5 text-purple-200" />
        <span className="font-bold text-white">{nodeData.label}</span>
      </div>

      {nodeData.description && (
        <p className="text-xs text-purple-200 opacity-80">{nodeData.description}</p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-purple-300 !border-2 !border-purple-600"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="state"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-amber-600"
      />
    </div>
  );
}

export default memo(AgentNode);
