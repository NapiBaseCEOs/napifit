"use client";

import { useState, useRef, useEffect } from "react";

export default function VoiceInput({ onTranscript }: { onTranscript: (text: string) => void }) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'tr-TR';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
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
    );
}
