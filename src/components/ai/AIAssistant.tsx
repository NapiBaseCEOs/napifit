"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Loader2, Lightbulb, Target, TrendingUp, Heart } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export default function AIAssistant({ isOpen, onClose, userId }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Merhaba! 👋 Ben NapiFit AI Asistanınız. Size nasıl yardımcı olabilirim?\n\n• Sağlık ve fitness önerileri\n• Egzersiz planları\n• Beslenme tavsiyeleri\n• Hedef takibi ve motivasyon\n• Sorularınızı yanıtlama",
      timestamp: new Date(),
      suggestions: [
        "Bugünkü öğünlerimi değerlendir",
        "Haftalık egzersiz planı öner",
        "Kilo verme hedefim için tavsiye ver",
        "Sağlıklı beslenme önerileri",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          conversationHistory: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Yanıt alınamadı");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-primary-500/30 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800/60 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/50">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">NapiFit AI Asistanı</h2>
              <p className="text-xs text-gray-400">Kişiselleştirilmiş sağlık ve fitness rehberiniz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                    : "bg-gray-800/60 text-gray-100 border border-gray-700/50"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-gray-700/50">
                    <p className="text-xs font-semibold text-gray-400 mb-2">💡 Öneriler:</p>
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion)}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-700/40 hover:bg-gray-700/60 text-gray-300 hover:text-white transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-800/60 border border-gray-700/50 px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Düşünüyorum...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-800/60 bg-gray-900/50 p-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">Hızlı aksiyonlar:</span>
            <button
              onClick={() => sendMessage("Bugünkü öğünlerimi değerlendir")}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-500/30 bg-primary-500/10 px-3 py-1.5 text-xs font-medium text-primary-300 hover:bg-primary-500/20 transition-colors"
            >
              <Heart className="h-3 w-3" />
              Öğün Değerlendir
            </button>
            <button
              onClick={() => sendMessage("Haftalık egzersiz planı öner")}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <TrendingUp className="h-3 w-3" />
              Egzersiz Planı
            </button>
            <button
              onClick={() => sendMessage("Hedeflerim için tavsiye ver")}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              <Target className="h-3 w-3" />
              Hedef Tavsiyesi
            </button>
            <button
              onClick={() => sendMessage("Sağlıklı beslenme önerileri")}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-300 hover:bg-yellow-500/20 transition-colors"
            >
              <Lightbulb className="h-3 w-3" />
              Beslenme İpuçları
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-800/60 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

