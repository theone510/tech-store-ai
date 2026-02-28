import { getOrders } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");

        if (!phone) {
            return Response.json({ error: "Phone number required" }, { status: 400 });
        }

        const allOrders = getOrders();
        // Simple authentication check using the phone number for the MVP
        const userOrders = allOrders.filter(order => order.customerPhone === phone);

        // Sort by newest first
        const sortedOrders = userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        return Response.json(sortedOrders);
    } catch (error) {
        return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
