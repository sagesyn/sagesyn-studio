import { Routes, Route, NavLink } from "react-router-dom";
import { Code2, Play, Settings } from "lucide-react";
import IDEView from "./views/IDEView";
import RunnerView from "./views/RunnerView";
import SettingsView from "./views/SettingsView";

function App() {
  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-16 bg-[#12121a] border-r border-[#2a2a3a] flex flex-col items-center py-4 gap-2">
        <div className="mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #00f2fe 0%, #ff00ff 100%)",
              boxShadow: "0 0 20px rgba(0,242,254,0.3), 0 0 20px rgba(255,0,255,0.3)",
            }}
          >
            S
          </div>
        </div>

        <NavButton to="/" icon={<Code2 />} label="IDE" />
        <NavButton to="/runner" icon={<Play />} label="Runner" />

        <div className="flex-1" />

        <NavButton to="/settings" icon={<Settings />} label="Settings" />
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
        `w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
          isActive
            ? "text-[#00f2fe]"
            : "text-[#555566] hover:text-[#8888aa] hover:bg-[#1a1a24]"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? {
              background: "linear-gradient(135deg, rgba(0,242,254,0.15) 0%, rgba(255,0,255,0.15) 100%)",
              boxShadow: "0 0 15px rgba(0,242,254,0.2)",
            }
          : undefined
      }
      title={label}
    >
      {icon}
    </NavLink>
  );
}

export default App;
