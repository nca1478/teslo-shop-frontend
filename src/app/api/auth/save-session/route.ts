import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";
import type { User } from "@/lib/session";

export async function POST(request: NextRequest) {
    try {
        const { token, user }: { token: string; user: User } = await request.json();

        if (!token || !user) {
            return NextResponse.json(
                { error: "Token and user data are required" },
                { status: 400 }
            );
        }

        await setSession(token, user);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Save session API error:", error);
        return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
    }
}
