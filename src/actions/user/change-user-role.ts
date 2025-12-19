"use server";

import { getSession, getAuthToken } from "@/lib/session";
import { usersService } from "@/lib/services";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, role: string) => {
    const user = await getSession();
    const token = await getAuthToken();

    if (!user || !user.roles.includes("admin") || !token) {
        return {
            ok: false,
            message: "Debe de estar autenticado como Administrador",
        };
    }

    // Prevent user from changing their own role
    if (userId === user.id) {
        return {
            ok: false,
            message: "No puedes cambiar tu propio rol",
        };
    }

    try {
        const newRole = role === "admin" ? "admin" : "user";

        await usersService.changeUserRole(userId, { role: newRole }, token);

        revalidatePath("/admin/users");

        return {
            ok: true,
        };
    } catch (error) {
        console.error("Error changing user role:", error);

        return {
            ok: false,
            message: "No se pudo actualizar el rol",
        };
    }
};
