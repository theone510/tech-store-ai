import { getOrders } from "@/lib/db";

export async function GET(req) {
    try {
        const allOrders = await getOrders();
        return Response.json(allOrders);
    } catch (error) {
        return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
