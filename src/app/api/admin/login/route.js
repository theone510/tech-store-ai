export async function POST(req) {
    try {
        const { password } = await req.json();

        if (password === process.env.ADMIN_PASSWORD) {
            // Generate a simple session token
            const token = Buffer.from(`admin_${Date.now()}_${process.env.ADMIN_PASSWORD}`).toString('base64');
            return Response.json({ success: true, token });
        }

        return Response.json({ success: false, error: "كلمة المرور غير صحيحة" }, { status: 401 });
    } catch (error) {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}

// Verify token
export async function GET(req) {
    try {
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return Response.json({ valid: false }, { status: 401 });

        const decoded = Buffer.from(token, 'base64').toString();
        if (decoded.startsWith("admin_") && decoded.endsWith(process.env.ADMIN_PASSWORD)) {
            return Response.json({ valid: true });
        }

        return Response.json({ valid: false }, { status: 401 });
    } catch {
        return Response.json({ valid: false }, { status: 401 });
    }
}
