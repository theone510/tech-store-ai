import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "ايفون 15 برو | iPhone 15 Pro",
        priceIQD: 1550000,
        category: "هواتف",
        features: ["معالج A17 Pro", "تصميم من التيتانيوم", "كاميرا أساسية 48 ميكابكسل"]
    },
    {
        id: 2,
        name: "سامسونج كالكسي S24 الترا",
        priceIQD: 1700000,
        category: "هواتف",
        features: ["معالج سناب دراكون 8 الجيل الثالث", "كاميرا 200 ميكابكسل", "قلم S-Pen مدمج"]
    },
    {
        id: 3,
        name: "ماك بوك برو M3 - 14 انش",
        priceIQD: 2400000,
        category: "لابتوبات",
        features: ["معالج M3 Pro", "رام 18 كيكابايت", "شاشة Liquid Retina XDR"]
    },
    {
        id: 4,
        name: "سماعات سوني WH-1000XM5",
        priceIQD: 520000,
        category: "صوتيات",
        features: ["عزل ضوضاء رائد", "بطارية تدوم 30 ساعة", "صوت محيطي نقي"]
    },
    {
        id: 5,
        name: "ايربودز برو (الجيل الثاني)",
        priceIQD: 320000,
        category: "صوتيات",
        features: ["عزل ضوضاء نشط", "صوت تكيفي", "شحن ماك سيف"]
    },
    {
        id: 6,
        name: "لابتوب اسوس ROG Zephyrus G14",
        priceIQD: 2150000,
        category: "لابتوبات",
        features: ["معالج رايزن 9", "كرت شاشة RTX 4060", "شاشة 165 هرتز"]
    },
    {
        id: 7,
        name: "ساعة ابل الجيل التاسع | Apple Watch Series 9",
        priceIQD: 650000,
        category: "ساعات ذكية",
        features: ["شاشة ريتينا مضيئة", "تتبع صحة متقدم", "مقاومة للماء"]
    },
    {
        id: 8,
        name: "ايباد برو M4 - 11 انش | iPad Pro M4",
        priceIQD: 1600000,
        category: "اجهزة لوحية",
        features: ["شاشة OLED", "معالج M4 الخارق", "دعم قلم ابل برو"]
    },
    {
        id: 9,
        name: "بلاي ستيشن 5 سليم | PlayStation 5 Slim",
        priceIQD: 900000,
        category: "العاب",
        features: ["سعة 1 تيرابايت", "يد تحكم دوال سينس", "دعم 4K بـ 120 إطار"]
    }
];

export async function POST(req) {
    try {
        const body = await req.json();
        const { messages } = body;

        // Get the latest user message
        const lastUserMessage = messages[messages.length - 1].content;

        // Provide the store's knowledge base directly in the system prompt
        // This is a simpler and more robust form of RAG for small datasets
        const storeContext = MOCK_PRODUCTS.map(p =>
            `${p.name} (${p.category}) - السعر: ${p.priceIQD.toLocaleString()} دينار عراقي. المواصفات: ${p.features.join("، ")}`
        ).join("\n");

        const systemInstruction = `
أنت مساعد خدمة عملاء للرد على زبائن "متجر عراق تك" للإلكترونيات في العراق.
يجب عليك التحدث باللهجة العراقية اللطيفة والمحترمة (مثال: هلا عيني، وتدلل، ومية هلا).
    
قواعد مهمة جداً:
1. يمكنك فقط التحدث عن المنتجات الموجودة في قائمة المنتجات أدناه.
2. إذا سأل الزبون عن منتج غير موجود في القائمة، اعتذر بلطف وأخبره أن المنتج غير متوفر حالياً. لا تخترع أسعاراً أو منتجات من مخيلتك.
3. جميع الأسعار بالدينار العراقي (IQD).
4. اجعل إجاباتك قصيرة ومختصرة لتسهيل قراءتها على الهاتف.

قائمة المنتجات المتوفرة:
${storeContext}
`;

        // Format messages for Gemini API
        // Gemini expects { role: "user" | "model", parts: [{ text: "..." }] }
        // We receive from the client { role: "user" | "assistant", content: "..." }
        const geminiHistory = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Start a chat session
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
                temperature: 0.3, // Lower temperature to stick to the facts
            },
            history: geminiHistory.slice(0, -1), // Everything except the latest message
        });

        const response = await chat.sendMessage({
            message: [{ text: lastUserMessage }]
        });

        return Response.json({
            role: "assistant",
            content: response.text
        });

    } catch (error) {
        console.error("Chat API error:", error);
        return Response.json(
            { error: "Failed to process chat request." },
            { status: 500 }
        );
    }
}
