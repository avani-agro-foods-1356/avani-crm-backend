"use client";
import { useState, useEffect } from "react";
import { Settings, Save, Key, Shield, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Avani Loan Services");
  const [timezone, setTimezone] = useState("IST");
  const [currency, setCurrency] = useState("INR");
  const [autoReply, setAutoReply] = useState(true);
  
  // Meta and Gemini credentials state
  const [whatsappToken, setWhatsappToken] = useState("");
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [backendApiUrl, setBackendApiUrl] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Helper to get active backend URL dynamically
  const API_URL = typeof window !== 'undefined' ? (localStorage.getItem('AVANI_API_URL') || '/api') : '/api';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBackendApiUrl(localStorage.getItem('AVANI_API_URL') || "");
    }
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          setName(data[0].name || "");
          setTimezone(data[0].timezone || "IST");
          setCurrency(data[0].currency || "INR");
          setAutoReply(data[0].autoReply !== false);
          setWhatsappToken(data[0].whatsappToken || "");
          setWhatsappPhoneNumberId(data[0].whatsappPhoneNumberId || "");
          setGeminiApiKey(data[0].geminiApiKey || "");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [API_URL]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const trimmedUrl = backendApiUrl.trim();
      if (typeof window !== 'undefined') {
        if (trimmedUrl) {
          localStorage.setItem('AVANI_API_URL', trimmedUrl);
        } else {
          localStorage.removeItem('AVANI_API_URL');
        }
      }
      
      const activeUrl = trimmedUrl || API_URL;
      const res = await fetch(`${activeUrl}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          timezone, 
          currency, 
          autoReply,
          whatsappToken,
          whatsappPhoneNumberId,
          geminiApiKey
        }),
      });
      if (res.ok) {
        alert("Settings and Meta WhatsApp API configurations updated successfully! Backend server will restart in a few seconds.");
        window.location.reload();
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const tokenLooksExpired = whatsappToken && whatsappToken.length < 100;

  if (loading) return <div className="text-zinc-500 text-center py-12">Loading settings...</div>;

  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          Workspace Settings
        </h2>
        <p className="text-sm text-zinc-400">Configure global business settings and Meta Developer integrations.</p>
      </div>

      {/* Token Expiry Warning Banner - Hide if token looks valid */}
      {(!whatsappToken || whatsappToken.length <= 180) && (
        <div className="flex gap-3 p-4 bg-red-950/60 border border-red-700 rounded-xl items-start">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-red-300">⚠️ WhatsApp Token Expires Every 24 Hours</p>
            <p className="text-xs text-red-400 leading-relaxed">
              Temporary tokens cause <strong>FAILED</strong> dispatches. You must generate a <strong>permanent System User token</strong> (never expires) from Meta Business Manager.
            </p>
            <a
              href="https://business.facebook.com/settings/system-users"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors w-fit"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Meta Business Manager → System Users
            </a>
            <p className="text-[10px] text-red-500 mt-1">
              Steps: Add System User → Generate Token → Select your App → Enable <code>whatsapp_business_messaging</code> → Set Expiry: <strong>Never</strong> → Paste below
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Business settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white border-b border-zinc-850 pb-2 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            General Config
          </h3>
          
          <div>
            <label className="block text-xs font-semibold text-zinc-450 uppercase tracking-wider mb-2">Business Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-450 uppercase tracking-wider mb-2">Backend API URL (Cloudflare Tunnel)</label>
            <input
              type="text"
              value={backendApiUrl}
              onChange={(e) => setBackendApiUrl(e.target.value)}
              placeholder="e.g. https://xxxx.trycloudflare.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-450 uppercase tracking-wider mb-2">Timezone</label>
            <input
              type="text"
              required
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-450 uppercase tracking-wider mb-2">Currency Code</label>
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
            <label htmlFor="autoReply" className="text-xs font-semibold text-zinc-350 select-none cursor-pointer">
              Enable 24/7 AI Auto-Replies
            </label>
          </div>
        </div>

        {/* Right Column: WhatsApp & Gemini setup credentials */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white border-b border-zinc-850 pb-2 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            Meta WhatsApp Credentials
          </h3>
          
          <div>
            <label className="block text-xs font-semibold text-zinc-450 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              Meta WhatsApp Permanent Token
              <span className="text-[9px] bg-red-950 text-red-400 font-bold px-1.5 py-0.5 rounded uppercase">⚠ Must Never Expire</span>
            </label>
            <input
              type="text"
              value={whatsappToken}
              onChange={(e) => setWhatsappToken(e.target.value)}
              placeholder="EAAdIUij... (paste permanent System User token)"
              className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none font-mono ${
                whatsappToken && whatsappToken.length > 180 
                  ? 'border-emerald-700 focus:border-emerald-600' 
                  : 'border-red-800 focus:border-red-600'
              }`}
            />
            {whatsappToken && whatsappToken.length > 180 && (
              <p className="text-[10px] text-emerald-500 mt-1">✅ Token looks valid (long enough)</p>
            )}
            {whatsappToken && whatsappToken.length <= 180 && (
              <p className="text-[10px] text-red-500 mt-1">❌ Token too short — temporary tokens expire in 24h. Generate a permanent one.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              WhatsApp Phone Number ID
              <span className="text-[9px] bg-indigo-950 text-indigo-400 font-bold px-1.5 py-0.5 rounded uppercase">Required</span>
            </label>
            <input
              type="text"
              value={whatsappPhoneNumberId}
              onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
              placeholder="e.g. 105634582910482"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              Google Gemini API Key
              <span className="text-[9px] bg-zinc-800 text-zinc-400 font-bold px-1.5 py-0.5 rounded uppercase">Optional</span>
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          <div className="flex gap-2 p-3 bg-zinc-950 rounded-lg border border-amber-900/50 items-start">
            <RefreshCw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-zinc-400 leading-relaxed space-y-1">
              <p className="font-bold text-amber-400">How to get a Permanent Token:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-zinc-500">
                <li>Go to <strong className="text-zinc-300">business.facebook.com → Settings → System Users</strong></li>
                <li>Click <strong className="text-zinc-300">Add</strong> → Name: avani-crm-bot → Role: Admin</li>
                <li>Click <strong className="text-zinc-300">Generate New Token</strong></li>
                <li>Select your WhatsApp App → Set Expiry: <strong className="text-zinc-300">Never</strong></li>
                <li>Enable: <code className="text-indigo-400">whatsapp_business_messaging</code></li>
                <li>Copy &amp; paste the token above → Save</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Save button spanning both columns */}
        <div className="md:col-span-2">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 text-sm w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Configurations..." : "Save Workspace Credentials"}
          </button>
        </div>
      </form>
    </div>
  );
}
