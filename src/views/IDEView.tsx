import { useState, useCallback, useRef } from "react";
import { File, FolderOpen, Plus, Save, Play, Code2, GitBranch } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Node, Edge } from "@xyflow/react";
import WorkflowCanvas from "../components/canvas/WorkflowCanvas";
import { generateSagCode, WorkflowNode, WorkflowEdge } from "../lib/sagGenerator";

// Sample .sag code
const SAMPLE_CODE = `agent WeatherAgent {
  description: "An agent that provides weather information"
  version: "1.0.0"

  model {
    provider: "anthropic"
    name: "claude-sonnet-4-20250514"
  }

  state {
    lastCity?: string
  }

  tool get_weather(city: string) -> WeatherData {
    description: "Get current weather for a city"
    let data = await http.get(\`https://api.weather.com/\${city}\`)
    return data
  }

  on user_message {
    let weather = get_weather("San Francisco")
    emit response(weather)
  }
}

type WeatherData {
  temperature: number
  humidity: number
  description: string
}
`;

type ViewMode = "code" | "canvas" | "split";

export default function IDEView() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [activeFile, setActiveFile] = useState("weather-agent.sag");
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  // Track sync source to prevent loops
  const syncSource = useRef<"code" | "canvas" | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle code changes from editor
  const handleCodeChange = useCallback((value: string | undefined) => {
    if (syncSource.current === "canvas") {
      syncSource.current = null;
      return;
    }
    syncSource.current = "code";
    setCode(value || "");
    // Reset sync source after a delay
    setTimeout(() => {
      syncSource.current = null;
    }, 100);
  }, []);

  // Handle workflow changes from canvas
  const handleWorkflowChange = useCallback((nodes: Node[], edges: Edge[]) => {
    if (syncSource.current === "code") {
      return;
    }

    // Debounce to avoid rapid updates
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      syncSource.current = "canvas";
      const generatedCode = generateSagCode(
        nodes as unknown as WorkflowNode[],
        edges as unknown as WorkflowEdge[]
      );
      setCode(generatedCode);
      // Reset sync source after a delay
      setTimeout(() => {
        syncSource.current = null;
      }, 100);
    }, 300);
  }, []);

  return (
    <div className="flex h-full">
      {/* File Explorer */}
      <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-3 border-b border-gray-800 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Explorer</span>
          <button className="p-1 hover:bg-gray-800 rounded">
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <FileItem
              name="weather-agent.sag"
              active={activeFile === "weather-agent.sag"}
              onClick={() => setActiveFile("weather-agent.sag")}
            />
            <FileItem
              name="types.sag"
              active={activeFile === "types.sag"}
              onClick={() => setActiveFile("types.sag")}
            />
            <FolderItem name="skills" />
          </div>
        </div>
      </div>

      {/* Main Editor/Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-2">
          {/* View Mode Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <ViewTab
              active={viewMode === "code"}
              onClick={() => setViewMode("code")}
              icon={<Code2 className="w-4 h-4" />}
              label="Code"
            />
            <ViewTab
              active={viewMode === "canvas"}
              onClick={() => setViewMode("canvas")}
              icon={<GitBranch className="w-4 h-4" />}
              label="Canvas"
            />
            <ViewTab
              active={viewMode === "split"}
              onClick={() => setViewMode("split")}
              icon={
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-3 bg-current rounded-sm" />
                  <div className="w-1.5 h-3 bg-current rounded-sm" />
                </div>
              }
              label="Split"
            />
          </div>

          <div className="w-px h-6 bg-gray-700 mx-2" />

          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-sm">
            <Play className="w-4 h-4" />
            Compile
          </button>

          <div className="flex-1" />

          <span className="text-sm text-gray-400">{activeFile}</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          {(viewMode === "code" || viewMode === "split") && (
            <div className={viewMode === "split" ? "w-1/2 border-r border-gray-800" : "flex-1"}>
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  padding: { top: 16 },
                  lineNumbers: "on",
                  renderLineHighlight: "line",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          )}

          {/* Workflow Canvas */}
          {(viewMode === "canvas" || viewMode === "split") && (
            <div className={viewMode === "split" ? "w-1/2" : "flex-1"}>
              <WorkflowCanvas code={code} onWorkflowChange={handleWorkflowChange} />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="p-3 border-b border-gray-800">
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>
        <div className="flex-1 p-4 text-sm text-gray-400 overflow-y-auto">
          <p className="mb-4">Compile your agent to see the generated code.</p>

          <div className="bg-gray-800 rounded-lg p-3 mb-3">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-green-400">Ready</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Target</div>
            <select className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm">
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm transition-colors ${
        active
          ? "bg-purple-600 text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function FileItem({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm ${
        active
          ? "bg-purple-600/20 text-purple-300"
          : "text-gray-400 hover:bg-gray-800"
      }`}
    >
      <File className="w-4 h-4" />
      {name}
    </button>
  );
}

function FolderItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400">
      <FolderOpen className="w-4 h-4" />
      {name}
    </div>
  );
}
