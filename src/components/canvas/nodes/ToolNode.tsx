import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Wrench } from "lucide-react";

interface ToolNodeData {
  label: string;
  params?: string;
  returns?: string;
}

function ToolNode({ data, selected }: NodeProps) {
  const nodeData = data as ToolNodeData;

  return (
    <div
      className={`px-4 py-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 border-2 min-w-[160px] shadow-lg ${
        selected ? "border-white" : "border-blue-400"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-300 !border-2 !border-blue-600"
      />

      <div className="flex items-center gap-2 mb-1">
        <Wrench className="w-4 h-4 text-blue-200" />
        <span className="font-semibold text-white text-sm">{nodeData.label}</span>
      </div>

      {nodeData.params && (
        <div className="text-xs text-blue-200 font-mono opacity-80">
          ({nodeData.params})
        </div>
      )}

      {nodeData.returns && (
        <div className="text-xs text-blue-300 font-mono mt-1">
          → {nodeData.returns}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-300 !border-2 !border-blue-600"
      />
    </div>
  );
}

export default memo(ToolNode);
