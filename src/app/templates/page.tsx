"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Send } from "lucide-react";

const API_URL = 'https://workplace-kay-exchanges-psi.trycloudflare.com';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("MARKETING");

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/templates`);
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    try {
      const res = await fetch(`${API_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content, category }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setName("");
        setContent("");
        setCategory("MARKETING");
        fetchTemplates();
      } else {
        alert("Failed to create template");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating template");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`${API_URL}/templates/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">WhatsApp Templates</h2>
          <p className="text-sm text-zinc-400">Draft, submit, and manage pre-approved WhatsApp message templates.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-center py-12">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-500">
          <FileText className="w-12 h-12 text-zinc-700 mb-3" />
          <h3 className="text-zinc-300 font-medium mb-1">No templates found</h3>
          <p className="text-sm text-center max-w-xs mb-4">Create your first template for marketing, utility alerts, or verification codes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300 uppercase">
                    {tpl.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-950 text-emerald-400">
                    {tpl.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-zinc-100 mb-2">{tpl.name}</h4>
                <p className="text-sm text-zinc-400 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60 font-mono whitespace-pre-wrap">
                  {tpl.content}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800/80">
                <span className="text-xs text-zinc-500">{new Date(tpl.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(tpl.id)}
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New WhatsApp Template</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. loan_approval_notification"
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
                >
                  <option value="MARKETING">Marketing</option>
                  <option value="UTILITY">Utility</option>
                  <option value="AUTHENTICATION">Authentication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Template Message Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Hello {{1}}, your personal loan of {{2}} has been successfully approved! Let us know if you have any questions."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
