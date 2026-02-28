import { getOrders } from "@/lib/db";

export async function GET(req) {
    try {
        const allOrders = getOrders();

        // Sort by newest first
        const sortedOrders = allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        return Response.json(sortedOrders);
    } catch (error) {
        return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
