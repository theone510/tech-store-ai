"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function Chatbot() {
    const { user, setIsLoginModalOpen } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "هلو عيني! شلون اكدر اساعدك اليوم؟ 🇮🇶" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const buyKeywords = ["اشتري", "طلب", "شراء", "اطلب", "اريد شراء", "buy", "order"];
        const isTryingToBuy = buyKeywords.some(word => input.toLowerCase().includes(word));

        if (isTryingToBuy && !user) {
            setMessages(prev => [...prev,
            { role: "user", content: input },
            { role: "assistant", content: "عذراً عيني، علمود اقدر اسجل طلبك يرجى تسجيل الدخول أولاً من الزر الموجود أعلى الصفحة لغرض اخذ العنوان والتفاصيل. 🔐" }
            ]);
            setInput("");
            setIsLoginModalOpen(true);
            return;
        }

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    user: user
                }),
            });

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setMessages((prev) => [...prev, data]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "اسف، صار عندي خلل بسيط بالاتصال. تكدر تحاول مرة ثانية؟ 🔄" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full p-4 shadow-lg animate-pulse-glow transform hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    {/* Notification Dot */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-neutral-950 animate-pulse"></span>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="flex flex-col bg-neutral-900 border border-neutral-700/50 w-80 sm:w-96 h-[520px] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-slide-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-4 flex justify-between items-center shadow-lg relative overflow-hidden">
                        {/* Subtle animated bg pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-float"></div>
                            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all relative z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-3 text-right relative z-10">
                            <div>
                                <h3 className="text-white font-bold text-base">مساعد عراق تك</h3>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <p className="text-blue-100/80 text-xs">متصل الآن</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <span className="text-xl">🤖</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-neutral-900 space-y-3 text-right chat-scrollbar" dir="rtl">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2 max-w-[85%] animate-message-pop ${msg.role === "user" ? "mr-auto flex-row-reverse" : "ml-auto"
                                    }`}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Avatar for bot messages */}
                                {msg.role === "assistant" && (
                                    <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs">🤖</span>
                                    </div>
                                )}
                                <div
                                    className={`px-4 py-2.5 rounded-2xl ${msg.role === "user"
                                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-lg shadow-blue-900/30"
                                            : "bg-neutral-800/80 text-neutral-100 rounded-tl-sm border border-neutral-700/50"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex gap-2 ml-auto animate-message-pop">
                                <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-xs">🤖</span>
                                </div>
                                <div className="px-5 py-3.5 rounded-2xl bg-neutral-800/80 rounded-tl-sm border border-neutral-700/50 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-neutral-950 border-t border-neutral-800/80">
                        <form onSubmit={sendMessage} className="flex gap-2 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="اكتب رسالتك هنا..."
                                className="flex-1 bg-neutral-800/70 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 disabled:opacity-50 text-right placeholder:text-neutral-500 transition-all"
                                dir="rtl"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute left-2 top-1.5 w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-30 disabled:hover:shadow-none active:scale-90"
                            >
                                <svg className="w-4 h-4 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
