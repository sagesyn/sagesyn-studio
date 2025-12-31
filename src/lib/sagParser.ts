/**
 * Simple SAG code parser for extracting visual workflow elements
 * This is a lightweight parser for the IDE canvas - not a full compiler
 */

export interface ParsedAgent {
  name: string;
  description?: string;
  version?: string;
  model?: {
    provider?: string;
    name?: string;
  };
  position: { line: number; column: number };
}

export interface ParsedTool {
  name: string;
  params: string;
  returnType?: string;
  description?: string;
  agentName: string;
  position: { line: number; column: number };
}

export interface ParsedEvent {
  name: string;
  eventType: "input" | "output" | "start" | "stop" | "custom";
  agentName: string;
  position: { line: number; column: number };
}

export interface ParsedState {
  agentName: string;
  fields: Array<{ name: string; type: string; optional: boolean }>;
  position: { line: number; column: number };
}

export interface ParsedType {
  name: string;
  fields: Array<{ name: string; type: string }>;
  position: { line: number; column: number };
}

export interface ParseResult {
  agents: ParsedAgent[];
  tools: ParsedTool[];
  events: ParsedEvent[];
  states: ParsedState[];
  types: ParsedType[];
  errors: Array<{ message: string; line: number }>;
}

/**
 * Parse SAG code and extract workflow elements
 */
export function parseSagCode(code: string): ParseResult {
  const result: ParseResult = {
    agents: [],
    tools: [],
    events: [],
    states: [],
    types: [],
    errors: [],
  };

  const lines = code.split("\n");
  let currentAgent: string | null = null;
  let braceDepth = 0;
  let inBlock: "agent" | "state" | "type" | null = null;
  let blockStartLine = 0;
  let stateFields: Array<{ name: string; type: string; optional: boolean }> = [];
  let typeFields: Array<{ name: string; type: string }> = [];
  let typeName = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Track brace depth
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    // Parse agent declaration
    const agentMatch = line.match(/^\s*agent\s+(\w+)\s*\{/);
    if (agentMatch) {
      currentAgent = agentMatch[1];
      inBlock = "agent";
      braceDepth = 1;

      // Look ahead for description and version
      let description: string | undefined;
      let version: string | undefined;
      let model: { provider?: string; name?: string } | undefined;

      for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
        const nextLine = lines[j];
        const descMatch = nextLine.match(/description:\s*["'](.+?)["']/);
        if (descMatch) description = descMatch[1];

        const versionMatch = nextLine.match(/version:\s*["'](.+?)["']/);
        if (versionMatch) version = versionMatch[1];

        const providerMatch = nextLine.match(/provider:\s*["'](.+?)["']/);
        const nameMatch = nextLine.match(/name:\s*["'](.+?)["']/);
        if (providerMatch || nameMatch) {
          model = model || {};
          if (providerMatch) model.provider = providerMatch[1];
          if (nameMatch) model.name = nameMatch[1];
        }

        if (nextLine.includes("}") && !nextLine.includes("{")) break;
      }

      result.agents.push({
        name: currentAgent,
        description,
        version,
        model,
        position: { line: lineNum, column: line.indexOf("agent") + 1 },
      });
      continue;
    }

    // Parse tool declaration
    const toolMatch = line.match(/^\s*tool\s+(\w+)\s*\(([^)]*)\)\s*(?:->\s*(\w+))?\s*\{/);
    if (toolMatch && currentAgent) {
      const toolName = toolMatch[1];
      const params = toolMatch[2].trim();
      const returnType = toolMatch[3];

      // Look for description
      let description: string | undefined;
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const descMatch = lines[j].match(/description:\s*["'](.+?)["']/);
        if (descMatch) {
          description = descMatch[1];
          break;
        }
      }

      result.tools.push({
        name: toolName,
        params,
        returnType,
        description,
        agentName: currentAgent,
        position: { line: lineNum, column: line.indexOf("tool") + 1 },
      });
      continue;
    }

    // Parse event handlers (on keyword)
    const eventMatch = line.match(/^\s*on\s+(\w+)\s*\{/);
    if (eventMatch && currentAgent) {
      const eventName = eventMatch[1];
      let eventType: ParsedEvent["eventType"] = "custom";

      if (eventName === "user_message" || eventName === "message") {
        eventType = "input";
      } else if (eventName === "response" || eventName === "output") {
        eventType = "output";
      } else if (eventName === "start" || eventName === "init") {
        eventType = "start";
      } else if (eventName === "stop" || eventName === "shutdown") {
        eventType = "stop";
      }

      result.events.push({
        name: eventName,
        eventType,
        agentName: currentAgent,
        position: { line: lineNum, column: line.indexOf("on") + 1 },
      });
      continue;
    }

    // Parse state block
    const stateMatch = line.match(/^\s*state\s*\{/);
    if (stateMatch && currentAgent) {
      inBlock = "state";
      blockStartLine = lineNum;
      stateFields = [];
      continue;
    }

    // Parse state fields
    if (inBlock === "state" && currentAgent) {
      const fieldMatch = line.match(/^\s*(\w+)(\?)?\s*:\s*(\w+)/);
      if (fieldMatch) {
        stateFields.push({
          name: fieldMatch[1],
          type: fieldMatch[3],
          optional: fieldMatch[2] === "?",
        });
      }

      if (line.includes("}")) {
        result.states.push({
          agentName: currentAgent,
          fields: stateFields,
          position: { line: blockStartLine, column: 1 },
        });
        inBlock = null;
        stateFields = [];
      }
      continue;
    }

    // Parse type declaration
    const typeMatch = line.match(/^\s*type\s+(\w+)\s*\{/);
    if (typeMatch) {
      inBlock = "type";
      typeName = typeMatch[1];
      blockStartLine = lineNum;
      typeFields = [];
      continue;
    }

    // Parse type fields
    if (inBlock === "type") {
      const fieldMatch = line.match(/^\s*(\w+)\s*:\s*(\w+)/);
      if (fieldMatch) {
        typeFields.push({
          name: fieldMatch[1],
          type: fieldMatch[2],
        });
      }

      if (line.includes("}")) {
        result.types.push({
          name: typeName,
          fields: typeFields,
          position: { line: blockStartLine, column: 1 },
        });
        inBlock = null;
        typeFields = [];
      }
      continue;
    }

    // Update brace depth for agent scope tracking
    if (inBlock === "agent") {
      braceDepth += openBraces - closeBraces;
      if (braceDepth <= 0) {
        currentAgent = null;
        inBlock = null;
        braceDepth = 0;
      }
    }
  }

  return result;
}

/**
 * Generate workflow nodes from parsed SAG code
 */
export function generateNodesFromParsed(parsed: ParseResult): {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
} {
  const nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }> = [];

  const edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }> = [];

  // Layout constants
  const AGENT_X = 300;
  const AGENT_Y_START = 100;
  const AGENT_Y_SPACING = 400;
  const TOOL_X_OFFSET = -250;
  const TOOL_Y_SPACING = 100;
  const EVENT_X_OFFSET = 250;
  const EVENT_Y_SPACING = 80;
  const STATE_X_OFFSET = 0;
  const STATE_Y_OFFSET = 200;

  parsed.agents.forEach((agent, agentIndex) => {
    const agentY = AGENT_Y_START + agentIndex * AGENT_Y_SPACING;
    const agentId = `agent-${agent.name}`;

    // Add agent node
    nodes.push({
      id: agentId,
      type: "agent",
      position: { x: AGENT_X, y: agentY },
      data: {
        label: agent.name,
        description: agent.description,
        version: agent.version,
        model: agent.model?.name,
      },
    });

    // Add tools for this agent
    const agentTools = parsed.tools.filter((t) => t.agentName === agent.name);
    agentTools.forEach((tool, toolIndex) => {
      const toolId = `tool-${agent.name}-${tool.name}`;
      nodes.push({
        id: toolId,
        type: "tool",
        position: {
          x: AGENT_X + TOOL_X_OFFSET,
          y: agentY - 50 + toolIndex * TOOL_Y_SPACING,
        },
        data: {
          label: tool.name,
          params: tool.params,
          returns: tool.returnType,
        },
      });

      // Connect tool to agent
      edges.push({
        id: `edge-${toolId}-${agentId}`,
        source: toolId,
        target: agentId,
      });
    });

    // Add events for this agent
    const agentEvents = parsed.events.filter((e) => e.agentName === agent.name);
    agentEvents.forEach((event, eventIndex) => {
      const eventId = `event-${agent.name}-${event.name}`;
      nodes.push({
        id: eventId,
        type: "event",
        position: {
          x: AGENT_X + EVENT_X_OFFSET,
          y: agentY - 30 + eventIndex * EVENT_Y_SPACING,
        },
        data: {
          label: event.name,
          eventType: event.eventType,
        },
      });

      // Connect agent to event
      edges.push({
        id: `edge-${agentId}-${eventId}`,
        source: agentId,
        target: eventId,
      });
    });

    // Add state for this agent
    const agentState = parsed.states.find((s) => s.agentName === agent.name);
    if (agentState) {
      const stateId = `state-${agent.name}`;
      nodes.push({
        id: stateId,
        type: "state",
        position: {
          x: AGENT_X + STATE_X_OFFSET,
          y: agentY + STATE_Y_OFFSET,
        },
        data: {
          label: "State",
          fields: agentState.fields.map(
            (f) => `${f.name}${f.optional ? "?" : ""}: ${f.type}`
          ),
        },
      });

      // Connect state to agent
      edges.push({
        id: `edge-${agentId}-${stateId}`,
        source: agentId,
        target: stateId,
        sourceHandle: "state",
      });
    }
  });

  return { nodes, edges };
}
