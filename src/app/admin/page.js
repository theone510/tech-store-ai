"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders/admin`);
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

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-blue-500/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-arabic text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
                            لوحة تحكم الإدارة
                        </h1>
                        <p className="text-neutral-400">إدارة ومتابعة طلبات ورسائل الزبائن</p>
                    </div>
                    <Link href="/" className="text-neutral-400 hover:text-white transition-colors bg-neutral-900 px-4 py-2 rounded-xl text-sm font-medium border border-neutral-800">
                        العودة للمتجر
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
                        <div className="text-neutral-400 mb-2">إجمالي الطلبات</div>
                        <div className="text-4xl font-bold text-white">{orders.length}</div>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
                        <div className="text-neutral-400 mb-2">الطلبات قيد المعالجة</div>
                        <div className="text-4xl font-bold text-blue-400">
                            {orders.filter(o => o.status === "قيد المعالجة").length}
                        </div>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
                        <div className="text-neutral-400 mb-2">إجمالي الإيرادات</div>
                        <div className="text-3xl font-bold text-green-400" dir="ltr">
                            IQD {orders.reduce((sum, order) => sum + order.productPrice, 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">سجل الطلبات</h2>
                        <button
                            onClick={fetchOrders}
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
                        >
                            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            تحديث
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm text-neutral-300">
                            <thead className="bg-neutral-900/50 text-neutral-400 border-b border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-medium">رقم الطلب</th>
                                    <th className="px-6 py-4 font-medium">الزبون</th>
                                    <th className="px-6 py-4 font-medium">المنتج</th>
                                    <th className="px-6 py-4 font-medium">السعر</th>
                                    <th className="px-6 py-4 font-medium">العنوان</th>
                                    <th className="px-6 py-4 font-medium">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-neutral-500">
                                            لا توجد طلبات حتى الآن
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{order.customerName}</div>
                                                <div className="text-xs text-neutral-500 font-mono mt-1" dir="ltr">{order.customerPhone}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{order.productName}</td>
                                            <td className="px-6 py-4">
                                                {order.productPrice.toLocaleString()} <span className="text-xs text-neutral-500">د.ع</span>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={order.customerAddress}>
                                                {order.customerAddress}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
