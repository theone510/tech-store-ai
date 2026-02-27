"use client";

import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "هلو عيني! شلون اكدر اساعدك اليوم؟ 🇮🇶" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setMessages((prev) => [...prev, data]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "اسف، صار عندي خلل بسيط بالاتصال. تكدر تحاول مرة ثانية؟" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Search Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-[0_0_20px_rgba(37,99,235,0.5)] transform hover:scale-110 transition-all duration-300"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="flex flex-col bg-neutral-900 border border-neutral-700 w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 flex justify-between items-center shadow-md">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-3 text-right">
                            <div>
                                <h3 className="text-white font-bold">مساعد عراق تك</h3>
                                <p className="text-blue-100 text-xs">متواجد دائماً لخدمتك</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <span className="text-xl">🤖</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-neutral-900 space-y-4 font-sans text-right" dir="rtl">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "mr-auto flex-row-reverse" : "ml-auto"
                                    }`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-2xl ${msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-tr-sm"
                                        : "bg-neutral-800 text-neutral-100 rounded-tl-sm border border-neutral-700"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-2 ml-auto">
                                <div className="px-4 py-3 rounded-2xl bg-neutral-800 rounded-tl-sm border border-neutral-700 flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-neutral-950 border-t border-neutral-800">
                        <form onSubmit={sendMessage} className="flex gap-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="اكتب رسالتك هنا..."
                                className="flex-1 bg-neutral-800 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-right"
                                dir="rtl"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute left-2 top-1.5 w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
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
