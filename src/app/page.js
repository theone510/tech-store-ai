"use client";

import Image from 'next/image';
import { useUser } from "@/context/UserContext";

const MOCK_PRODUCTS = [
    // ... (products remain unchanged)

    {
        id: 1,
        name: "ايفون 15 برو | iPhone 15 Pro",
        priceIQD: 1550000,
        category: "هواتف",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
        features: ["معالج A17 Pro", "تصميم من التيتانيوم", "كاميرا أساسية 48 ميكابكسل"]
    },
    {
        id: 2,
        name: "سامسونج كالكسي S24 الترا",
        priceIQD: 1700000,
        category: "هواتف",
        image: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=800&auto=format&fit=crop",
        features: ["معالج سناب دراكون 8 الجيل الثالث", "كاميرا 200 ميكابكسل", "قلم S-Pen مدمج"]
    },
    {
        id: 3,
        name: "ماك بوك برو M3 - 14 انش",
        priceIQD: 2400000,
        category: "لابتوبات",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        features: ["معالج M3 Pro", "رام 18 كيكابايت", "شاشة Liquid Retina XDR"]
    },
    {
        id: 4,
        name: "سماعات سوني WH-1000XM5",
        priceIQD: 520000,
        category: "صوتيات",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
        features: ["عزل ضوضاء رائد", "بطارية تدوم 30 ساعة", "صوت محيطي نقي"]
    },
    {
        id: 5,
        name: "ايربودز برو (الجيل الثاني)",
        priceIQD: 320000,
        category: "صوتيات",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop",
        features: ["عزل ضوضاء نشط", "صوت تكيفي", "شحن ماك سيف"]
    },
    {
        id: 6,
        name: "لابتوب اسوس ROG Zephyrus G14",
        priceIQD: 2150000,
        category: "لابتوبات",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
        features: ["معالج رايزن 9", "كرت شاشة RTX 4060", "شاشة 165 هرتز"]
    },
    {
        id: 7,
        name: "ساعة ابل الجيل التاسع | Apple Watch Series 9",
        priceIQD: 650000,
        category: "ساعات ذكية",
        image: "https://images.unsplash.com/photo-1434493789847-2f02bbf18116?q=80&w=800&auto=format&fit=crop",
        features: ["شاشة ريتينا مضيئة", "تتبع صحة متقدم", "مقاومة للماء"]
    },
    {
        id: 8,
        name: "ايباد برو M4 - 11 انش | iPad Pro M4",
        priceIQD: 1600000,
        category: "اجهزة لوحية",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
        features: ["شاشة OLED", "معالج M4 الخارق", "دعم قلم ابل برو"]
    },
    {
        id: 9,
        name: "بلاي ستيشن 5 سليم | PlayStation 5 Slim",
        priceIQD: 900000,
        category: "العاب",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop",
        features: ["سعة 1 تيرابايت", "يد تحكم دوال سينس", "دعم 4K بـ 120 إطار"]
    }
];

export default function Home() {
    const { user, logout, setIsLoginModalOpen } = useUser();

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 font-arabic">
                            متجر عراق تك
                        </h1>
                    </div>
                    <nav className="flex items-center gap-4 text-neutral-400 font-medium font-arabic">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <a href="/profile" className="text-sm text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors px-4 py-2 rounded-full hidden sm:block flex items-center gap-2">
                                    <span>مرحباً، <span className="font-bold text-white">{user.name.split(' ')[0]}</span></span>
                                </a>
                                <button
                                    onClick={logout}
                                    className="text-sm text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-full"
                                >
                                    خروج
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                            >
                                تسجيل الدخول
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-28 sm:py-36">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950 -z-10"></div>
                {/* Floating orbs */}
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-10 left-1/4 w-56 h-56 bg-cyan-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        توصيل لجميع المحافظات العراقية
                    </div>
                    <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        مستقبل التقنية في <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">العراق</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-neutral-400 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        اكتشف أحدث الهواتف الذكية، اللابتوبات الاحترافية، ومعدات الصوت الفاخرة. مع مساعد ذكي يساعدك بالاختيار.
                    </p>
                    <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <a href="#products" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                            تصفح المجموعة
                        </a>
                        <a href="/admin" className="bg-neutral-900 text-neutral-300 border border-neutral-700 px-6 py-4 rounded-full font-bold text-lg hover:bg-neutral-800 hover:text-white transition-all">
                            لوحة التحكم
                        </a>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="border-y border-neutral-800/50 bg-neutral-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-white font-bold">توصيل مجاني</span>
                            <span className="text-sm text-neutral-400">لكل محافظات العراق</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-white font-bold">ضمان سنة كاملة</span>
                            <span className="text-sm text-neutral-400">على جميع الأجهزة</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-end">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-white font-bold">مساعد ذكي 24/7</span>
                            <span className="text-sm text-neutral-400">يرد على استفساراتك بالعراقي</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-3xl font-bold mb-2">المنتجات المميزة</h3>
                        <p className="text-neutral-500">أفضل الأجهزة لعام 2025</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-4 py-2 rounded-full border border-neutral-800 text-sm font-medium cursor-pointer hover:bg-neutral-800 transition">لابتوبات</span>
                        <span className="px-4 py-2 rounded-full border border-neutral-800 text-sm font-medium cursor-pointer hover:bg-neutral-800 transition">هواتف</span>
                        <span className="px-4 py-2 rounded-full bg-neutral-800 text-sm font-medium cursor-pointer hover:bg-neutral-700 transition">الكل</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_PRODUCTS.map((product, index) => (
                        <div
                            key={product.id}
                            className="group rounded-3xl bg-neutral-900/50 border border-neutral-800 overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 animate-card-entrance"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <div className="relative h-64 w-full bg-neutral-800 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold border border-white/10 tracking-wider">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300">{product.name}</h4>
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 mb-6 flex items-center gap-1">
                                    <span>{product.priceIQD.toLocaleString()}</span>
                                    <span className="text-sm font-normal text-neutral-500 mt-1">دينار عراقي</span>
                                </div>

                                <ul className="mb-8 space-y-2">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-neutral-400">
                                            <svg className="w-4 h-4 ml-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full py-4 rounded-xl bg-neutral-800 text-white font-medium hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 group-hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] active:scale-[0.98]">
                                    أضف إلى السلة
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-800 bg-neutral-950 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white">متجر عراق تك</span>
                            </div>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                أفضل متجر الكتروني في العراق لبيع الهواتف الذكية والحواسيب المحمولة والاكسسوارات بأسعار تنافسية.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
                            <ul className="space-y-3 text-sm text-neutral-400">
                                <li><a href="#products" className="hover:text-white transition-colors">المنتجات</a></li>
                                <li><a href="/profile" className="hover:text-white transition-colors">حسابي</a></li>
                                <li><a href="/admin" className="hover:text-white transition-colors">لوحة التحكم</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">تواصل معنا</h4>
                            <ul className="space-y-3 text-sm text-neutral-400">
                                <li className="flex items-center gap-2">
                                    <span>📞</span> 07XX-XXX-XXXX
                                </li>
                                <li className="flex items-center gap-2">
                                    <span>📧</span> info@iraqtech.iq
                                </li>
                                <li className="flex items-center gap-2">
                                    <span>📍</span> بغداد، العراق
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent mb-8"></div>
                    <p className="text-center text-sm text-neutral-600">
                        © 2025 متجر عراق تك — جميع الحقوق محفوظة. صنع بـ ❤️ في العراق.
                    </p>
                </div>
            </footer>
        </main>
    );
}
