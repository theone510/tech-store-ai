"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function LoginModal() {
    const { isLoginModalOpen, setIsLoginModalOpen, login, loginAsAdmin } = useUser();
    const [mode, setMode] = useState("login"); // "login" or "register"
    const [loginData, setLoginData] = useState({ phone: "", password: "" });
    const [registerData, setRegisterData] = useState({ name: "", phone: "", address: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isLoginModalOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Check if it's the admin trying to log in
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: loginData.password }),
            });
            const data = await res.json();
            if (data.success) {
                // Admin detected!
                loginAsAdmin(data.token);
                login({ name: "المدير", phone: loginData.phone, address: "لوحة التحكم" });
                setIsLoading(false);
                return;
            }
        } catch (e) { /* not admin, continue */ }

        // Regular user login — load from localStorage by phone
        const savedUser = localStorage.getItem("iraqtech_user");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed.phone === loginData.phone) {
                login(parsed);
                setIsLoading(false);
                return;
            }
        }

        setError("الرجاء تسجيل حساب جديد أولاً، أو تحقق من الرقم");
        setIsLoading(false);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        login(registerData);
    };

    const resetAndSwitch = (newMode) => {
        setMode(newMode);
        setError("");
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-backdrop-in">
            <div className="bg-neutral-900 border border-neutral-700/50 w-full max-w-md rounded-3xl p-7 shadow-2xl shadow-black/50 animate-modal-in" dir="rtl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                        </h2>
                        <p className="text-sm text-neutral-400">
                            {mode === "login" ? "أدخل بياناتك للدخول" : "أدخل بياناتك لفتح حساب جديد"}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsLoginModalOpen(false)}
                        className="text-neutral-400 hover:text-white hover:bg-neutral-800 p-2 rounded-xl transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-neutral-800/50 p-1 rounded-xl">
                    <button
                        onClick={() => resetAndSwitch("login")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "login" ? "bg-neutral-700 text-white shadow" : "text-neutral-400 hover:text-white"
                            }`}
                    >
                        تسجيل الدخول
                    </button>
                    <button
                        onClick={() => resetAndSwitch("register")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "register" ? "bg-neutral-700 text-white shadow" : "text-neutral-400 hover:text-white"
                            }`}
                    >
                        حساب جديد
                    </button>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-6"></div>

                {/* ===== LOGIN FORM ===== */}
                {mode === "login" && (
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">رقم الهاتف</label>
                            <input
                                required
                                type="tel"
                                placeholder="07XX XXX XXXX"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500"
                                dir="ltr"
                                value={loginData.phone}
                                onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">كلمة المرور <span className="text-neutral-500 text-xs">(للمدير فقط)</span></label>
                            <input
                                type="password"
                                placeholder="اتركه فارغاً إذا لست المدير"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500 placeholder:text-right"
                                dir="ltr"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "جاري التحقق..." : "دخول 🔐"}
                        </button>

                        <p className="text-center text-sm text-neutral-500">
                            ما عندك حساب؟{" "}
                            <button type="button" onClick={() => resetAndSwitch("register")} className="text-blue-400 hover:text-blue-300">
                                سجل هنا
                            </button>
                        </p>
                    </form>
                )}

                {/* ===== REGISTER FORM ===== */}
                {mode === "register" && (
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">الاسم الكامل</label>
                            <input
                                required
                                type="text"
                                placeholder="مثال: أحمد علي"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-500"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">رقم الهاتف</label>
                            <input
                                required
                                type="tel"
                                placeholder="07XX XXX XXXX"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500"
                                dir="ltr"
                                value={registerData.phone}
                                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">المحافظة والعنوان الكامل</label>
                            <input
                                required
                                type="text"
                                placeholder="مثال: بغداد، الكرادة، شارع 62"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-500"
                                value={registerData.address}
                                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98] mt-2"
                        >
                            إنشاء حساب ✨
                        </button>

                        <p className="text-center text-sm text-neutral-500">
                            عندك حساب؟{" "}
                            <button type="button" onClick={() => resetAndSwitch("login")} className="text-blue-400 hover:text-blue-300">
                                سجل دخول
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
