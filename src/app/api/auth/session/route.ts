import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
    try {
        const user = await getSession();

        if (!user) {
            return NextResponse.json(null, { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Session API error:", error);
        return NextResponse.json(null, { status: 500 });
    }
}
