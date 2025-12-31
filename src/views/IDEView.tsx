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
    <div className="flex h-full bg-[#1a1a1a]">
      {/* File Explorer */}
      <div className="w-52 bg-[#232323] border-r border-[#333] flex flex-col">
        <div className="p-3 border-b border-[#333] flex items-center justify-between">
          <span className="text-xs font-medium text-[#888] uppercase tracking-wide">Explorer</span>
          <button className="p-1 hover:bg-[#2a2a2a] rounded transition-colors">
            <Plus className="w-3.5 h-3.5 text-[#555]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-0.5">
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
        <div className="h-10 bg-[#232323] border-b border-[#333] flex items-center px-3 gap-2">
          {/* View Mode Tabs */}
          <div className="flex bg-[#1a1a1a] rounded p-0.5 border border-[#333]">
            <ViewTab
              active={viewMode === "code"}
              onClick={() => setViewMode("code")}
              icon={<Code2 className="w-3.5 h-3.5" />}
              label="Code"
            />
            <ViewTab
              active={viewMode === "canvas"}
              onClick={() => setViewMode("canvas")}
              icon={<GitBranch className="w-3.5 h-3.5" />}
              label="Canvas"
            />
            <ViewTab
              active={viewMode === "split"}
              onClick={() => setViewMode("split")}
              icon={
                <div className="flex gap-0.5">
                  <div className="w-1 h-2.5 bg-current rounded-sm" />
                  <div className="w-1 h-2.5 bg-current rounded-sm" />
                </div>
              }
              label="Split"
            />
          </div>

          <div className="w-px h-5 bg-[#333] mx-1" />

          <button className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2a2a2a] hover:bg-[#333] border border-[#333] rounded text-xs text-[#888] hover:text-[#d4d4d4] transition-colors">
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1 bg-[#6b9b6b] hover:bg-[#7bab7b] rounded text-xs text-[#1a1a1a] font-medium transition-colors">
            <Play className="w-3.5 h-3.5" />
            Compile
          </button>

          <div className="flex-1" />

          <span className="text-xs text-[#555] font-mono">{activeFile}</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          {(viewMode === "code" || viewMode === "split") && (
            <div className={viewMode === "split" ? "w-1/2 border-r border-[#333]" : "flex-1"}>
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  padding: { top: 12 },
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
            <div className={`${viewMode === "split" ? "w-1/2" : "flex-1"} bg-grid`}>
              <WorkflowCanvas code={code} onWorkflowChange={handleWorkflowChange} />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="w-64 bg-[#232323] border-l border-[#333] flex flex-col">
        <div className="p-3 border-b border-[#333]">
          <span className="text-xs font-medium text-[#888] uppercase tracking-wide">Output</span>
        </div>
        <div className="flex-1 p-3 text-xs text-[#555] overflow-y-auto">
          <p className="mb-3">Compile your agent to see the generated code.</p>

          <div className="bg-[#1a1a1a] rounded p-2.5 mb-2 border border-[#333]">
            <div className="text-[10px] text-[#555] mb-1 uppercase tracking-wide">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6b9b6b]" />
              <span className="text-[#6b9b6b]">Ready</span>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded p-2.5 border border-[#333]">
            <div className="text-[10px] text-[#555] mb-1 uppercase tracking-wide">Target</div>
            <select className="w-full bg-[#2a2a2a] border border-[#333] rounded px-2 py-1 text-xs text-[#888] focus:border-[#444] focus:outline-none transition-colors">
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
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
        active
          ? "bg-[#333] text-[#d4d4d4]"
          : "text-[#555] hover:text-[#888]"
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
      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
        active
          ? "bg-[#333] text-[#d4d4d4]"
          : "text-[#555] hover:text-[#888] hover:bg-[#2a2a2a]"
      }`}
    >
      <File className="w-3.5 h-3.5" />
      {name}
    </button>
  );
}

function FolderItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs text-[#555]">
      <FolderOpen className="w-3.5 h-3.5" />
      {name}
    </div>
  );
}
