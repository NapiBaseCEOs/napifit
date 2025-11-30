"use client";

import { useState, useRef, useEffect } from "react";

export default function VoiceInput({ onTranscript }: { onTranscript: (text: string) => void }) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'tr-TR';

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognitionRef.current.onerror = (_event: any) => {
                setError('Ses tanıma hatası');
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [onTranscript]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            setError('Tarayıcınız ses tanımayı desteklemiyor');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setError(null);
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={toggleListening}
                className={`p-3 rounded-lg transition-all ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                title={isListening ? 'Dinleniyor...' : 'Sesle komut ver'}
            >
                {isListening ? '🔴' : '🎤'}
            </button>
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
}
