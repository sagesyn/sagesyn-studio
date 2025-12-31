import { Save, FolderOpen, Key, Palette, Code } from "lucide-react";

export default function SettingsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        {/* General Section */}
        <Section title="General" icon={<FolderOpen className="w-5 h-5" />}>
          <SettingItem
            label="Default Project Directory"
            description="Where new projects are created by default"
          >
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue="~/Projects/sagesyn"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
              />
              <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                Browse
              </button>
            </div>
          </SettingItem>

          <SettingItem
            label="Auto-save"
            description="Automatically save files while editing"
          >
            <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm">
              <option value="off">Off</option>
              <option value="delay">After delay (1s)</option>
              <option value="focus">On focus change</option>
            </select>
          </SettingItem>
        </Section>

        {/* Compiler Section */}
        <Section title="Compiler" icon={<Code className="w-5 h-5" />}>
          <SettingItem
            label="Default Target"
            description="The default compilation target for new projects"
          >
            <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm">
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
            </select>
          </SettingItem>

          <SettingItem
            label="Sag Compiler Path"
            description="Path to the sag compiler binary"
          >
            <input
              type="text"
              defaultValue="sag"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </SettingItem>
        </Section>

        {/* API Keys Section */}
        <Section title="API Keys" icon={<Key className="w-5 h-5" />}>
          <SettingItem
            label="Anthropic API Key"
            description="Your Anthropic API key for Claude models"
          >
            <input
              type="password"
              defaultValue="sk-ant-..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm font-mono"
            />
          </SettingItem>

          <SettingItem
            label="OpenAI API Key"
            description="Your OpenAI API key for GPT models"
          >
            <input
              type="password"
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm font-mono"
            />
          </SettingItem>
        </Section>

        {/* Theme Section */}
        <Section title="Appearance" icon={<Palette className="w-5 h-5" />}>
          <SettingItem label="Theme" description="Choose your preferred theme">
            <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </SettingItem>

          <SettingItem
            label="Editor Font Size"
            description="Font size in the code editor"
          >
            <input
              type="number"
              defaultValue={14}
              min={10}
              max={24}
              className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </SettingItem>
        </Section>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-4 bg-gray-900 rounded-lg p-4 border border-gray-800">
        {children}
      </div>
    </div>
  );
}

function SettingItem({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-2">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <p className="text-xs text-gray-400 mb-2">{description}</p>
      {children}
    </div>
  );
}
