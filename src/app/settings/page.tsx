"use client";
import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Avani Loan Services");
  const [timezone, setTimezone] = useState("IST");
  const [currency, setCurrency] = useState("INR");
  const [autoReply, setAutoReply] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://workplace-kay-exchanges-psi.trycloudflare.com/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          setName(data[0].name || "");
          setTimezone(data[0].timezone || "IST");
          setCurrency(data[0].currency || "INR");
          setAutoReply(data[0].autoReply !== false);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://workplace-kay-exchanges-psi.trycloudflare.com/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, timezone, currency, autoReply }),
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-zinc-500 text-center py-12">Loading settings...</div>;

  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-lg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Workspace Settings
        </h2>
        <p className="text-sm text-zinc-400">Configure global configurations for Avani Loan Services CRM.</p>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Business Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Timezone</label>
          <input
            type="text"
            required
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Currency Code</label>
          <input
            type="text"
            required
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="autoReply"
            checked={autoReply}
            onChange={(e) => setAutoReply(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="autoReply" className="text-sm font-semibold text-zinc-300 select-none cursor-pointer">
            Enable 24/7 AI Auto-Replies
          </label>
        </div>

        <button type="submit" className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 text-sm w-full">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </form>
    </div>
  );
};
