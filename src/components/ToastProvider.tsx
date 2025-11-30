"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, type, message, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const colors = {
        success: "border-green-500/30 bg-green-500/10 text-green-200",
        error: "border-red-500/30 bg-red-500/10 text-red-200",
        warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
        info: "border-blue-500/30 bg-blue-500/10 text-blue-200",
    };

    const icons = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
    };

    return (
        <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm animate-slide-in ${colors[toast.type]}`}
        >
            <span className="text-xl flex-shrink-0">{icons[toast.type]}</span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
                ✕
            </button>
        </div>
    );
}
