const fs = require('fs');
const API_URL = 'https://celebrity-assessment-lawn-villas.trycloudflare.com';

const pages = [
  { 
    path: 'tags', 
    title: 'Tags', 
    desc: 'Manage your contact tags', 
    fields: [{key: 'name', label: 'Name'}],
    createPrompt: 'Enter tag name:',
    createKey: 'name'
  },
  { 
    path: 'tasks', 
    title: 'Tasks', 
    desc: 'Manage your follow-ups and to-dos', 
    fields: [{key: 'title', label: 'Title'}, {key: 'status', label: 'Status'}],
    createPrompt: 'Enter task title:',
    createKey: 'title'
  },
  { 
    path: 'projects', 
    title: 'Projects', 
    desc: 'Manage your loan projects', 
    fields: [{key: 'name', label: 'Name'}, {key: 'status', label: 'Status'}],
    createPrompt: 'Enter project name:',
    createKey: 'name'
  }
];

pages.forEach(p => {
  const code = `"use client";
import { useState, useEffect } from "react";
import { Plus, MoreHorizontal } from "lucide-react";

export default function ${p.title}Page() {
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
        body: JSON.stringify({ ${p.createKey}: val }),
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
      await fetch(\`${API_URL}/${p.path}/\${id}\`, { method: 'DELETE' });
      fetchData();
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
                  <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
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
