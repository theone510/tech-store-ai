import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// LOGIN
export async function POST(req) {
    try {
        const { phone, password } = await req.json();

        if (!phone || !password) {
            return Response.json({ error: "الرجاء إدخال رقم الهاتف وكلمة المرور" }, { status: 400 });
        }

        // Check admin credentials first
        if (password === process.env.ADMIN_PASSWORD) {
            const token = Buffer.from(`admin_${Date.now()}_${process.env.ADMIN_PASSWORD}`).toString('base64');
            return Response.json({
                success: true,
                isAdmin: true,
                token,
                user: { name: "المدير", phone, address: "لوحة التحكم" }
            });
        }

        // Find user by phone
        const q = query(collection(db, "users"), where("phone", "==", phone));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return Response.json({ error: "لا يوجد حساب بهذا الرقم. الرجاء إنشاء حساب جديد." }, { status: 404 });
        }

        const userData = snapshot.docs[0].data();

        // Verify password
        if (userData.password !== password) {
            return Response.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
        }

        return Response.json({
            success: true,
            isAdmin: false,
            user: { name: userData.name, phone: userData.phone, address: userData.address }
        });
    } catch (error) {
        console.error("Login error:", error);
        return Response.json({ error: "فشل في تسجيل الدخول" }, { status: 500 });
    }
}
