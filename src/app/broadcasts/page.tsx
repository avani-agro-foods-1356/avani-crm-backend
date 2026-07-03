"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { 
  Megaphone, Plus, FileText, Send, Calendar, CheckCircle, 
  AlertTriangle, Play, Upload, HelpCircle, ArrowRight, ArrowLeft, RefreshCw, Trash2
} from "lucide-react";

const API_URL = typeof window !== 'undefined' ? ('https://chemicals-consisting-weekends-viewing.trycloudflare.com/api') : 'https://chemicals-consisting-weekends-viewing.trycloudflare.com/api';

const presetBroadcastTemplates = [
  {
    id: "custom_meta",
    name: "Custom Meta Template (6 Variables)",
    content: "Official Meta Template Payload. Variables will be injected automatically.",
    variablesCount: 6,
    variablesDesc: ["Variable 1", "Variable 2", "Variable 3", "Variable 4", "Variable 5", "Variable 6"]
  },
  {
    id: "p1",
    name: "Personal Loan Inquiry",
    content: "Hello {{1}},\n\nLooking for a Personal Loan?\n\n✅ Quick Approval\n✅ Competitive Interest Rates\n✅ Minimal Documentation\n✅ Flexible EMI Options\n\nReply \"PL\" to get a free eligibility check.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p2",
    name: "Business Loan Inquiry",
    content: "Hello {{1}},\n\nNeed funds to grow your business?\n\n✅ Business Loans\n✅ Working Capital\n✅ Expansion Funding\n✅ Fast Processing\n\nReply \"BL\" for a free consultation.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p3",
    name: "Doctor Loan Inquiry",
    content: "Hello Dr. {{1}},\n\nSpecial financing solutions for doctors and healthcare professionals.\n\n✅ Clinic Setup\n✅ Equipment Purchase\n✅ Working Capital\n✅ Expansion Funding\n\nReply \"DOCTOR\" for details.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Doctor Name"]
  },
  {
    id: "p4",
    name: "Home Loan Inquiry",
    content: "Hello {{1}},\n\nPlanning to buy your dream home?\n\n✅ Home Loan Assistance\n✅ Attractive Interest Rates\n✅ Balance Transfer Options\n✅ Expert Guidance\n\nReply HOME for a free consultation.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p5",
    name: "Mortgage Loan Inquiry",
    content: "Hello {{1}},\n\nNeed funds against your property?\n\n✅ Mortgage Loans\n✅ Higher Loan Amounts\n✅ Flexible Repayment Options\n✅ Quick Processing\n\nReply MORTGAGE for details.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p6",
    name: "Education Loan India",
    content: "Hello {{1}},\n\nPlanning higher education in India?\n\n✅ Education Loans\n✅ Competitive Interest Rates\n✅ Fast Processing\n✅ Expert Support\n\nReply INDIA for details.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Student Name"]
  },
  {
    id: "p7",
    name: "Education Loan Abroad",
    content: "Hello {{1}},\n\nPlanning to study abroad?\n\n✅ Education Loans for Global Studies\n✅ Higher Loan Limits\n✅ Collateral & Non-Collateral Options\n✅ Expert Guidance\n\nReply ABROAD for details.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Student Name"]
  },
  {
    id: "p8",
    name: "School Funding",
    content: "Hello {{1}},\n\nLooking for funding solutions for your school?\n\n✅ Infrastructure Funding\n✅ Working Capital\n✅ Expansion Support\n✅ Customized Financial Solutions\n\nReply SCHOOL for details.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Authority Name"]
  },
  {
    id: "p9",
    name: "College Funding",
    content: "Hello {{1}},\n\nNeed funding support for your college or educational institution?\n\n✅ Infrastructure Finance\n✅ Working Capital\n✅ Expansion Funding\n\nReply COLLEGE for details.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Authority Name"]
  },
  {
    id: "p10",
    name: "Lead Follow-up",
    content: "Hello {{1}},\n\nThank you for showing interest in our loan services.\n\nOur loan advisor is ready to assist you.\n\nPlease reply with your requirement or preferred call time.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p11",
    name: "EMI Reminder",
    content: "Hello {{1}},\n\nThis is a friendly reminder regarding your upcoming EMI payment.\n\nPlease ensure timely payment to avoid penalties.\n\nFor assistance, reply to this message.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p12",
    name: "Document Request",
    content: "Hello {{1}},\n\nTo proceed with your loan application, kindly share the required documents.\n\nOur team will review and guide you through the next steps.\n\nThank you.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p13",
    name: "Loan Status Update",
    content: "Hello {{1}},\n\nYour loan application status has been updated.\n\nOur team will contact you shortly with further details.\n\nThank you for choosing AVANI LOAN SERVICES.\n\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  },
  {
    id: "p14",
    name: "CIBIL Improvement",
    content: "Hello {{1}},\n\nWant to improve your CIBIL Score?\n\n✅ Credit Profile Analysis\n✅ Expert Guidance\n✅ Score Improvement Strategies\n✅ Loan Eligibility Support\n\nReply CIBIL for a free consultation.\n\nAVANI LOAN SERVICES\nSachin Shinde",
    variablesCount: 1,
    variablesDesc: ["Customer Name"]
  }
];

export default function BroadcastPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Wizard States
  const [broadcastName, setBroadcastName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(presetBroadcastTemplates[0]);
  const [csvFileText, setCsvFileText] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<any[]>([]);
  
  // Media Attachment States
  const [mediaType, setMediaType] = useState<"text" | "image" | "video" | "document" | "template">("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  // Mapping States
  const [recipientColumn, setRecipientColumn] = useState("");
  const [variableMappings, setVariableMappings] = useState<Record<string, string>>({ "{{1}}": "" });
  
  // Database Templates
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);

  // Sending Process States
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendStats, setSendStats] = useState({ success: 0, failed: 0, total: 0 });
  const [sendLogs, setSendLogs] = useState<any[]>([]);
  
  // Fetch existing campaigns and templates
  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_URL}/campaigns`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (e) {
      console.error("Failed to fetch campaigns", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/templates`);
      if (res.ok) {
        const data = await res.json();
        const merged: any[] = [...presetBroadcastTemplates];
        const names = new Set(merged.map(t => t.name));
        for (const t of data) {
          if (!names.has(t.name)) {
            // Give them a variablesCount based on how many {{x}} are in content
            const matches = t.content.match(/{{(\d+)}}/g);
            let maxVar = 0;
            if (matches) {
               matches.forEach((m: string) => {
                 const num = parseInt(m.replace(/[^0-9]/g, ''));
                 if (num > maxVar) maxVar = num;
               });
            }
            merged.push({
              id: t.id,
              name: t.name,
              content: t.content,
              variablesCount: maxVar,
              variablesDesc: Array.from({length: maxVar}).map((_, i) => `Variable ${i+1}`),
              volume: t.volume,
              product: t.product
            });
          }
        }
        setDbTemplates(merged);
        if (merged.length > 0) setSelectedTemplate(merged[0]);
      } else {
        setDbTemplates(presetBroadcastTemplates);
      }
    } catch (e) {
      console.error("Failed to fetch templates", e);
      setDbTemplates(presetBroadcastTemplates);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign from history?")) return;
    try {
      const res = await fetch(`${API_URL}/campaigns/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Failed to delete campaign");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting campaign");
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, []);

  // CSV Parsing
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvFileText(text);
      
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
      if (lines.length === 0) return;
      
      // Parse headers
      const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
      setCsvHeaders(headers);
      
      // Default guess mapping
      const phoneCol = headers.find(h => 
        h.toLowerCase().includes("phone") || 
        h.toLowerCase().includes("mobile") || 
        h.toLowerCase().includes("number") || 
        h.toLowerCase().includes("recipient")
      ) || headers[0];
      setRecipientColumn(phoneCol);

      const nameCol = headers.find(h => 
        h.toLowerCase().includes("name") || 
        h.toLowerCase().includes("customer") || 
        h.toLowerCase().includes("client")
      ) || headers[1] || headers[0];
      
      setVariableMappings({ "{{1}}": nameCol });
      
      // Parse rows
      const rows = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim().replace(/^["']|["']$/g, ""));
        const rowData: Record<string, string> = {};
        headers.forEach((h, i) => {
          rowData[h] = values[i] || "";
        });
        return rowData;
      });
      
      setCsvRows(rows);
    };
    reader.readAsText(file);
  };

  // Helper to compile template variables
  const formatTemplateMessage = (templateContent: string, row: any) => {
    let result = templateContent;
    // Substitute mappings
    Object.entries(variableMappings).forEach(([placeholder, colHeader]) => {
      const val = row[colHeader] || `[${colHeader || "value"}]`;
      result = result.replaceAll(placeholder, val);
    });
    return result;
  };

  // Handle send now trigger
  const handleSendNow = async () => {
    if (csvRows.length === 0) {
      alert("No contacts to send. Please upload a CSV first.");
      return;
    }
    
    setIsSending(true);
    setSendProgress(0);
    setSendStats({ success: 0, failed: 0, total: csvRows.length });
    setSendLogs([]);
    
    let successCount = 0;
    let failedCount = 0;
    const logs = [];

    // Loop send in batch
    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i];
      const name = row[variableMappings["{{1}}"]] || "Customer";
      let phone = row[recipientColumn] || "";
      phone = phone.replace(/[^0-9]/g, ""); // strip non-numeric
      
      // Auto format country code if needed (default India +91)
      if (phone.length === 10) {
        phone = "91" + phone;
      }
      if (!phone.startsWith("+") && phone.length > 0) {
        phone = "+" + phone;
      }

      const compiledMessage = formatTemplateMessage(selectedTemplate.content, row);
      
      // Extract exactly the ordered variables for Meta Template passing
      const paramKeys = Object.keys(variableMappings).sort((a, b) => {
        return (parseInt(a.replace(/\D/g, '')) || 0) - (parseInt(b.replace(/\D/g, '')) || 0);
      });
      const templateParams = paramKeys.map(key => String(row[variableMappings[key]] || ""));
      
      try {
        const res = await fetch(`${API_URL}/contacts/direct-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            message: compiledMessage,
            mediaType: mediaType !== "text" ? mediaType : undefined,
            mediaUrl: mediaType !== "text" ? mediaUrl : undefined,
            templateParams: mediaType === "template" ? templateParams : undefined
          })
        });
        
        if (res.ok) {
          successCount++;
          logs.unshift({
            phone,
            name,
            status: "SUCCESS",
            message: `Delivered template successfully`
          });
        } else {
          failedCount++;
          logs.unshift({
            phone,
            name,
            status: "FAILED",
            message: `Server returned error`
          });
        }
      } catch (err: any) {
        failedCount++;
        logs.unshift({
          phone,
          name,
          status: "FAILED",
          message: err.message || `Connection failed`
        });
      }
      
      // Update progress
      setSendProgress(Math.round(((i + 1) / csvRows.length) * 100));
      setSendStats({ success: successCount, failed: failedCount, total: csvRows.length });
      setSendLogs([...logs]);
      
      // 300ms throttle to prevent rate-limiting Meta Gateway blockages
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Save Campaign to Database on finish
    try {
      await fetch(`${API_URL}/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: broadcastName || `${selectedTemplate.name} Broadcast`,
          templateId: selectedTemplate.id,
          status: "COMPLETED"
        })
      });
      fetchCampaigns();
    } catch (e) {
      console.error("Failed to save campaign summary", e);
    }
    
    setIsSending(false);

    // Auto-return to dashboard home page after 2.5 seconds only if 100% successful
    if (failedCount === 0 && successCount > 0) {
      setTimeout(() => {
        setShowWizard(false);
        router.push("/");
      }, 2500);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Mobile\nRahul Sharma,919876543210\nAmit Patil,919812345678\nSachin Shinde,919175635165\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "avani_broadcast_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMappingDisplayValue = (placeholder: string) => {
    return variableMappings[placeholder] || "";
  };

  return (
    <div className="flex flex-col gap-6 h-full p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Broadcast Campaigns</h2>
          <p className="text-sm text-zinc-400">Deploy templates to saved and unsaved numbers via Meta WhatsApp Business API.</p>
        </div>
        <button
          onClick={() => {
            setBroadcastName("");
            setCsvRows([]);
            setCsvHeaders([]);
            setCsvFileName("");
            setCurrentStep(1);
            setShowWizard(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Broadcast
        </button>
      </div>

      {/* Campaigns Listing */}
      {loading ? (
        <div className="text-zinc-500 text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-zinc-600" />
          Loading broadcast campaign history...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-500">
          <Megaphone className="w-12 h-12 text-zinc-700 mb-3" />
          <h3 className="text-zinc-300 font-medium mb-1">No Broadcasts Dispatched</h3>
          <p className="text-sm text-center max-w-xs mb-4">Launch templates to unsaved lead sheets easily by clicking Create Broadcast.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-400">
              <thead className="text-xs text-zinc-300 uppercase bg-zinc-800/40 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Broadcast Name</th>
                  <th className="px-6 py-4 font-semibold">Template ID</th>
                  <th className="px-6 py-4 font-semibold">Dispatch Status</th>
                  <th className="px-6 py-4 font-semibold">Date Dispatched</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-zinc-100">{item.name || "-"}</td>
                    <td className="px-6 py-4 font-mono text-zinc-300 text-xs">{item.templateId || "Custom"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "COMPLETED" ? "bg-emerald-950 text-emerald-400" : "bg-yellow-950 text-yellow-400"
                      }`}>
                        {item.status === "COMPLETED" ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> COMPLETED
                          </>
                        ) : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteCampaign(item.id)}
                        className="p-1.5 hover:bg-red-950/40 border border-transparent hover:border-red-900/30 rounded text-zinc-500 hover:text-red-400 transition-all animate-fade-in"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Meta WhatsApp Broadcast Wizard */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-850 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
            
            {/* Left Sidebar Wizard Steps Form */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-900">
              <div>
                {/* Steps Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Megaphone className="text-emerald-500 w-5 h-5" /> 
                    Create Template Broadcast
                  </h3>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    Step {currentStep} of 4
                  </span>
                </div>

                {/* Step Content */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 mb-1">1. Name your Broadcast</h4>
                      <p className="text-xs text-zinc-400 mb-2">Internal reference name for tracking performance.</p>
                      <input 
                        type="text"
                        placeholder="e.g. Personal Loan Inquiry - June Batch"
                        value={broadcastName}
                        onChange={(e) => setBroadcastName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 mb-1">2. Select Meta Approved Template</h4>
                      <p className="text-xs text-zinc-400 mb-3">Outbound business-initiated templates approved by Meta Business Manager.</p>
                      
                      <div className="grid grid-cols-1 gap-2.5 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                        {dbTemplates.map((tpl) => (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => {
                              setSelectedTemplate(tpl);
                              // Reset mapping key names to standard defaults
                              const newMappings: Record<string, string> = {};
                              for (let i = 1; i <= tpl.variablesCount; i++) {
                                newMappings[`{{${i}}}`] = csvHeaders.length > 0 ? csvHeaders[0] : "";
                              }
                              setVariableMappings(newMappings);
                            }}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedTemplate.id === tpl.id 
                                ? "border-emerald-500 bg-emerald-500/5 text-white font-bold" 
                                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-zinc-300">{tpl.name}</span>
                              <span className="text-[10px] bg-emerald-950 text-emerald-400 font-semibold px-2 py-0.5 rounded">UTILITY</span>
                            </div>
                            {tpl.volume && (
                              <div className="flex gap-2 mb-1">
                                <span className="text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded">{tpl.volume}</span>
                                {tpl.product && <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded">{tpl.product}</span>}
                              </div>
                            )}
                            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 font-mono whitespace-pre-wrap">{tpl.content}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 mb-1">3. Broadcast Message Type (Media / Official Template)</h4>
                      <p className="text-xs text-zinc-400 mb-3">Attach an image, video, document, or send an Official Meta Template.</p>
                      
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {(["text", "image", "video", "document", "template"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setMediaType(type);
                              if (type === "text") setMediaUrl("");
                            }}
                            className={`py-2 px-1 rounded-lg border text-center transition-all text-xs font-semibold uppercase tracking-wide ${
                              mediaType === type 
                                ? "border-emerald-500 bg-emerald-500/10 text-white font-bold" 
                                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800"
                            }`}
                          >
                            {type === "text" ? "Text Only" : type === "template" ? "Meta Template" : type}
                          </button>
                        ))}
                      </div>

                      {mediaType !== "text" && (
                        <div className="flex flex-col gap-2.5 bg-zinc-950 p-3 border border-zinc-800 rounded-lg">
                          {mediaType !== "template" && (
                            <div className="flex gap-2">
                              <input 
                                type="file"
                                accept={mediaType === 'image' ? 'image/*' : mediaType === 'video' ? 'video/*' : 'application/pdf'}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  
                                  setUploadingMedia(true);
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  try {
                                    const res = await fetch(`${API_URL}/gallery/upload`, {
                                      method: 'POST',
                                      body: formData
                                    });
                                    if (res.ok) {
                                      const result = await res.json();
                                      if (result.url) {
                                        setMediaUrl(result.url);
                                        alert(`File uploaded successfully to gallery!`);
                                      } else {
                                        alert('Upload failed: No URL returned');
                                      }
                                    } else {
                                      alert('Upload failed: server returned error');
                                    }
                                  } catch (err: any) {
                                    console.error(err);
                                    alert('Upload failed: ' + err.message);
                                  } finally {
                                    setUploadingMedia(false);
                                  }
                                }}
                                className="hidden"
                                id="broadcast-media-file-upload"
                              />
                              <label 
                                htmlFor="broadcast-media-file-upload"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-zinc-800 hover:border-zinc-650 bg-zinc-900 text-zinc-300 hover:text-white rounded-lg cursor-pointer text-xs font-semibold transition-all flex-1"
                              >
                                {uploadingMedia ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 text-zinc-400 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 text-zinc-400" />
                                    Upload {mediaType} File
                                  </>
                                )}
                              </label>
                            </div>
                          )}
                          
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                              {mediaType === 'template' ? 'Enter Exact Meta Template Name' : 'Or Paste Media URL'}
                            </span>
                            <input 
                              type="text"
                              placeholder={mediaType === 'template' ? 'e.g. personal_loan_inquiry' : `https://example.com/file.${mediaType === 'image' ? 'jpg' : mediaType === 'video' ? 'mp4' : 'pdf'}`}
                              value={mediaUrl}
                              onChange={(e) => setMediaUrl(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 mb-1">Upload Recipient Sheet (.CSV)</h4>
                      <p className="text-xs text-zinc-400 mb-4">
                        Upload your excel sheet saved in CSV format containing customer contact details.
                      </p>
                      
                      <div className="border border-dashed border-zinc-800 rounded-xl p-8 bg-zinc-950 text-center flex flex-col items-center justify-center hover:border-zinc-700 transition-all cursor-pointer relative group">
                        <input 
                          type="file" 
                          accept=".csv"
                          onChange={handleCsvUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-10 h-10 text-zinc-600 mb-3 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-sm font-semibold text-zinc-300 block mb-1">
                          {csvFileName ? csvFileName : "Click to select CSV File"}
                        </span>
                        <span className="text-xs text-zinc-500 block">
                          {csvRows.length > 0 ? `Detected ${csvRows.length} contacts` : "Supported headers: Name, Mobile (with country code)"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <button
                          type="button"
                          onClick={handleDownloadSample}
                          className="text-xs font-bold text-emerald-500 hover:underline"
                        >
                          ⬇️ Download Sample CSV template
                        </button>
                      </div>
                    </div>

                    {csvRows.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">File Sheet Data Preview (First 3 Rows)</h5>
                        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
                          <table className="w-full text-xs text-left text-zinc-400">
                            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                              <tr>
                                {csvHeaders.map(h => (
                                  <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {csvRows.slice(0, 3).map((r, i) => (
                                <tr key={i} className="border-b border-zinc-800/50">
                                  {csvHeaders.map(h => (
                                    <td key={h} className="px-3 py-2 text-zinc-400">{r[h]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 font-semibold">Map Dynamic Template Fields</h4>
                      <p className="text-xs text-zinc-400 mb-4">
                        Map your template variables to the columns inside your uploaded Excel/CSV sheet.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 bg-zinc-950 p-4 border border-zinc-800 rounded-xl">
                      {/* Phone mapping */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-455 mb-1.5 uppercase tracking-wider">Recipient Number (Phone / Mobile)</label>
                        <select 
                          value={recipientColumn}
                          onChange={(e) => setRecipientColumn(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                        >
                          <option value="">-- Choose Column --</option>
                          {csvHeaders.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dynamic mapping loop */}
                      {Array.from({ length: selectedTemplate.variablesCount }).map((_, idx) => {
                        const variableName = `{{${idx + 1}}}`;
                        const desc = selectedTemplate.variablesDesc[idx] || `Variable ${idx + 1}`;
                        return (
                          <div key={variableName}>
                            <label className="block text-xs font-bold text-zinc-455 mb-1.5 uppercase tracking-wider">
                              Placeholder {variableName} ({desc})
                            </label>
                            <select 
                              value={getMappingDisplayValue(variableName)}
                              onChange={(e) => {
                                setVariableMappings(prev => ({
                                  ...prev,
                                  [variableName]: e.target.value
                                }));
                              }}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                            >
                              <option value="">-- Choose Column --</option>
                              {csvHeaders.map(h => (
                                <option key={h} value={h}>{h}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="flex flex-col gap-5 h-full">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 mb-1">Verify and Dispatch</h4>
                      <p className="text-xs text-zinc-400 mb-4">
                        Review the details on the phone mockup. Dispatched template logs will be visible in webhooks list.
                      </p>
                    </div>

                    {!isSending ? (
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl text-zinc-400 text-xs flex flex-col gap-2.5">
                        <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                          <span className="font-semibold">Campaign Name:</span>
                          <span className="text-zinc-200 font-bold">{broadcastName || `${selectedTemplate.name} Broadcast`}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                          <span className="font-semibold">Selected Template:</span>
                          <span className="text-zinc-200">{selectedTemplate.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                          <span className="font-semibold">Total Recipients:</span>
                          <span className="text-zinc-200 font-bold">{csvRows.length} contacts</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="font-semibold">Meta Verification Status:</span>
                          <span className="text-emerald-400 font-bold">Meta Approved Templates (Instant dispatch)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 bg-zinc-950 p-6 border border-emerald-500/20 rounded-xl">
                        <div className="flex justify-between items-center text-xs font-semibold text-zinc-400">
                          <span>{sendProgress === 100 ? "✨ Campaign Completed! Redirecting to Dashboard..." : "Dispatching Messages..."}</span>
                          <span className="text-emerald-400">{sendProgress}% Complete</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${sendProgress}%` }}></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mt-2">
                          <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/40">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Recipients</span>
                            <span className="text-sm font-bold text-zinc-200">{sendStats.total}</span>
                          </div>
                          <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/40">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Successful</span>
                            <span className="text-sm font-bold text-emerald-400">{sendStats.success}</span>
                          </div>
                          <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/40">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Failed</span>
                            <span className="text-sm font-bold text-red-400">{sendStats.failed}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800/80 mt-6">
                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => {
                    if (currentStep > 1) {
                      setCurrentStep(prev => prev - 1);
                    } else {
                      setShowWizard(false);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {currentStep === 1 ? "Cancel" : "Back"}
                </button>

                <div className="flex gap-2">
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentStep === 1 && !broadcastName) {
                          alert("Please enter a campaign name first.");
                          return;
                        }
                        if (currentStep === 2 && csvRows.length === 0) {
                          alert("Please upload a CSV file with contacts first.");
                          return;
                        }
                        if (currentStep === 3) {
                          if (!recipientColumn) {
                            alert("Please map the Recipient Number (Phone / Mobile) column.");
                            return;
                          }
                          const mappingsFilled = Object.entries(variableMappings).every(([_, v]) => !!v);
                          if (!mappingsFilled) {
                            alert("Please map all placeholder variables to CSV columns.");
                            return;
                          }
                        }
                        setCurrentStep(prev => prev + 1);
                      }}
                      className="flex items-center gap-1.5 px-5 py-2 bg-zinc-850 hover:bg-zinc-800 text-white rounded-lg text-sm font-bold border border-zinc-800 transition-colors"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSending}
                      onClick={handleSendNow}
                      className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-600/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Send Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar WhatsApp Sandbox Preview Layout */}
            <div className="w-full md:w-[380px] bg-zinc-950 flex flex-col justify-between border-l border-zinc-850 p-6 overflow-y-auto">
              
              {/* WhatsApp Live Simulator Screen */}
              <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-inner">
                {/* Header */}
                <div className="bg-[#075e54] p-3 text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-800/80 flex items-center justify-center font-bold text-xs">AL</div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold tracking-wide truncate">AVANI LOAN SERVICES</span>
                    <span className="text-[9px] text-zinc-300 font-semibold uppercase">Meta Business Gateway</span>
                  </div>
                </div>

                {/* Body message bubbles */}
                <div className="flex-1 p-3 flex flex-col justify-end bg-[#ece5dd]/5 relative overflow-y-auto min-h-[40vh] max-h-[50vh]">
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <Megaphone className="w-40 h-40 text-white" />
                  </div>
                  
                  {/* WhatsApp Message Bubble */}
                  <div className="bg-[#056162] text-white p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] self-end relative mb-2 text-xs font-mono leading-relaxed">
                    {mediaType !== 'text' && mediaUrl && (
                      <div className="mb-2 rounded overflow-hidden bg-black/20 p-1 border border-white/10">
                        {mediaType === 'image' && (
                          <img src={mediaUrl} alt="Preview" className="max-w-full h-auto rounded object-cover max-h-40 mx-auto" />
                        )}
                        {mediaType === 'video' && (
                          <video src={mediaUrl} controls className="max-w-full h-auto rounded max-h-40 mx-auto" />
                        )}
                        {mediaType === 'document' && (
                          <div className="flex items-center gap-2 p-2 bg-zinc-950/40 rounded text-[10px]">
                            <FileText className="w-5 h-5 text-zinc-300" />
                            <span className="truncate text-zinc-200">
                              {mediaUrl.substring(mediaUrl.lastIndexOf('/') + 1) || 'document.pdf'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {csvRows.length > 0 ? (
                        formatTemplateMessage(selectedTemplate.content, csvRows[0])
                      ) : (
                        selectedTemplate.content
                      )}
                    </div>
                    
                    {/* Tick mark */}
                    <div className="text-[9px] text-emerald-300/80 text-right mt-1.5 flex justify-end items-center gap-1 font-sans">
                      <span>11:00 AM</span>
                      <span className="text-emerald-300">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Logs Console (only shown in sending stage) */}
              {currentStep === 4 && sendLogs.length > 0 && (
                <div className="mt-4 border border-zinc-800 bg-zinc-900 p-3 rounded-xl flex flex-col h-[20vh] overflow-y-auto custom-scrollbar">
                  <h6 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Live Dispatch Terminal</h6>
                  <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                    {sendLogs.map((log, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-1 pb-1 border-b border-zinc-800/40">
                        <span className="text-zinc-400 truncate">{log.name} ({log.phone})</span>
                        <span className={`font-semibold shrink-0 uppercase ${log.status === "SUCCESS" ? "text-emerald-400" : "text-red-400"}`}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
