"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_OPTIONS = [
    { value: "قيد المعالجة", label: "قيد المعالجة", color: "blue" },
    { value: "تم الشحن", label: "تم الشحن", color: "yellow" },
    { value: "تم التوصيل", label: "تم التوصيل", color: "green" },
    { value: "ملغي", label: "ملغي", color: "red" },
];

const getStatusColor = (status) => {
    const s = STATUS_OPTIONS.find(o => o.value === status);
    if (!s) return { bg: "bg-neutral-500/10", text: "text-neutral-400", border: "border-neutral-500/20" };
    const colors = {
        blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
        yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
        green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
        red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    };
    return colors[s.color];
};

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [token, setToken] = useState("");

    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [expandedConvo, setExpandedConvo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if already logged in
    useEffect(() => {
        const saved = localStorage.getItem("admin_token");
        if (saved) {
            setToken(saved);
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
            fetchConversations();
        }
    }, [isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError("");
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("admin_token", data.token);
                setToken(data.token);
                setIsAuthenticated(true);
            } else {
                setLoginError("كلمة المرور غير صحيحة ❌");
            }
        } catch {
            setLoginError("حدث خطأ في الاتصال");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        setIsAuthenticated(false);
        setToken("");
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/orders/admin");
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/conversations");
            if (res.ok) setConversations(await res.json());
        } catch (e) { console.error(e); }
    };

    const updateOrderStatus = async (docId, newStatus) => {
        try {
            await fetch("/api/orders/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ docId, status: newStatus }),
            });
            setOrders(prev => prev.map(o => o.docId === docId ? { ...o, status: newStatus } : o));
        } catch (e) { console.error(e); }
    };

    // Extract unique users from orders
    const users = Object.values(
        orders.reduce((acc, order) => {
            const key = order.customerPhone;
            if (!acc[key]) {
                acc[key] = {
                    name: order.customerName,
                    phone: order.customerPhone,
                    address: order.customerAddress,
                    totalOrders: 0,
                    totalSpent: 0,
                };
            }
            acc[key].totalOrders += 1;
            acc[key].totalSpent += order.productPrice || 0;
            return acc;
        }, {})
    );

    // ========== LOGIN GATE ==========
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl animate-modal-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 to-orange-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-1">لوحة تحكم الإدارة</h1>
                        <p className="text-neutral-400 text-sm">أدخل كلمة المرور للدخول</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="كلمة المرور"
                            className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-center text-lg tracking-widest placeholder:text-neutral-500 placeholder:tracking-normal"
                            dir="ltr"
                            required
                        />
                        {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loginLoading ? "جاري التحقق..." : "دخول 🔐"}
                        </button>
                    </form>
                    <Link href="/" className="block text-center mt-6 text-neutral-500 text-sm hover:text-white transition-colors">العودة للمتجر</Link>
                </div>
            </main>
        );
    }

    // ========== MAIN DASHBOARD ==========
    const tabs = [
        { id: "orders", label: "📦 الطلبات", count: orders.length },
        { id: "users", label: "👥 المستخدمين", count: users.length },
        { id: "conversations", label: "💬 المحادثات", count: conversations.length },
    ];

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-500/30 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-1">
                            لوحة تحكم الإدارة
                        </h1>
                        <p className="text-neutral-500 text-sm">إدارة شاملة للمتجر والطلبات والزبائن</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl text-sm transition-colors">
                            المتجر
                        </Link>
                        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 bg-red-400/10 border border-red-500/20 px-4 py-2 rounded-xl text-sm transition-colors">
                            خروج
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
                        <div className="text-neutral-500 text-sm mb-1">إجمالي الطلبات</div>
                        <div className="text-3xl font-bold text-white">{orders.length}</div>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
                        <div className="text-neutral-500 text-sm mb-1">قيد المعالجة</div>
                        <div className="text-3xl font-bold text-blue-400">{orders.filter(o => o.status === "قيد المعالجة").length}</div>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
                        <div className="text-neutral-500 text-sm mb-1">تم التوصيل</div>
                        <div className="text-3xl font-bold text-green-400">{orders.filter(o => o.status === "تم التوصيل").length}</div>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
                        <div className="text-neutral-500 text-sm mb-1">الإيرادات</div>
                        <div className="text-2xl font-bold text-orange-400" dir="ltr">
                            {orders.reduce((s, o) => s + (o.productPrice || 0), 0).toLocaleString()} <span className="text-xs text-neutral-500">IQD</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-neutral-800 pb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-neutral-800 text-white shadow-lg"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                }`}
                        >
                            {tab.label} <span className="text-xs opacity-60 ml-1">({tab.count})</span>
                        </button>
                    ))}
                </div>

                {/* ===== ORDERS TAB ===== */}
                {activeTab === "orders" && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">سجل الطلبات</h2>
                            <button onClick={fetchOrders} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
                                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                تحديث
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-sm text-neutral-300">
                                <thead className="bg-neutral-900/80 text-neutral-500 border-b border-neutral-800">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">رقم الطلب</th>
                                        <th className="px-5 py-3 font-medium">الزبون</th>
                                        <th className="px-5 py-3 font-medium">المنتج</th>
                                        <th className="px-5 py-3 font-medium">السعر</th>
                                        <th className="px-5 py-3 font-medium">العنوان</th>
                                        <th className="px-5 py-3 font-medium">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {isLoading ? (
                                        <tr><td colSpan="6" className="py-12 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div></td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan="6" className="py-12 text-center text-neutral-500">لا توجد طلبات حتى الآن</td></tr>
                                    ) : orders.map((order) => {
                                        const sc = getStatusColor(order.status);
                                        return (
                                            <tr key={order.docId} className="hover:bg-neutral-800/30 transition-colors">
                                                <td className="px-5 py-4 font-mono text-xs text-neutral-400">{order.id}</td>
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-white">{order.customerName}</div>
                                                    <div className="text-xs text-neutral-500 font-mono mt-0.5" dir="ltr">{order.customerPhone}</div>
                                                </td>
                                                <td className="px-5 py-4">{order.productName}</td>
                                                <td className="px-5 py-4">{(order.productPrice || 0).toLocaleString()} <span className="text-xs text-neutral-500">د.ع</span></td>
                                                <td className="px-5 py-4 max-w-[200px] truncate text-neutral-400" title={order.customerAddress}>{order.customerAddress}</td>
                                                <td className="px-5 py-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.docId, e.target.value)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none ${sc.bg} ${sc.text} ${sc.border} bg-neutral-900`}
                                                    >
                                                        {STATUS_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== USERS TAB ===== */}
                {activeTab === "users" && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-neutral-800">
                            <h2 className="text-lg font-bold text-white">قائمة الزبائن المسجلين</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-sm text-neutral-300">
                                <thead className="bg-neutral-900/80 text-neutral-500 border-b border-neutral-800">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">#</th>
                                        <th className="px-5 py-3 font-medium">الاسم</th>
                                        <th className="px-5 py-3 font-medium">رقم الهاتف</th>
                                        <th className="px-5 py-3 font-medium">العنوان</th>
                                        <th className="px-5 py-3 font-medium">عدد الطلبات</th>
                                        <th className="px-5 py-3 font-medium">إجمالي الإنفاق</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {users.length === 0 ? (
                                        <tr><td colSpan="6" className="py-12 text-center text-neutral-500">لا يوجد زبائن حتى الآن</td></tr>
                                    ) : users.map((u, idx) => (
                                        <tr key={u.phone} className="hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-5 py-4 text-neutral-500">{idx + 1}</td>
                                            <td className="px-5 py-4 font-medium text-white">{u.name}</td>
                                            <td className="px-5 py-4 font-mono text-sm" dir="ltr">{u.phone}</td>
                                            <td className="px-5 py-4 text-neutral-400 max-w-[200px] truncate">{u.address}</td>
                                            <td className="px-5 py-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">{u.totalOrders}</span>
                                            </td>
                                            <td className="px-5 py-4 text-orange-400 font-medium">
                                                {u.totalSpent.toLocaleString()} <span className="text-xs text-neutral-500">د.ع</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== CONVERSATIONS TAB ===== */}
                {activeTab === "conversations" && (
                    <div className="space-y-3">
                        {conversations.length === 0 ? (
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl py-16 text-center text-neutral-500">
                                لا توجد محادثات مسجلة حتى الآن
                            </div>
                        ) : conversations.map((convo) => (
                            <div key={convo.docId} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all">
                                <button
                                    onClick={() => setExpandedConvo(expandedConvo === convo.docId ? null : convo.docId)}
                                    className="w-full p-5 flex items-center justify-between hover:bg-neutral-800/30 transition-colors text-right"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">💬</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{convo.userName}</div>
                                            <div className="text-xs text-neutral-500 font-mono" dir="ltr">{convo.userPhone}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-neutral-500">{convo.timestamp ? new Date(convo.timestamp).toLocaleDateString('ar-IQ') : ''}</span>
                                        <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded-lg">{convo.messages?.length || 0} رسالة</span>
                                        <svg className={`w-4 h-4 text-neutral-500 transition-transform ${expandedConvo === convo.docId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                {expandedConvo === convo.docId && (
                                    <div className="border-t border-neutral-800 p-5 bg-neutral-950/50 space-y-3 max-h-96 overflow-y-auto chat-scrollbar" dir="rtl">
                                        {(convo.messages || []).map((msg, idx) => (
                                            <div key={idx} className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "mr-auto flex-row-reverse" : "ml-auto"}`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.role === "user"
                                                        ? "bg-blue-600/20 text-blue-100 rounded-tr-sm border border-blue-500/20"
                                                        : "bg-neutral-800 text-neutral-200 rounded-tl-sm border border-neutral-700/50"
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
