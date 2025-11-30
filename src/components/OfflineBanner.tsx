"use client";

import { useNetworkStatus } from "@/context/NetworkStatusContext";
import { useEffect, useState } from "react";

export default function OfflineBanner() {
    const { online } = useNetworkStatus();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!online) {
            setShow(true);
        } else {
            // Delay hiding to show "back online" message
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [online]);

    if (!show) return null;

    return (
        <div
            className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${online ? "translate-y-0" : "translate-y-0"
                }`}
        >
            <div
                className={`mx-auto max-w-2xl px-4 py-3 rounded-b-xl border-x border-b ${online
                    ? "border-green-500/30 bg-green-500/10 text-green-200"
                    : "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                    }`}
            >
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <span className="text-lg">{online ? "✓" : "⚠"}</span>
                    <span>
                        {online
                            ? "İnternet bağlantınız geri geldi!"
                            : "İnternet bağlantınız yok. Bazı özellikler çalışmayabilir."}
                    </span>
                </div>
            </div>
        </div>
    );
}
