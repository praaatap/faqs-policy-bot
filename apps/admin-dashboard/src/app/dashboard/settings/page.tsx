"use client";

import { useState } from "react";
import { Settings, Save, Globe, Server, Shield, Database, Key, FileText } from "lucide-react";

export default function SettingsPage() {
    const [groqKey, setGroqKey] = useState("••••••••••••••••••••••••");
    const [backendUrl, setBackendUrl] = useState("http://localhost:8000");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <div className="space-y-10 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
                <p className="text-slate-400">Configure your chatbot brain and API connections</p>
            </div>

            <div className="space-y-8">
                {/* API Settings */}
                <div className="glass-dark p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 uppercase">
                            <Key size={18} />
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">API Configuration</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Groq API Key</label>
                            <div className="relative">
                                < Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="password"
                                    value={groqKey}
                                    onChange={(e) => setGroqKey(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm font-mono"
                                    placeholder="gsk_..."
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 ml-1 italic font-mono">Used for Llama 3.3-70b-versatile inference</p>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Backend Server URL</label>
                            <div className="relative">
                                <Server className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={backendUrl}
                                    onChange={(e) => setBackendUrl(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm font-mono"
                                    placeholder="http://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="glass-dark p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                            <Globe size={18} />
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">General Information</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Vector DB Path</label>
                                <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-slate-300">
                                    <Database size={18} className="text-slate-500" />
                                    <code className="text-xs font-mono uppercase tracking-tight">./chroma_db</code>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Documents Root</label>
                                <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-slate-300">
                                    <FileText size={18} className="text-slate-500" />
                                    <code className="text-xs font-mono uppercase tracking-tight">./docs</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : <><Save size={18} /> Save All Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
