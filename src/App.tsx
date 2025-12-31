import { Routes, Route, NavLink } from "react-router-dom";
import { Code2, Play, Settings, Boxes } from "lucide-react";
import IDEView from "./views/IDEView";
import RunnerView from "./views/RunnerView";
import SettingsView from "./views/SettingsView";

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 gap-2">
        <div className="mb-4">
          <Boxes className="w-8 h-8 text-purple-500" />
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
        `w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
          isActive
            ? "bg-purple-600 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`
      }
      title={label}
    >
      {icon}
    </NavLink>
  );
}

export default App;
