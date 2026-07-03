"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Megaphone, FileText, ClipboardList, Smartphone, Tag, Columns, Settings2, 
  Globe, Image as ImageIcon, HelpCircle, MessageSquare, Bot, GitMerge, Folder, CheckCircle,
  Activity, Phone, Mail, MapPin, ShieldCheck, Briefcase, Award, Search, ArrowRight, ExternalLink
} from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const services = [
    "Personal Loan", "Business Loan", "Doctor Loan", "Home Loan",
    "Mortgage Loan", "Education Loan (India)", "Education Loan (Global Studies)", "School & College Funding"
  ];

  const tools = [
    {
      name: "Contacts & Leads Manager",
      description: "Manage client details, custom fields, and real-time lead statuses.",
      icon: Users,
      href: "/contacts",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/50",
      category: "Data"
    },
    {
      name: "Broadcast Campaigns",
      description: "Send template-based bulk messages to saved & unsaved numbers.",
      icon: Megaphone,
      href: "/broadcasts",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/50",
      category: "Communication"
    },
    {
      name: "WhatsApp Templates",
      description: "Create, edit, and sync pre-approved message templates with Meta.",
      icon: FileText,
      href: "/templates",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      hoverBorder: "hover:border-violet-500/50",
      category: "Communication"
    },
    {
      name: "WhatsApp Forms",
      description: "Build in-chat interactive questionnaires for seamless lead capture.",
      icon: ClipboardList,
      href: "/forms",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      hoverBorder: "hover:border-amber-500/50",
      category: "Capture"
    },
    {
      name: "Conversational Components",
      description: "Configure interactive buttons, quick replies, and rich carousels.",
      icon: Smartphone,
      href: "/conversational-components",
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      hoverBorder: "hover:border-rose-500/50",
      category: "Capture"
    },
    {
      name: "Tags Management",
      description: "Organize contacts using custom color-coded, searchable labels.",
      icon: Tag,
      href: "/tags",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      hoverBorder: "hover:border-pink-500/50",
      category: "Data"
    },
    {
      name: "Columns Configurator",
      description: "Configure dynamic CRM fields (e.g. CIBIL score, loan amount).",
      icon: Columns,
      href: "/columns",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      hoverBorder: "hover:border-cyan-500/50",
      category: "Data"
    },
    {
      name: "Opt-Outs Manager",
      description: "Manage unsubscribed contacts and marketing opt-out logs.",
      icon: Settings2,
      href: "/opts",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      hoverBorder: "hover:border-red-500/50",
      category: "Communication"
    },
    {
      name: "Webhook Event Logs",
      description: "Monitor raw delivery, read receipts, and inbound webhook events.",
      icon: Globe,
      href: "/webhooks",
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
      hoverBorder: "hover:border-teal-500/50",
      category: "System"
    },
    {
      name: "Media Gallery",
      description: "Access and organize documents, images, and marketing files.",
      icon: ImageIcon,
      href: "/gallery",
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
      hoverBorder: "hover:border-sky-500/50",
      category: "Data"
    },
    {
      name: "FAQ Chatbot",
      description: "Set keyword triggers for automated customer support replies.",
      icon: HelpCircle,
      href: "/faq",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      hoverBorder: "hover:border-indigo-500/50",
      category: "Automation"
    },
    {
      name: "Live Chat Inbox",
      description: "Reply in real-time, view context, and manage direct communications.",
      icon: MessageSquare,
      href: "/inbox",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      hoverBorder: "hover:border-purple-500/50",
      category: "Communication"
    },
    {
      name: "AI Agent Assistant",
      description: "Define the AI persona and train it with internal guidelines.",
      icon: Bot,
      href: "/assistant",
      color: "text-fuchsia-400",
      bgColor: "bg-fuchsia-500/10",
      borderColor: "border-fuchsia-500/20",
      hoverBorder: "hover:border-fuchsia-500/50",
      category: "Automation"
    },
    {
      name: "Interactive Flows",
      description: "Design structured conversation pathways and chat trees.",
      icon: GitMerge,
      href: "/flows",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500/50",
      category: "Automation"
    },
    {
      name: "Project Boards",
      description: "Group leads, track pipeline stages, and manage corporate deals.",
      icon: Folder,
      href: "/projects",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      hoverBorder: "hover:border-yellow-500/50",
      category: "Data"
    },
    {
      name: "Task Lists",
      description: "Assign team tasks, set due dates, and track operational progress.",
      icon: CheckCircle,
      href: "/tasks",
      color: "text-lime-400",
      bgColor: "bg-lime-500/10",
      borderColor: "border-lime-500/20",
      hoverBorder: "hover:border-lime-500/50",
      category: "System"
    }
  ];

  const categories = ["All", "Communication", "Data", "Capture", "Automation", "System"];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 text-zinc-200 p-2 max-w-[1600px] mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 p-6 rounded-2xl border border-zinc-800 shadow-md">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">AVANI LOAN SERVICES</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Welcome back, <span className="text-indigo-400 font-semibold font-mono">Sachin Shinde</span>. Here is your loan advisory dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          Meta Lead Ads Verified
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <a href="/contacts" className="block transition-all hover:scale-[1.02] focus:outline-none">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-400">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">1,248</div>
              <p className="text-xs text-emerald-500 font-semibold mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </a>
        
        <a href="/inbox" className="block transition-all hover:scale-[1.02] focus:outline-none">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-400">New Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">34</div>
              <p className="text-xs text-indigo-400 font-semibold mt-1">
                Active in the last 24h
              </p>
            </CardContent>
          </Card>
        </a>
        
        <a href="/broadcasts" className="block transition-all hover:scale-[1.02] focus:outline-none">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-400">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">2</div>
              <p className="text-xs text-zinc-500 mt-1">
                Meta WhatsApp Ads Active
              </p>
            </CardContent>
          </Card>
        </a>
        
        <a href="/contacts" className="block transition-all hover:scale-[1.02] focus:outline-none">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-400">Conversion Rate</CardTitle>
              <Activity className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">8.4%</div>
              <p className="text-xs text-emerald-500 font-semibold mt-1">
                +1.2% from last week
              </p>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* CRM Tools Launcher Suite */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              CRM Automation Launcher Suite
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Launch and manage any of the 16 core integrated marketing and customer support tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search CRM tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                selectedCategory === category
                  ? "bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/10"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 16 Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <a
                  key={tool.name}
                  href={tool.href}
                  className={`group relative block p-5 bg-zinc-950 border border-zinc-850 rounded-xl transition-all duration-300 hover:bg-zinc-900/60 hover:-translate-y-0.5 ${tool.hoverBorder} shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg border ${tool.bgColor} ${tool.borderColor} ${tool.color} transition-colors group-hover:brightness-110`}>
                      <IconComponent className="h-5 h-5" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {tool.category}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                      {tool.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-400 shrink-0" />
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-950 rounded-xl border border-zinc-850">
            <HelpCircle className="w-8 h-8 text-zinc-650 mx-auto mb-2" />
            <p className="text-sm text-zinc-450">No CRM tools match your search criteria.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Profile Details Card */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-4">
              <Award className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Business Profile</h3>
                <p className="text-xs text-zinc-400">Verified Corporate Advisory Details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Business Name</span>
                <p className="text-sm text-zinc-200 font-bold mt-0.5">AVANI LOAN SERVICES</p>
              </div>
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Owner & Founder</span>
                <p className="text-sm text-zinc-200 font-bold mt-0.5">Sachin Shinde</p>
              </div>
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850 md:col-span-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Industry Sector</span>
                <p className="text-sm text-zinc-200 mt-0.5">Financial Services | Loan Consultancy & Loan Advisory Services</p>
              </div>
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850 md:col-span-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Corporate Address</span>
                <p className="text-sm text-zinc-200 mt-0.5 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  Rajiv Gandhi Chauk, Opposite Bank of Baroda, Above Monginis Cake Shop, Ausa Road, Latur – 413512, Maharashtra, India
                </p>
              </div>
            </div>
          </div>

          {/* Contact details row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-zinc-800 pt-4 mt-2">
            <a href="mailto:enquiry@avanifinserv.com" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-950/30 p-2.5 rounded-lg border border-zinc-850/60 justify-center">
              <Mail className="w-4 h-4 text-indigo-400" />
              enquiry@avanifinserv.com
            </a>
            <a href="https://www.avanifinserv.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-950/30 p-2.5 rounded-lg border border-zinc-850/60 justify-center">
              <Globe className="w-4 h-4 text-blue-400" />
              www.avanifinserv.com
            </a>
            <a href="https://wa.me/919175635165" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-950/30 p-2.5 rounded-lg border border-zinc-850/60 justify-center">
              <Phone className="w-4 h-4 text-emerald-400" />
              +91 91756 35165
            </a>
          </div>
        </div>

        {/* Active Loan Products Services List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Product Categories</span>
            <h3 className="text-lg font-bold text-white mt-1 leading-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              Advisory Services
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {services.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-950/50 rounded-lg border border-zinc-850/60 hover:border-zinc-800 transition-all">
                <span className="text-xs font-semibold text-zinc-300">{service}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
