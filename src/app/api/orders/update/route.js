import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
    try {
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const { docId, status } = await req.json();

        const validStatuses = ["قيد المعالجة", "تم الشحن", "تم التوصيل", "ملغي"];
        if (!validStatuses.includes(status)) {
            return Response.json({ error: "Invalid status" }, { status: 400 });
        }

        await updateDoc(doc(db, "orders", docId), { status });

        return Response.json({ success: true });
    } catch (error) {
        console.error("Update order error:", error);
        return Response.json({ error: "Failed to update order" }, { status: 500 });
    }
}
