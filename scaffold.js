const fs = require('fs');
const pages = [
  { path: 'templates', title: 'WhatsApp Templates', icon: 'FileText', desc: 'Manage your approved Meta templates.' },
  { path: 'forms', title: 'WhatsApp Forms', icon: 'ClipboardList', desc: 'Build interactive forms to collect data from customers directly in WhatsApp.' },
  { path: 'tags', title: 'Contact Tags', icon: 'Tag', desc: 'Organize your contacts into segments.' },
  { path: 'columns', title: 'Custom Columns', icon: 'Columns', desc: 'Add custom data fields to your contact profiles.' },
  { path: 'opts', title: 'Opts Management', icon: 'Settings2', desc: 'Manage WhatsApp opt-in and opt-out preferences.' },
  { path: 'webhooks', title: 'Webhook Events', icon: 'Globe', desc: 'Monitor real-time events and message delivery status from Meta.' },
  { path: 'gallery', title: 'Media Gallery', icon: 'Image', desc: 'Manage images, PDFs, and documents sent and received via WhatsApp.' },
  { path: 'faq', title: 'FAQ Bot', icon: 'HelpCircle', desc: 'Define frequently asked questions to automate customer support.' },
  { path: 'assistant', title: 'AI Assistant', icon: 'Bot', desc: 'Configure AI auto-pilot settings and system prompts.' },
  { path: 'flows', title: 'WhatsApp Flows', icon: 'GitMerge', desc: 'Build multi-step conversational flows.' },
  { path: 'projects', title: 'Projects', icon: 'Folder', desc: 'Group related tasks and loan applications into larger projects.' },
  { path: 'tasks', title: 'Tasks', icon: 'CheckCircle', desc: 'Manage follow-ups, document collection, and internal to-dos.' },
  { path: 'settings', title: 'Workspace Settings', icon: 'Settings', desc: 'Configure global settings for Avani Loan Services.' },
  { path: 'knowledge', title: 'Knowledge Base', icon: 'Book', desc: 'Store company policies, loan criteria, and training materials.' },
  { path: 'developers', title: 'Developers & APIs', icon: 'Code', desc: 'Manage API keys and Meta App configurations.' }
];

pages.forEach(p => {
  const code = `import { ${p.icon} } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">${p.title}</h1>
          <p className="text-sm text-zinc-400">${p.desc}</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90">
          Add New
        </button>
      </header>
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 border-2 border-dashed border-zinc-800 rounded-xl p-12">
          <${p.icon} className="w-12 h-12 text-zinc-700" />
          <h2 className="text-lg font-medium text-zinc-300">No ${p.title} found</h2>
          <p className="text-sm text-center max-w-sm">
            You haven't created any items here yet. Click "Add New" to get started.
          </p>
        </div>
      </div>
    </div>
  );
}`;
  fs.mkdirSync('src/app/' + p.path, { recursive: true });
  fs.writeFileSync('src/app/' + p.path + '/page.tsx', code, 'utf8');
});
