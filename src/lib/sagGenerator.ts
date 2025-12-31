/**
 * SAG code generator from workflow nodes
 * Generates .sag code from visual workflow representation
 */

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface AgentData {
  label: string;
  description?: string;
  version?: string;
  model?: string;
}

interface ToolData {
  label: string;
  params?: string;
  returns?: string;
  description?: string;
}

interface EventData {
  label: string;
  eventType?: string;
}

interface StateData {
  label: string;
  fields?: string[];
}

/**
 * Generate SAG code from workflow nodes and edges
 */
export function generateSagCode(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): string {
  const lines: string[] = [];

  // Group nodes by type
  const agents = nodes.filter((n) => n.type === "agent");
  const tools = nodes.filter((n) => n.type === "tool");
  const events = nodes.filter((n) => n.type === "event");
  const states = nodes.filter((n) => n.type === "state");

  // Build agent-to-children mapping from edges
  const agentChildren = new Map<string, { tools: string[]; events: string[]; state: string | null }>();

  agents.forEach((agent) => {
    agentChildren.set(agent.id, { tools: [], events: [], state: null });
  });

  // Map tools, events, and states to their parent agents via edges
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) return;

    // Tool connected to agent
    if (sourceNode.type === "tool" && targetNode.type === "agent") {
      const children = agentChildren.get(targetNode.id);
      if (children) children.tools.push(sourceNode.id);
    }
    if (targetNode.type === "tool" && sourceNode.type === "agent") {
      const children = agentChildren.get(sourceNode.id);
      if (children) children.tools.push(targetNode.id);
    }

    // Event connected to agent
    if (sourceNode.type === "event" && targetNode.type === "agent") {
      const children = agentChildren.get(targetNode.id);
      if (children) children.events.push(sourceNode.id);
    }
    if (targetNode.type === "event" && sourceNode.type === "agent") {
      const children = agentChildren.get(sourceNode.id);
      if (children) children.events.push(targetNode.id);
    }

    // State connected to agent
    if (sourceNode.type === "state" && targetNode.type === "agent") {
      const children = agentChildren.get(targetNode.id);
      if (children) children.state = sourceNode.id;
    }
    if (targetNode.type === "state" && sourceNode.type === "agent") {
      const children = agentChildren.get(sourceNode.id);
      if (children) children.state = targetNode.id;
    }
  });

  // Generate code for each agent
  agents.forEach((agent, index) => {
    if (index > 0) lines.push("");

    const data = agent.data as AgentData;
    const children = agentChildren.get(agent.id);

    lines.push(`agent ${data.label} {`);

    // Description and version
    if (data.description) {
      lines.push(`  description: "${data.description}"`);
    }
    if (data.version) {
      lines.push(`  version: "${data.version}"`);
    }

    // Model config
    if (data.model) {
      lines.push("");
      lines.push("  model {");
      lines.push(`    provider: "anthropic"`);
      lines.push(`    name: "${data.model}"`);
      lines.push("  }");
    }

    // State block
    if (children?.state) {
      const stateNode = nodes.find((n) => n.id === children.state);
      if (stateNode) {
        const stateData = stateNode.data as StateData;
        if (stateData.fields && stateData.fields.length > 0) {
          lines.push("");
          lines.push("  state {");
          stateData.fields.forEach((field) => {
            lines.push(`    ${field}`);
          });
          lines.push("  }");
        }
      }
    }

    // Tool definitions
    if (children?.tools && children.tools.length > 0) {
      children.tools.forEach((toolId) => {
        const toolNode = nodes.find((n) => n.id === toolId);
        if (toolNode) {
          const toolData = toolNode.data as ToolData;
          lines.push("");

          const params = toolData.params || "";
          const returns = toolData.returns ? ` -> ${toolData.returns}` : "";

          lines.push(`  tool ${toolData.label}(${params})${returns} {`);
          if (toolData.description) {
            lines.push(`    description: "${toolData.description}"`);
          }
          lines.push("    // TODO: Implement tool logic");
          lines.push("  }");
        }
      });
    }

    // Event handlers
    if (children?.events && children.events.length > 0) {
      children.events.forEach((eventId) => {
        const eventNode = nodes.find((n) => n.id === eventId);
        if (eventNode) {
          const eventData = eventNode.data as EventData;
          lines.push("");
          lines.push(`  on ${eventData.label} {`);
          lines.push("    // TODO: Implement event handler");
          lines.push("  }");
        }
      });
    }

    lines.push("}");
  });

  // Handle orphan tools (not connected to any agent)
  const connectedTools = new Set<string>();
  agentChildren.forEach((children) => {
    children.tools.forEach((t) => connectedTools.add(t));
  });

  const orphanTools = tools.filter((t) => !connectedTools.has(t.id));
  if (orphanTools.length > 0 && agents.length === 0) {
    // Create a placeholder agent for orphan tools
    lines.push("agent UnnamedAgent {");
    lines.push('  description: "Auto-generated agent"');

    orphanTools.forEach((toolNode) => {
      const toolData = toolNode.data as ToolData;
      lines.push("");

      const params = toolData.params || "";
      const returns = toolData.returns ? ` -> ${toolData.returns}` : "";

      lines.push(`  tool ${toolData.label}(${params})${returns} {`);
      lines.push("    // TODO: Implement tool logic");
      lines.push("  }");
    });

    lines.push("}");
  }

  // Handle orphan events
  const connectedEvents = new Set<string>();
  agentChildren.forEach((children) => {
    children.events.forEach((e) => connectedEvents.add(e));
  });

  // Handle orphan states - generate as types
  const connectedStates = new Set<string>();
  agentChildren.forEach((children) => {
    if (children.state) connectedStates.add(children.state);
  });

  const orphanStates = states.filter((s) => !connectedStates.has(s.id));
  orphanStates.forEach((stateNode) => {
    const stateData = stateNode.data as StateData;
    if (stateData.fields && stateData.fields.length > 0) {
      lines.push("");
      lines.push(`type ${stateData.label || "CustomState"} {`);
      stateData.fields.forEach((field) => {
        // Convert "name?: type" to "name: type"
        const cleanField = field.replace("?", "");
        lines.push(`  ${cleanField}`);
      });
      lines.push("}");
    }
  });

  return lines.join("\n") + "\n";
}

/**
 * Check if two code strings are semantically equivalent
 * (ignoring whitespace differences)
 */
export function codeEquivalent(code1: string, code2: string): boolean {
  const normalize = (code: string) =>
    code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");

  return normalize(code1) === normalize(code2);
}
