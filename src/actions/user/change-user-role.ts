"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, role: string) => {
    const user = await getSession();

    if (!user || !user.roles.includes("admin")) {
        return {
            ok: false,
            message: "Debe de estar autenticado como Administrador",
        };
    }

    try {
        const newRole = role === "admin" ? "admin" : "user";

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role: newRole,
            },
        });

        revalidatePath("/admin/users");

        return {
            ok: true,
        };
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: "No se pudo actualizar el rol",
        };
    }
};
