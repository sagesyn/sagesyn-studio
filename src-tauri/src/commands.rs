use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct CompileResult {
    pub success: bool,
    pub output: String,
    pub errors: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AgentState {
    pub id: String,
    pub name: String,
    pub status: String,
    pub state: serde_json::Value,
}

/// Compile a .sag file to the specified target
#[tauri::command]
pub async fn compile_sag(
    source: String,
    target: String,
) -> Result<CompileResult, String> {
    // For now, just echo back the compilation request
    // In the future, this will call the sag compiler

    // Try to find the sag compiler
    let output = Command::new("sag")
        .args(["check", "--stdin"])
        .output();

    match output {
        Ok(result) => {
            if result.status.success() {
                Ok(CompileResult {
                    success: true,
                    output: String::from_utf8_lossy(&result.stdout).to_string(),
                    errors: vec![],
                })
            } else {
                Ok(CompileResult {
                    success: false,
                    output: String::new(),
                    errors: vec![String::from_utf8_lossy(&result.stderr).to_string()],
                })
            }
        }
        Err(_) => {
            // Compiler not found, return mock success for development
            Ok(CompileResult {
                success: true,
                output: format!(
                    "// Mock compiled output for {}\n// Source length: {} chars\n// Target: {}",
                    "agent",
                    source.len(),
                    target
                ),
                errors: vec![],
            })
        }
    }
}

/// Start running an agent
#[tauri::command]
pub async fn run_agent(agent_id: String) -> Result<AgentState, String> {
    // Mock implementation - will connect to actual runtime later
    Ok(AgentState {
        id: agent_id.clone(),
        name: format!("Agent-{}", agent_id),
        status: "running".to_string(),
        state: serde_json::json!({}),
    })
}

/// Stop a running agent
#[tauri::command]
pub async fn stop_agent(agent_id: String) -> Result<AgentState, String> {
    Ok(AgentState {
        id: agent_id.clone(),
        name: format!("Agent-{}", agent_id),
        status: "stopped".to_string(),
        state: serde_json::json!({}),
    })
}

/// Get the current state of an agent
#[tauri::command]
pub async fn get_agent_state(agent_id: String) -> Result<AgentState, String> {
    Ok(AgentState {
        id: agent_id.clone(),
        name: format!("Agent-{}", agent_id),
        status: "idle".to_string(),
        state: serde_json::json!({
            "lastCity": "San Francisco"
        }),
    })
}
