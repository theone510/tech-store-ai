import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET(req) {
    try {
        const q = query(collection(db, "conversations"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const conversations = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        return Response.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return Response.json([]);
    }
}
