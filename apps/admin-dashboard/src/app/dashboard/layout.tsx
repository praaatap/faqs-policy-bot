"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    Bot,
    Menu,
    X
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/dashboard/users", icon: Users },
        { name: "Documents", href: "/dashboard/documents", icon: FileText },
        { name: "Chat Logs", href: "/dashboard/chats", icon: MessageSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 h-screen bg-slate-900/50 border-r border-slate-800 sticky top-0">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Bot className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">PolicyBot</span>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 pt-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-2">
                    <Bot className="text-indigo-500 w-6 h-6" />
                    <span className="font-bold text-white uppercase tracking-wider text-sm">PolicyBot</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <Bot className="text-indigo-500 w-8 h-8" />
                        <span className="text-xl font-bold text-white uppercase tracking-wider">PolicyBot</span>
                    </div>
                    <nav className="space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 p-2 rounded-lg ${pathname === item.href ? 'text-indigo-500' : 'text-slate-400'}`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-2 text-slate-400 w-full text-left"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 pt-20 lg:pt-0">
                <div className="max-w-7xl mx-auto p-6 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
