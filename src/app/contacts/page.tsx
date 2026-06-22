"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, MoreHorizontal, FileDown, MessageSquare } from "lucide-react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://workplace-kay-exchanges-psi.trycloudflare.com/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://workplace-kay-exchanges-psi.trycloudflare.com/contacts/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      alert(result.message || 'File uploaded successfully!');
      fetchContacts(); // Refresh list after upload
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
      // Reset input value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  const handleBulkMessage = async () => {
    const message = prompt("Enter the message you want to broadcast to all contacts:");
    if (!message) return;
    
    if (confirm(`Are you sure you want to send this message to ALL ${contacts.length} contacts?`)) {
      try {
        const response = await fetch('https://workplace-kay-exchanges-psi.trycloudflare.com/contacts/bulk-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        const result = await response.json();
        alert(result.message);
      } catch (error) {
        console.error("Bulk message failed", error);
        alert("Failed to send bulk messages.");
      }
    }
  };

  const handleAddContact = async () => {
    const name = prompt("Enter contact name:");
    if (name === null) return;
    const phone = prompt("Enter WhatsApp phone number (with country code, e.g. +91...):");
    if (!phone) return;

    try {
      const response = await fetch('https://workplace-kay-exchanges-psi.trycloudflare.com/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      if (response.ok) {
        alert("Contact added successfully!");
        fetchContacts();
      } else {
        alert("Failed to add contact.");
      }
    } catch (error) {
      console.error("Failed to add contact", error);
      alert("Error adding contact.");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Contacts</h2>
          <p className="text-sm text-zinc-500">Manage your leads and customers.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/sample-contacts.csv" download className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm text-sm font-medium">
            <FileDown className="w-4 h-4" />
            Template CSV
          </a>
          <button onClick={handleBulkMessage} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium">
            <MessageSquare className="w-4 h-4" />
            Send Bulk Message
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm disabled:opacity-50 text-sm font-medium">
            <FileDown className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Import CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
          <button onClick={handleAddContact} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Phone Number</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Last Contact</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No contacts found. Send a WhatsApp message to create one!</td>
                </tr>
              )}
              {contacts.map((contact) => (
                <tr key={contact.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {(contact.name || contact.phone).charAt(0).toUpperCase()}
                    </div>
                    {contact.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{contact.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">WhatsApp</td>
                  <td className="px-6 py-4 text-gray-500">
                    {contact.messages && contact.messages.length > 0 
                      ? new Date(contact.messages[0].timestamp).toLocaleString()
                      : new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500 bg-white">
          <span>Showing 1 to 4 of 4 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600 font-medium">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
