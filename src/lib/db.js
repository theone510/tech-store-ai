import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";

const ORDERS_COLLECTION = "orders";

export async function getOrders() {
    try {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error reading from Firestore:", error);
        return [];
    }
}

export async function getOrdersByPhone(phone) {
    try {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            where("customerPhone", "==", phone),
            orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error reading user orders from Firestore:", error);
        return [];
    }
}

export async function saveOrder(order) {
    try {
        await addDoc(collection(db, ORDERS_COLLECTION), {
            ...order,
            date: order.date || new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error("Error writing to Firestore:", error);
        return false;
    }
}
