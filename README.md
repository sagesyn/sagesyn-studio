# SageSyn Studio

Visual IDE and runtime dashboard for the Sage Agent Programming Language.

![SageSyn Studio](docs/screenshot.png)

## Features

### Agent Builder IDE
- **Code Editor** - Monaco-based editor with .sag syntax highlighting
- **File Explorer** - Manage agent projects and files
- **Live Compilation** - Compile to TypeScript, Python, or Go
- **Output Preview** - See generated code in real-time

### Agent Runner Dashboard
- **Agent Management** - Start, stop, and monitor agents
- **Conversation View** - See agent messages and tool calls
- **State Inspector** - View and debug agent state
- **Metrics** - Track messages, tool usage, and uptime

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Tauri v2](https://tauri.app/) |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Editor | Monaco Editor |
| Flow Canvas | XY Flow |
| State | Zustand |
| Backend | Rust |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Rust](https://rustup.rs/) (latest stable)
- [sag compiler](https://github.com/sagesyn/sagesyn-lang) (optional, for compilation)

### Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Building

```bash
# Build for production
npm run tauri build
```

## Project Structure

```
sagesyn-studio/
├── src/                    # React frontend
│   ├── views/              # Main views (IDE, Runner, Settings)
│   ├── components/         # Reusable components
│   ├── stores/             # Zustand state stores
│   └── lib/                # Utilities
├── src-tauri/              # Tauri/Rust backend
│   ├── src/
│   │   ├── main.rs         # App entry point
│   │   └── commands.rs     # Tauri commands
│   └── tauri.conf.json     # Tauri configuration
└── public/                 # Static assets
```

## Roadmap

This is **Phase 2** of the SageSyn roadmap (Q2 2026):

- [ ] Visual workflow designer with XY Flow
- [ ] MCP server integration
- [ ] A2A agent communication
- [ ] AG-UI event streaming
- [ ] Plugin system

## Contributing

See the [SageSyn Team](https://github.com/sagesyn/sagesyn-team) for contribution guidelines.

Primary agents for this repository:
- **CANVAS** - Frontend development
- **PIXEL** - UX/UI design
- **RUST** - Backend development

## License

MIT - See [LICENSE](LICENSE) for details.
