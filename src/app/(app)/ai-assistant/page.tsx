"use client";

import VoiceInput from "@/components/ai/VoiceInput";
import { useState } from "react";

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: 'Merhaba! Ben NapiFit AI asistanıyım. Size nasıl yardımcı olabilirim? Öğünlerinizi kaydedebilir, egzersiz tavsiyesi verebilir veya beslenme sorularınızı yanıtlayabilirim.' }
    ]);

    const handleTranscript = (text: string) => {
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Anlaşıldı, bunu işliyorum...' }]);
        }, 1000);
    };

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-6">AI Asistan</h1>

            <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                ? 'bg-primary-600 text-white rounded-tr-none'
                                : 'bg-gray-800 text-gray-200 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                <VoiceInput onTranscript={handleTranscript} />
                <input
                    type="text"
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleTranscript(e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                />
                <button className="p-2 bg-primary-600 rounded-lg text-white hover:bg-primary-700 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
