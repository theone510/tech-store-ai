"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function LoginModal() {
    const { isLoginModalOpen, setIsLoginModalOpen, login } = useUser();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });

    if (!isLoginModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-backdrop-in">
            <div className="bg-neutral-900 border border-neutral-700/50 w-full max-w-md rounded-3xl p-7 shadow-2xl shadow-black/50 animate-modal-in" dir="rtl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">تسجيل الدخول</h2>
                        <p className="text-sm text-neutral-400">أدخل بياناتك لتسهيل عملية الطلب</p>
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

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-6"></div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">الاسم الكامل</label>
                        <input
                            required
                            type="text"
                            placeholder="مثال: أحمد علي"
                            className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">رقم الهاتف</label>
                        <input
                            required
                            type="tel"
                            placeholder="07XX XXX XXXX"
                            className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-neutral-800 transition-all text-left placeholder:text-neutral-500"
                            dir="ltr"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">المحافظة والعنوان الكامل</label>
                        <input
                            required
                            type="text"
                            placeholder="مثال: بغداد، الكرادة، شارع 62"
                            className="w-full bg-neutral-800/70 border border-neutral-700/50 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-500"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98] mt-2"
                    >
                        حفظ البيانات ✨
                    </button>
                </form>
            </div>
        </div>
    );
}
