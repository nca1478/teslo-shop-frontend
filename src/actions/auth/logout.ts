"use server";

import { clearSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const logout = async () => {
    await clearSession();
    redirect("/");
};
