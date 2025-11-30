"use client";

import { Lightbulb, X } from "lucide-react";
import { useState } from "react";

type Suggestion = {
    id: string;
    type: string;
    message: string;
    actionLink?: string;
};

export default function SuggestionCard({ suggestion, onDismiss }: { suggestion: Suggestion; onDismiss: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss();
    };

    return (
        <div className="relative bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                </div>
            </div>
            <div className="flex-1">
                <p className="text-sm text-white/90 leading-relaxed">{suggestion.message}</p>
                {suggestion.actionLink && (
                    <a
                        href={suggestion.actionLink}
                        className="inline-block mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Hemen yap →
                    </a>
                )}
            </div>
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-white/30 hover:text-white/70 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
