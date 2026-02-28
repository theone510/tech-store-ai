"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function LoginModal() {
    const { isLoginModalOpen, setIsLoginModalOpen, login, loginAsAdmin } = useUser();
    const [mode, setMode] = useState("login");
    const [loginData, setLoginData] = useState({ phone: "", password: "" });
    const [registerData, setRegisterData] = useState({ name: "", phone: "", address: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isLoginModalOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });
            const data = await res.json();

            if (data.success) {
                if (data.isAdmin) {
                    loginAsAdmin(data.token);
                }
                login(data.user);
            } else {
                setError(data.error || "فشل في تسجيل الدخول");
            }
        } catch {
            setError("حدث خطأ في الاتصال");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();

            if (data.success) {
                login(data.user);
            } else {
                setError(data.error || "فشل في إنشاء الحساب");
            }
        } catch {
            setError("حدث خطأ في الاتصال");
        } finally {
            setIsLoading(false);
        }
    };

    const resetAndSwitch = (newMode) => {
        setMode(newMode);
        setError("");
        setSuccess("");
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

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                        {success}
                    </div>
                )}

                {/* ===== LOGIN FORM ===== */}
                {mode === "login" && (
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">رقم الهاتف</label>
                            <input
                                required type="tel" placeholder="07XX XXX XXXX"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500"
                                dir="ltr"
                                value={loginData.phone}
                                onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">كلمة المرور</label>
                            <input
                                required type="password" placeholder="••••••••"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500"
                                dir="ltr"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "جاري التحقق..." : "دخول 🔐"}
                        </button>

                        <p className="text-center text-sm text-neutral-500">
                            ما عندك حساب؟{" "}
                            <button type="button" onClick={() => resetAndSwitch("register")} className="text-blue-400 hover:text-blue-300">سجل هنا</button>
                        </p>
                    </form>
                )}

                {/* ===== REGISTER FORM ===== */}
                {mode === "register" && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">الاسم الكامل</label>
                            <input
                                required type="text" placeholder="مثال: أحمد علي"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-500"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">رقم الهاتف</label>
                            <input
                                required type="tel" placeholder="07XX XXX XXXX"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500"
                                dir="ltr"
                                value={registerData.phone}
                                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">المحافظة والعنوان</label>
                            <input
                                required type="text" placeholder="مثال: بغداد، الكرادة، شارع 62"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-500"
                                value={registerData.address}
                                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">كلمة المرور</label>
                            <input
                                required type="password" placeholder="اختر كلمة مرور قوية"
                                className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500 placeholder:text-right"
                                dir="ltr"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
                        >
                            {isLoading ? "جاري التسجيل..." : "إنشاء حساب ✨"}
                        </button>

                        <p className="text-center text-sm text-neutral-500">
                            عندك حساب؟{" "}
                            <button type="button" onClick={() => resetAndSwitch("login")} className="text-blue-400 hover:text-blue-300">سجل دخول</button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
