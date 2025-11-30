"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
            <div className="w-full max-w-2xl mx-4">
                <div className="rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ara... (Cmd+K)"
                            className="w-full px-6 py-4 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
                            autoFocus
                        />
                    </form>

                    <div className="border-t border-gray-800 p-4">
                        <div className="text-sm text-gray-500 flex items-center justify-between">
                            <span>Öğün, egzersiz veya kullanıcı ara</span>
                            <span className="text-xs">ESC ile kapat</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
