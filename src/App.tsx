import { Routes, Route, NavLink } from "react-router-dom";
import { Code2, Play, Settings } from "lucide-react";
import IDEView from "./views/IDEView";
import RunnerView from "./views/RunnerView";
import SettingsView from "./views/SettingsView";

function App() {
  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      {/* Sidebar */}
      <aside className="w-14 bg-[#232323] border-r border-[#333] flex flex-col items-center py-3 gap-1">
        <div className="mb-3">
          <div className="w-8 h-8 rounded bg-[#2a2a2a] border border-[#444] flex items-center justify-center text-[#888] font-mono text-sm">
            S
          </div>
        </div>

        <NavButton to="/" icon={<Code2 size={18} />} label="IDE" />
        <NavButton to="/runner" icon={<Play size={18} />} label="Runner" />

        <div className="flex-1" />

        <NavButton to="/settings" icon={<Settings size={18} />} label="Settings" />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<IDEView />} />
          <Route path="/runner" element={<RunnerView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
}

function NavButton({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-10 h-10 flex items-center justify-center rounded transition-colors ${
          isActive
            ? "bg-[#333] text-[#d4d4d4]"
            : "text-[#555] hover:text-[#888] hover:bg-[#2a2a2a]"
        }`
      }
      title={label}
    >
      {icon}
    </NavLink>
  );
}

export default App;
