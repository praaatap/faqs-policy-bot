"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, Bot, User as UserIcon } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md glass-dark p-8 rounded-3xl relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20">
                        <Bot className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 mt-2">Start managing your AI assistant</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                placeholder="Admin Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                placeholder="admin@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            "Create Admin Account"
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-8">
                    Already have an account?{" "}
                    <button onClick={() => router.push("/login")} className="text-indigo-400 hover:text-indigo-300 font-medium">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
}
