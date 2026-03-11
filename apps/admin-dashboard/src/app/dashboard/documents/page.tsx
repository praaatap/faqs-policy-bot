"use client";

import { useEffect, useState, FormEvent } from "react";
import { FileText, Upload, Plus, Trash2, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [companyId, setCompanyId] = useState("");
    const [subject, setSubject] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/documents");
            const data = await res.json();
            if (Array.isArray(data)) setDocuments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!file || !companyId || !subject) {
            setErrorMsg("Please fill all required fields and select a file.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("companyId", companyId);
            formData.append("subject", subject);

            const res = await fetch("/api/documents", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload failed");
            }

            setIsUploadOpen(false);
            setFile(null);
            setCompanyId("");
            setSubject("");
            fetchDocs(); // Refresh
        } catch (err: any) {
            setErrorMsg(err.message || "An error occurred");
        } finally {
            setUploading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "indexed": return <CheckCircle2 size={16} className="text-emerald-400" />;
            case "uploaded": return <CheckCircle2 size={16} className="text-emerald-400" />;
            case "failed": return <AlertCircle size={16} className="text-red-400" />;
            default: return <Clock size={16} className="text-blue-400 animate-pulse" />;
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
                    <p className="text-slate-400">Total of {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Plus size={18} /> New Document
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-44 bg-slate-900 rounded-3xl animate-pulse" />)
                ) : documents.length > 0 ? documents.map((doc) => (
                    <div key={doc.id} className="glass-dark p-6 rounded-3xl relative group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                <FileText size={24} />
                            </div>
                            <button className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <h3 className="text-white font-bold mb-1 truncate pr-4">{doc.filename}</h3>
                        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider mb-4 font-mono">
                            <span className="text-slate-600">{doc.companyId}</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-indigo-400">{doc.subject}</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                            <div className="flex items-center gap-2 text-xs font-semibold capitalize text-slate-400">
                                {getStatusIcon(doc.status)}
                                {doc.status}
                            </div>
                            <span className="text-[10px] text-slate-600">{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 italic">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <FileText size={32} />
                        </div>
                        No documents found. Start by uploading some policies.
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md relative">
                        <button
                            onClick={() => setIsUploadOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">Upload Document</h2>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Company ID</label>
                                <input
                                    type="text"
                                    value={companyId}
                                    onChange={e => setCompanyId(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. comp-123"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. hr-policy"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Document File (PDF/TXT)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.txt"
                                    onChange={e => setFile(e.target.files?.[0] || null)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 flex items-center text-slate-300
                                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                                />
                            </div>

                            {errorMsg && <div className="text-red-400 text-sm">{errorMsg}</div>}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl py-3 font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <Clock size={18} className="animate-spin" />
                                    ) : (
                                        <Upload size={18} />
                                    )}
                                    {uploading ? "Uploading..." : "Upload Document"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
