import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Database } from "lucide-react";

interface StateNodeData {
  label: string;
  fields?: string[];
}

function StateNode({ data, selected }: NodeProps) {
  const nodeData = data as StateNodeData;

  return (
    <div
      className={`px-4 py-3 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 border-2 min-w-[150px] shadow-lg ${
        selected ? "border-white" : "border-amber-400"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-amber-300 !border-2 !border-amber-600"
      />

      <div className="flex items-center gap-2 mb-2">
        <Database className="w-4 h-4 text-amber-200" />
        <span className="font-semibold text-white text-sm">{nodeData.label}</span>
      </div>

      {nodeData.fields && nodeData.fields.length > 0 && (
        <div className="space-y-1">
          {nodeData.fields.map((field, index) => (
            <div
              key={index}
              className="text-xs text-amber-200 font-mono bg-amber-900/50 px-2 py-0.5 rounded"
            >
              {field}
            </div>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-amber-300 !border-2 !border-amber-600"
      />
    </div>
  );
}

export default memo(StateNode);
