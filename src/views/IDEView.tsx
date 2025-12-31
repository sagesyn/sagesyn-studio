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
    <div className="flex h-full bg-[#0a0a0f]">
      {/* File Explorer */}
      <div className="w-56 bg-[#12121a] border-r border-[#2a2a3a] flex flex-col">
        <div className="p-3 border-b border-[#2a2a3a] flex items-center justify-between">
          <span className="text-sm font-medium text-[#8888aa]">Explorer</span>
          <button className="p-1 hover:bg-[#1a1a24] rounded transition-colors">
            <Plus className="w-4 h-4 text-[#555566]" />
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
        <div className="h-12 bg-[#12121a] border-b border-[#2a2a3a] flex items-center px-4 gap-2">
          {/* View Mode Tabs */}
          <div className="flex bg-[#1a1a24] rounded-lg p-1">
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

          <div className="w-px h-6 bg-[#2a2a3a] mx-2" />

          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24] hover:bg-[#2a2a3a] border border-[#2a2a3a] rounded text-sm text-[#8888aa] hover:text-white transition-all">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #00f2fe 0%, #ff00ff 100%)",
              boxShadow: "0 0 20px rgba(0,242,254,0.3), 0 0 20px rgba(255,0,255,0.3)",
            }}
          >
            <Play className="w-4 h-4" />
            Compile
          </button>

          <div className="flex-1" />

          <span className="text-sm text-[#555566]">{activeFile}</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          {(viewMode === "code" || viewMode === "split") && (
            <div className={viewMode === "split" ? "w-1/2 border-r border-[#2a2a3a]" : "flex-1"}>
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
            <div className={`${viewMode === "split" ? "w-1/2" : "flex-1"} bg-grid`}>
              <WorkflowCanvas code={code} onWorkflowChange={handleWorkflowChange} />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="w-72 bg-[#12121a] border-l border-[#2a2a3a] flex flex-col">
        <div className="p-3 border-b border-[#2a2a3a]">
          <span className="text-sm font-medium text-[#8888aa]">Output</span>
        </div>
        <div className="flex-1 p-4 text-sm text-[#555566] overflow-y-auto">
          <p className="mb-4">Compile your agent to see the generated code.</p>

          <div className="bg-[#1a1a24] rounded-lg p-3 mb-3 border border-[#2a2a3a]">
            <div className="text-xs text-[#555566] mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "#00ff88",
                  boxShadow: "0 0 8px rgba(0,255,136,0.6)"
                }}
              />
              <span className="text-[#00ff88]">Ready</span>
            </div>
          </div>

          <div className="bg-[#1a1a24] rounded-lg p-3 border border-[#2a2a3a]">
            <div className="text-xs text-[#555566] mb-1">Target</div>
            <select className="w-full bg-[#0a0a0f] border border-[#2a2a3a] rounded px-2 py-1 text-sm text-[#8888aa] focus:border-[#00f2fe] focus:outline-none transition-colors">
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
      className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm transition-all ${
        active
          ? "text-white"
          : "text-[#555566] hover:text-[#8888aa]"
      }`}
      style={active ? {
        background: "linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(255,0,255,0.2) 100%)",
        boxShadow: "0 0 15px rgba(0,242,254,0.2)",
      } : undefined}
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
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all ${
        active
          ? "text-[#00f2fe]"
          : "text-[#555566] hover:text-[#8888aa] hover:bg-[#1a1a24]"
      }`}
      style={active ? {
        background: "linear-gradient(135deg, rgba(0,242,254,0.1) 0%, rgba(0,242,254,0.05) 100%)",
        boxShadow: "0 0 10px rgba(0,242,254,0.1)",
      } : undefined}
    >
      <File className="w-4 h-4" />
      {name}
    </button>
  );
}

function FolderItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-[#555566]">
      <FolderOpen className="w-4 h-4" />
      {name}
    </div>
  );
}
