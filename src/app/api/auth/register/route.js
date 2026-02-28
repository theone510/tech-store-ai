import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// REGISTER
export async function POST(req) {
    try {
        const { name, phone, address, password } = await req.json();

        if (!name || !phone || !password) {
            return Response.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
        }

        // Check if phone already exists
        const q = query(collection(db, "users"), where("phone", "==", phone));
        const existing = await getDocs(q);
        if (!existing.empty) {
            return Response.json({ error: "رقم الهاتف مسجل مسبقاً" }, { status: 409 });
        }

        // Save user
        await addDoc(collection(db, "users"), {
            name,
            phone,
            address,
            password, // In production, this should be hashed
            createdAt: new Date().toISOString()
        });

        return Response.json({
            success: true,
            user: { name, phone, address }
        });
    } catch (error) {
        console.error("Register error:", error);
        return Response.json({ error: "فشل في إنشاء الحساب" }, { status: 500 });
    }
}
