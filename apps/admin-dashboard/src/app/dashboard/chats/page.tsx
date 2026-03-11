"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Calendar, ChevronRight } from "lucide-react";

export default function ChatLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const res = await fetch("/api/chat-logs");
                const data = await res.json();
                setLogs(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchLogs();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Interaction History</h1>
                <p className="text-slate-400">Monitor chatbot performance and user queries</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-900 rounded-3xl animate-pulse" />)
                ) : logs.length > 0 ? logs.map((log) => (
                    <div key={log.id} className="glass-dark overflow-hidden rounded-3xl group">
                        <div className="p-6 flex items-start gap-6">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                                <MessageSquare size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{log.companyId}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{log.subject}</span>
                                    <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar size={12} /> {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-1">Question</p>
                                        <p className="text-white font-medium text-lg leading-relaxed">{log.question}</p>
                                    </div>
                                    <div className="pl-4 border-l-2 border-slate-800">
                                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-1">Assistant Answer</p>
                                        <p className="text-slate-400 text-sm leading-relaxed">{log.answer}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-600 font-bold uppercase">Sources:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {JSON.parse(log.sources || "[]").map((s: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md border border-slate-700">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="text-xs text-indigo-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Details <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center text-slate-600 glass-dark rounded-3xl italic">
                        No chat history available.
                    </div>
                )}
            </div>
        </div>
    );
}
