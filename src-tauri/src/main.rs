// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::compile_sag,
            commands::run_agent,
            commands::stop_agent,
            commands::get_agent_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
