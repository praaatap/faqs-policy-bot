"use client";

import { useEffect, useState } from "react";
import { Users, FileText, MessageSquare, ArrowUpRight, Clock } from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/dashboard/stats");
                const data = await res.json();
                setStats(data.stats);
                setRecentLogs(data.recentLogs);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-900 rounded-3xl" />)}
        </div>
        <div className="h-96 bg-slate-900 rounded-3xl" />
    </div>;

    const statCards = [
        { name: "Total Users", value: stats?.users || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
        { name: "Documents", value: stats?.documents || 0, icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10" },
        { name: "Chat Exchanges", value: stats?.chats || 0, icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    ];

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Overview</h1>
                <p className="text-slate-400">Snapshot of your policy assistant performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="glass-dark p-8 rounded-3xl flex items-center gap-6 group hover:border-slate-600 transition-all">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-medium mb-1">{stat.name}</p>
                            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-dark p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white">Recent Interactions</h2>
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 group">
                            View all <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentLogs.length > 0 ? recentLogs.map((log: any) => (
                            <div key={log.id} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                <div className="flex items-start justify-between mb-2">
                                    <p className="font-semibold text-white line-clamp-1">{log.question}</p>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold bg-slate-800 px-2 py-1 rounded-md">{log.subject}</span>
                                </div>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-2">{log.answer}</p>
                                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(log.createdAt).toLocaleDateString()}</span>
                                    <span className="font-medium text-slate-600">•</span>
                                    <span>{log.companyId}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-slate-500">No interactions yet</div>
                        )}
                    </div>
                </div>

                <div className="glass-dark p-8 rounded-3xl">
                    <h2 className="text-xl font-bold text-white mb-6">System Status</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Database</span>
                            <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Operational
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Groq API</span>
                            <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Connected
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Vector Store</span>
                            <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                            </span>
                        </div>

                        <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <span className="text-indigo-400 font-bold block mb-1">PRO TIP</span>
                                Upload PDF documents in the Documents tab to train your assistant on new policies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
