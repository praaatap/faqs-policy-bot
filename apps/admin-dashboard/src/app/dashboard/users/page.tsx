"use client";

import { useEffect, useState } from "react";
import { Users, Search, UserPlus, Filter } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const filtered = users.filter((u: any) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
                    <p className="text-slate-400">Total of {users.length} admin users</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
                    <UserPlus size={18} /> Add User
                </button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 shadow-inner border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm"
                    />
                </div>
                <button className="bg-slate-900 border border-slate-800 text-slate-400 px-4 rounded-2xl hover:text-white transition-colors">
                    <Filter size={20} />
                </button>
            </div>

            <div className="glass-dark rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50 border-b border-slate-800">
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Website</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined On</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-8 py-6"><div className="h-4 w-32 bg-slate-800 rounded" /></td>
                                    <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
                                    <td className="px-8 py-6"><div className="h-4 w-20 bg-slate-800 rounded" /></td>
                                    <td className="px-8 py-6"><div className="h-4 w-12 bg-slate-800 rounded float-right" /></td>
                                </tr>
                            ))
                        ) : filtered.length > 0 ? filtered.map((user: any) => (
                            <tr key={user.id} className="hover:bg-indigo-500/[0.03] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-indigo-400 border border-slate-700">
                                            {(user.name || user.email).charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{user.name || "N/A"}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm text-slate-400">{user.website || "—"}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Edit</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-slate-500 italic">No users found matching your search</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
