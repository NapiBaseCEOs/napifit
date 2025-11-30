"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Rocket, Wrench, Bug, Check } from "lucide-react";
import { APP_VERSION, RELEASE_NOTES } from "@/config/version";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function WhatsNewModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"features" | "improvements" | "fixes">("features");
    const { t } = useLocale();

    const currentRelease = RELEASE_NOTES.find((note) => note.version === APP_VERSION);

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem("last_seen_version");
        if (lastSeenVersion !== APP_VERSION && currentRelease) {
            // Delay opening slightly for better UX
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [currentRelease]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("last_seen_version", APP_VERSION);
    };

    if (!isOpen || !currentRelease) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-[#0f1424] border border-white/10 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-900 px-6 py-8 text-white">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white/80 hover:bg-black/40 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/20 p-3 ring-4 ring-white/10">
                            <Sparkles className="h-8 w-8 text-yellow-300" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">NapiFit v{APP_VERSION}</h2>
                        <p className="mt-2 text-primary-100 font-medium">{currentRelease.title}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col h-[500px] sm:h-auto">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10 bg-white/5 px-2 pt-2">
                        <button
                            onClick={() => setActiveTab("features")}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-t-xl py-3 text-sm font-semibold transition-colors ${activeTab === "features"
                                    ? "bg-[#0f1424] text-primary-400 border-t border-x border-white/10 -mb-px"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                                }`}
                        >
                            <Rocket className="h-4 w-4" />
                            Yenilikler
                        </button>
                        <button
                            onClick={() => setActiveTab("improvements")}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-t-xl py-3 text-sm font-semibold transition-colors ${activeTab === "improvements"
                                    ? "bg-[#0f1424] text-blue-400 border-t border-x border-white/10 -mb-px"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                                }`}
                        >
                            <Wrench className="h-4 w-4" />
                            İyileştirmeler
                        </button>
                        <button
                            onClick={() => setActiveTab("fixes")}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-t-xl py-3 text-sm font-semibold transition-colors ${activeTab === "fixes"
                                    ? "bg-[#0f1424] text-emerald-400 border-t border-x border-white/10 -mb-px"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                                }`}
                        >
                            <Bug className="h-4 w-4" />
                            Düzeltmeler
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-[#0f1424]">
                        <div className="space-y-6">
                            {activeTab === "features" && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-4 mb-6">
                                        <h3 className="text-lg font-semibold text-primary-200 mb-3 flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary-400" />
                                            Öne Çıkanlar
                                        </h3>
                                        <ul className="space-y-2">
                                            {currentRelease.highlights.map((highlight, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tüm Yeni Özellikler</h4>
                                    <ul className="space-y-3">
                                        {currentRelease.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3 group">
                                                <div className="mt-0.5 rounded-full bg-primary-500/20 p-1 text-primary-400 group-hover:bg-primary-500/30 transition-colors">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === "improvements" && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Geliştirmeler</h4>
                                    <ul className="space-y-3">
                                        {currentRelease.improvements.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 group">
                                                <div className="mt-0.5 rounded-full bg-blue-500/20 p-1 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                                                    <Wrench className="h-3 w-3" />
                                                </div>
                                                <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === "fixes" && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Hata Düzeltmeleri</h4>
                                    <ul className="space-y-3">
                                        {currentRelease.fixes.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 group">
                                                <div className="mt-0.5 rounded-full bg-emerald-500/20 p-1 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                                                    <Bug className="h-3 w-3" />
                                                </div>
                                                <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/10 bg-white/5 p-4 sm:px-6">
                        <button
                            onClick={handleClose}
                            className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-500 hover:shadow-primary-500/40 transition-all active:scale-[0.98]"
                        >
                            Harika, Keşfetmeye Başla! 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
