import Image from 'next/image';

const MOCK_PRODUCTS = [
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
                    <nav className="hidden md:flex gap-8 text-neutral-400 font-medium">
                        <a href="#" className="text-white transition-colors">المنتجات</a>
                        <a href="#" className="hover:text-white transition-colors">الأقسام</a>
                        <a href="#" className="hover:text-white transition-colors">من نحن</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 sm:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950 -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        مستقبل التقنية في <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">العراق</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-neutral-400 mb-12">
                        اكتشف أحدث الهواتف الذكية، اللابتوبات الاحترافية، ومعدات الصوت الفاخرة. مع توصيل سريع لجميع المحافظات.
                    </p>
                    <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                        تصفح المجموعة
                    </button>
                </div>
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-3xl font-bold">المنتجات المميزة</h3>
                    <div className="flex gap-2">
                        <span className="px-4 py-2 rounded-full border border-neutral-800 text-sm font-medium cursor-pointer hover:bg-neutral-800 transition">لابتوبات</span>
                        <span className="px-4 py-2 rounded-full border border-neutral-800 text-sm font-medium cursor-pointer hover:bg-neutral-800 transition">هواتف</span>
                        <span className="px-4 py-2 rounded-full bg-neutral-800 text-sm font-medium cursor-pointer hover:bg-neutral-700 transition">الكل</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_PRODUCTS.map((product) => (
                        <div key={product.id} className="group rounded-3xl bg-neutral-900/50 border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
                            <div className="relative h-64 w-full bg-neutral-800 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold border border-white/10 tracking-wider">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{product.name}</h4>
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

                                <button className="w-full py-4 rounded-xl bg-neutral-800 text-white font-medium hover:bg-blue-600 transition-colors group-hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
                                    أضف إلى السلة
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
