"use client";

import dynamic from "next/dynamic";

const FloatingAIAssistant = dynamic(() => import("./FloatingAIAssistant"), {
    ssr: false,
    loading: () => null,
});

export default function FloatingAIAssistantWrapper() {
    return <FloatingAIAssistant />;
}
