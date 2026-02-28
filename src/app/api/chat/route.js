import { GoogleGenAI } from "@google/genai";
import { saveOrder } from "@/lib/db";

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
        const { messages, user } = body;

        const lastUserMessage = messages[messages.length - 1].content;

        let userInfoStr = "The customer is a guest. Remind them to log in if they try to place an order.";
        if (user) {
            userInfoStr = `The customer is logged in. 
            Name: ${user.name}
            Phone: ${user.phone}
            Address: ${user.address}
            
            IMPORTANT: Since they are logged in, NEVER ask for their name, phone, or address. If they want to buy something, just use the 'place_order' tool and tell them to expect delivery to their address.`;
        }

        const storeContext = MOCK_PRODUCTS.map(p =>
            `${p.id}: ${p.name} (${p.category}) - السعر: ${p.priceIQD.toLocaleString()} دينار عراقي.`
        ).join("\n");

        const systemInstruction = `
أنت مساعد خدمة عملاء للرد على زبائن "متجر عراق تك" للإلكترونيات في العراق.
يجب عليك التحدث باللهجة العراقية اللطيفة والمحترمة (مثال: هلا عيني، وتدلل، ومية هلا).
    
قواعد مهمة جداً:
1. يمكنك فقط التحدث عن المنتجات الموجودة في قائمة المنتجات أدناه.
2. إذا سأل الزبون عن منتج غير موجود، اعتذر بلطف.
3. جميع الأسعار بالدينار العراقي (IQD).

معلومات الزبون الحالي:
${userInfoStr}

قائمة المنتجات المتوفرة:
${storeContext}
`;

        const geminiHistory = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Define the tool for Gemini
        const placeOrderTool = {
            name: "place_order",
            description: "Place an order for a customer. Only call this if the user is explicitly telling you they want to buy a specific product and they are logged in.",
            parameters: {
                type: "OBJECT",
                properties: {
                    product_id: {
                        type: "INTEGER",
                        description: "The numeric ID of the product from the STORE INVENTORY they want to buy."
                    }
                },
                required: ["product_id"]
            }
        };

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
                temperature: 0.1,
                tools: [{ functionDeclarations: [placeOrderTool] }]
            },
            history: geminiHistory.slice(0, -1),
        });

        const response = await chat.sendMessage({
            message: [{ text: lastUserMessage }]
        });

        // Check if Gemini wants to call our function
        if (response.functionCalls && response.functionCalls.length > 0) {
            const call = response.functionCalls[0];
            if (call.name === "place_order") {
                const productId = call.args.product_id;
                const product = MOCK_PRODUCTS.find(p => p.id === productId);

                const orderId = `IRQ-${Math.floor(Math.random() * 10000)}`;

                if (user && product) {
                    const newOrder = {
                        id: orderId,
                        customerName: user.name,
                        customerPhone: user.phone,
                        customerAddress: user.address,
                        productName: product.name,
                        productPrice: product.priceIQD,
                        status: "قيد المعالجة", // "Processing" in Arabic
                        date: new Date().toISOString()
                    };

                    await saveOrder(newOrder);
                    console.log(`[FIRESTORE SAVED] Order ${orderId} saved for ${user.name}`);
                }

                // Tell Gemini the function succeeded
                const funcResponse = await chat.sendMessage({
                    message: [{
                        functionResponse: {
                            name: "place_order",
                            response: { status: "success", order_id: orderId }
                        }
                    }]
                });

                return Response.json({
                    role: "assistant",
                    content: funcResponse.text
                });
            }
        }

        // Standard text response
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
