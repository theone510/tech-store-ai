import { getOrdersByPhone } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");

        if (!phone) {
            return Response.json({ error: "Phone number required" }, { status: 400 });
        }

        const userOrders = await getOrdersByPhone(phone);
        return Response.json(userOrders);
    } catch (error) {
        return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
