const fs = require('fs');

const API_URL = 'https://workplace-kay-exchanges-psi.trycloudflare.com';

const pages = [
  {
    path: 'campaigns',
    title: 'Campaigns',
    desc: 'Manage and send WhatsApp broadcast campaigns',
    fields: [{ key: 'name', label: 'Campaign Name' }, { key: 'status', label: 'Status' }],
    createPrompt: 'Enter campaign name:',
    createKey: 'name'
  },
  {
    path: 'forms',
    title: 'WhatsApp Forms',
    desc: 'Build interactive collection forms for WhatsApp chat',
    fields: [{ key: 'name', label: 'Form Name' }, { key: 'fields', label: 'Fields Schema' }],
    createPrompt: 'Enter form name:',
    createKey: 'name',
    extraBodyFields: { fields: 'name, phone, income, profession' }
  },
  {
    path: 'columns',
    title: 'Custom Columns',
    desc: 'Add custom data fields to your contact profiles',
    fields: [{ key: 'name', label: 'Column Name' }, { key: 'type', label: 'Data Type' }],
    createPrompt: 'Enter custom column name:',
    createKey: 'name',
    extraBodyFields: { type: 'TEXT' }
  },
  {
    path: 'opts',
    title: 'Opts Management',
    desc: 'Manage WhatsApp opt-in and opt-out preferences',
    fields: [{ key: 'phone', label: 'Phone Number' }, { key: 'status', label: 'Status' }],
    createPrompt: 'Enter phone number for opt-in (e.g. +919876543210):',
    createKey: 'phone',
    extraBodyFields: { status: 'OPTED_IN' }
  },
  {
    path: 'faq',
    title: 'FAQ Bot',
    desc: 'Define frequently asked questions and automated support keyword triggers',
    fields: [{ key: 'trigger', label: 'Keyword Trigger' }, { key: 'reply', label: 'Automated Reply' }],
    createPrompt: 'Enter keyword trigger:',
    createKey: 'trigger',
    extraBodyFields: { reply: 'Thank you for your query. Our agent will contact you shortly.' }
  },
  {
    path: 'flows',
    title: 'WhatsApp Flows',
    desc: 'Build multi-step conversational menus and interactive flows',
    fields: [{ key: 'name', label: 'Flow Name' }, { key: 'description', label: 'Description' }],
    createPrompt: 'Enter flow name:',
    createKey: 'name',
    extraBodyFields: { description: 'Interactive WhatsApp flow steps' }
  },
  {
    path: 'knowledge',
    title: 'Knowledge Base',
    desc: 'Store company policies, loan criteria, and training materials for AI',
    fields: [{ key: 'title', label: 'Article Title' }, { key: 'content', label: 'Content Outline' }],
    createPrompt: 'Enter article title:',
    createKey: 'title',
    extraBodyFields: { content: 'This article outlines key eligibility criteria for Personal and Home loans.' }
  },
  {
    path: 'developers',
    title: 'Developers & APIs',
    desc: 'Manage API keys and developer configurations',
    fields: [{ key: 'name', label: 'Key Name' }, { key: 'apiKey', label: 'API Token' }],
    createPrompt: 'Enter API key label name:',
    createKey: 'name',
    extraBodyFields: { apiKey: 'avani_live_' + Math.random().toString(36).substring(2, 15) }
  }
];

pages.forEach(p => {
  const code = `"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('${API_URL}/${p.path}');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    const val = prompt("${p.createPrompt}");
    if (!val) return;

    try {
      const response = await fetch('${API_URL}/${p.path}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ${p.createKey}: val,
          ${Object.entries(p.extraBodyFields || {}).map(([k, v]) => `${k}: "${v}"`).join(',\n          ')}
        }),
      });
      if (response.ok) {
        alert("${p.title} added successfully!");
        fetchData();
      } else {
        alert("Failed to add.");
      }
    } catch (error) {
      console.error("Failed to add", error);
      alert("Error adding item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(\`${API_URL}/${p.path}/\${id}\`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">${p.title}</h2>
          <p className="text-sm text-zinc-400">${p.desc}</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" />
          Add ${p.title.slice(0, -1)}
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-300 uppercase bg-zinc-800/50 border-b border-zinc-800">
              <tr>
                ${p.fields.map(f => `<th className="px-6 py-4 font-semibold">${f.label}</th>`).join('\n                ')}
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={${p.fields.length + 2}} className="px-6 py-8 text-center text-zinc-500">No items found. Click Add to create one.</td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  ${p.fields.map(f => `<td className="px-6 py-4 font-medium text-zinc-200">{item.${f.key} || '-'}</td>`).join('\n                  ')}
                  <td className="px-6 py-4">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`;
  fs.writeFileSync('src/app/' + p.path + '/page.tsx', code, 'utf8');
});

// Scaffold Workspace Settings
const settingsCode = `"use client";
import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Avani Loan Services");
  const [timezone, setTimezone] = useState("IST");
  const [currency, setCurrency] = useState("INR");
  const [autoReply, setAutoReply] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('${API_URL}/settings')
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
      const res = await fetch('${API_URL}/settings', {
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
`;
fs.writeFileSync('src/app/settings/page.tsx', settingsCode, 'utf8');

// Scaffold AI Assistant Config
const assistantCode = `"use client";
import { useState, useEffect } from "react";
import { Bot, Save } from "lucide-react";

export default function AssistantPage() {
  const [name, setName] = useState("Avani Agent");
  const [model, setModel] = useState("gemini-1.5-flash");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('${API_URL}/assistant')
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          setName(data[0].name || "");
          setModel(data[0].model || "gemini-1.5-flash");
          setSystemPrompt(data[0].systemPrompt || "");
          setTemperature(data[0].temperature || 0.7);
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
      const res = await fetch('${API_URL}/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, model, systemPrompt, temperature }),
      });
      if (res.ok) {
        alert("AI assistant configured successfully!");
      } else {
        alert("Failed to configure AI assistant");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-zinc-500 text-center py-12">Loading assistant settings...</div>;

  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Assistant Config
        </h2>
        <p className="text-sm text-zinc-400">Configure AI auto-pilot system instructions and parameters.</p>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Agent Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">System Instructions (Prompt)</label>
          <textarea
            rows={5}
            required
            placeholder="Introduce yourself as Avani Agent. Help qualify customers looking for home/personal loans..."
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Temperature ({temperature})</label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <button type="submit" className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 text-sm w-full">
          <Save className="w-4 h-4" />
          Save AI Configurations
        </button>
      </form>
    </div>
  );
};
`;
fs.writeFileSync('src/app/assistant/page.tsx', assistantCode, 'utf8');

console.log('UI Pages successfully scaffolded.');
