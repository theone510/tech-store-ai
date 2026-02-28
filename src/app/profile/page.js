"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const { user, isLoginModalOpen } = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Protect the route
        if (!user && !isLoginModalOpen) {
            router.push("/");
            return;
        }

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders/user?phone=${encodeURIComponent(user.phone)}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-blue-500/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold font-arabic text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                        مرحباً، {user.name}
                    </h1>
                    <Link href="/" className="text-neutral-400 hover:text-white transition-colors bg-neutral-900 px-4 py-2 rounded-xl text-sm font-medium">
                        العودة للمتجر
                    </Link>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-xl">
                    <h2 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-4">معلومات الحساب والتوصيل</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-neutral-300">
                        <div>
                            <span className="block text-sm text-neutral-500 mb-1">رقم الهاتف</span>
                            <span className="font-medium" dir="ltr">{user.phone}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-neutral-500 mb-1">عنوان التوصيل</span>
                            <span className="font-medium">{user.address}</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 font-arabic text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    طلباتي السابقة
                </h2>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-neutral-900/30 border border-neutral-800 border-dashed rounded-3xl">
                        <p className="text-neutral-400 text-lg">لا توجد طلبات سابقة 🛒</p>
                        <Link href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">تصفح المنتجات الآن</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white">{order.productName}</h3>
                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-neutral-400 flex items-center gap-4">
                                        <span>رقم الطلب: {order.id}</span>
                                        <span>•</span>
                                        <span>{new Date(order.date).toLocaleDateString('ar-IQ')}</span>
                                    </div>
                                </div>
                                <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 whitespace-nowrap">
                                    {order.productPrice.toLocaleString()} <span className="text-sm font-normal text-neutral-500">د.ع</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
