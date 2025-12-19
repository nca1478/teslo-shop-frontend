import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
    try {
        const user = await getSession();

        if (!user) {
            // Retornar 200 con null en lugar de 401 para evitar errores en consola
            return NextResponse.json(null, { status: 200 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Session API error:", error);
        return NextResponse.json(null, { status: 500 });
    }
}
