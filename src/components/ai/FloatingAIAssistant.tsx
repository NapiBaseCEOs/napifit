"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, Loader2, Minimize2, Maximize2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isProactive?: boolean;
}

interface FloatingAIAssistantProps {}

export default function FloatingAIAssistant({}: FloatingAIAssistantProps) {
  const session = useSession();
  const userId = session?.user?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [proactiveMessage, setProactiveMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Service Worker'dan mesaj dinle
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "CHECK_AI_ASSISTANT_MESSAGE") {
        // Service Worker'dan gelen mesaj - proaktif mesaj kontrolü yap
        await checkProactiveMessages();
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [userId, isOpen, proactiveMessage]);

  // Proaktif mesajları kontrol et
  const checkProactiveMessages = async () => {
    if (!userId) return;

    try {
      const response = await fetch("/api/ai/proactive-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message && data.message !== proactiveMessage) {
          setProactiveMessage(data.message);
          
          // Yeni proaktif mesaj ekle
          const newMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
            isProactive: true,
          };
          
          setMessages((prev) => [...prev, newMessage]);
          
          // Eğer widget kapalıysa unread count artır
          if (!isOpen) {
            setUnreadCount((prev) => prev + 1);
            
            // Bildirim göster
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("🤖 NapiFit AI Asistanı", {
                body: data.message.substring(0, 100),
                icon: "/icon-192.png",
                badge: "/icon-192.png",
                tag: "ai-assistant",
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Proactive message check error:", error);
    }
  };

  // Proaktif mesaj kontrolünü başlat
  useEffect(() => {
    if (!userId) return;

    // İlk kontrol
    checkProactiveMessages();

    // Her 5 dakikada bir kontrol et
    checkIntervalRef.current = setInterval(checkProactiveMessages, 5 * 60 * 1000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [userId, isOpen, proactiveMessage]);

  // Widget açıldığında unread count'u sıfırla
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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

  // İlk açılışta hoş geldin mesajı
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Merhaba! 👋 Ben NapiFit AI Asistanınız. Size nasıl yardımcı olabilirim?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Button - Sadece widget kapalıyken göster */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setUnreadCount(0);
          }}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Sparkles className="h-7 w-7 text-white transition-transform group-hover:rotate-12" />
          
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></span>
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap border border-gray-700">
              AI Asistanı
              {unreadCount > 0 && (
                <span className="ml-2 text-red-400">({unreadCount} yeni mesaj)</span>
              )}
            </div>
          </div>
        </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 shadow-2xl transition-all duration-300 ${
            isMinimized
              ? "h-16 w-80"
              : "h-[600px] w-96 max-h-[80vh] max-w-[calc(100vw-3rem)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-500/30 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-transparent p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Asistanı</h3>
                <p className="text-xs text-gray-400">Her zaman yanınızdayım</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                          : message.isProactive
                          ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-gray-100"
                          : "bg-gray-800/60 text-gray-100 border border-gray-700/50"
                      }`}
                    >
                      {message.isProactive && (
                        <div className="mb-1 text-xs font-semibold text-blue-300">💡 Hatırlatma</div>
                      )}
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      <div className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
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

              {/* Input */}
              <div className="border-t border-gray-800/60 bg-gray-900/50 p-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mesajınızı yazın..."
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

