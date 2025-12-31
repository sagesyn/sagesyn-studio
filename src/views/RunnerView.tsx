import { useState } from "react";
import {
  Play,
  Square,
  MessageSquare,
  Wrench,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Mock agent data
const MOCK_AGENTS = [
  { id: "1", name: "WeatherAgent", status: "idle", file: "weather-agent.sag" },
  { id: "2", name: "DataProcessor", status: "running", file: "processor.sag" },
];

const MOCK_MESSAGES = [
  {
    id: "1",
    type: "user",
    content: "What's the weather in San Francisco?",
    timestamp: "10:32:15",
  },
  {
    id: "2",
    type: "agent",
    content:
      "The current weather in San Francisco is 18°C with partly cloudy skies.",
    timestamp: "10:32:17",
  },
  {
    id: "3",
    type: "tool",
    content: "get_weather(city: 'San Francisco')",
    timestamp: "10:32:16",
  },
];

export default function RunnerView() {
  const [selectedAgent, setSelectedAgent] = useState(MOCK_AGENTS[0]);
  const [input, setInput] = useState("");

  return (
    <div className="flex h-full">
      {/* Agent List */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-3 border-b border-gray-800">
          <span className="text-sm font-medium text-gray-300">Agents</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_AGENTS.map((agent) => (
            <AgentItem
              key={agent.id}
              agent={agent}
              selected={selectedAgent.id === agent.id}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      </div>

      {/* Chat/Interaction Area */}
      <div className="flex-1 flex flex-col">
        {/* Agent Header */}
        <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                selectedAgent.status === "running"
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            />
            <div>
              <h2 className="font-medium">{selectedAgent.name}</h2>
              <p className="text-xs text-gray-400">{selectedAgent.file}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedAgent.status === "running" ? (
              <button className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm">
                <Square className="w-4 h-4" />
                Stop
              </button>
            ) : (
              <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded text-sm">
                <Play className="w-4 h-4" />
                Start
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {MOCK_MESSAGES.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message to the agent..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="p-3 border-b border-gray-800">
          <span className="text-sm font-medium text-gray-300">
            Agent Details
          </span>
        </div>

        <div className="p-4 space-y-4">
          <StatCard
            icon={<Activity className="w-5 h-5 text-purple-400" />}
            label="Status"
            value={selectedAgent.status}
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-blue-400" />}
            label="Messages"
            value="3"
          />
          <StatCard
            icon={<Wrench className="w-5 h-5 text-amber-400" />}
            label="Tool Calls"
            value="1"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-gray-400" />}
            label="Uptime"
            value="5m 32s"
          />
        </div>

        <div className="p-3 border-t border-gray-800 mt-auto">
          <span className="text-sm font-medium text-gray-300">State</span>
        </div>
        <div className="p-4">
          <pre className="text-xs text-gray-400 bg-gray-800 rounded p-3 overflow-x-auto">
            {JSON.stringify({ lastCity: "San Francisco" }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function AgentItem({
  agent,
  selected,
  onClick,
}: {
  agent: (typeof MOCK_AGENTS)[0];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
        selected
          ? "bg-purple-600/20 text-purple-300"
          : "text-gray-400 hover:bg-gray-800"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          agent.status === "running" ? "bg-green-500" : "bg-gray-500"
        }`}
      />
      <div>
        <div className="text-sm font-medium">{agent.name}</div>
        <div className="text-xs text-gray-500">{agent.status}</div>
      </div>
    </button>
  );
}

function Message({ message }: { message: (typeof MOCK_MESSAGES)[0] }) {
  const icons = {
    user: <MessageSquare className="w-4 h-4" />,
    agent: <CheckCircle className="w-4 h-4" />,
    tool: <Wrench className="w-4 h-4" />,
  };

  const colors = {
    user: "border-blue-500/30 bg-blue-500/10",
    agent: "border-purple-500/30 bg-purple-500/10",
    tool: "border-amber-500/30 bg-amber-500/10",
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[message.type as keyof typeof colors]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icons[message.type as keyof typeof icons]}
        <span className="text-xs text-gray-400 capitalize">{message.type}</span>
        <span className="text-xs text-gray-500 ml-auto">
          {message.timestamp}
        </span>
      </div>
      <p className="text-sm">{message.content}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
      {icon}
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-medium capitalize">{value}</div>
      </div>
    </div>
  );
}
