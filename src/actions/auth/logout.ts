"use server";

import { signOut } from "@/config";

export const logout = async () => {
    await signOut();
};
