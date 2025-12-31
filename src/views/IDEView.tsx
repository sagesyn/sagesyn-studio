import { useState } from "react";
import { File, FolderOpen, Plus, Save, Play } from "lucide-react";
import Editor from "@monaco-editor/react";

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

export default function IDEView() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [activeFile, setActiveFile] = useState("weather-agent.sag");

  return (
    <div className="flex h-full">
      {/* File Explorer */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
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

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-2">
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

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
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
      </div>

      {/* Right Panel - Preview/Output */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="p-3 border-b border-gray-800">
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>
        <div className="flex-1 p-4 text-sm text-gray-400">
          <p>Compile your agent to see the generated code.</p>
        </div>
      </div>
    </div>
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
