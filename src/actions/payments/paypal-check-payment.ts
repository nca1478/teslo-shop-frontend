"use server";

import { paymentsService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                ok: false,
                message: "No autorizado",
            };
        }

        const result = await paymentsService.paypalCheckPayment({ paypalTransactionId }, token);

        if (result.ok) {
            revalidatePath("/orders");
            revalidatePath("/admin/orders");
        }

        return result;
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "El pago no se pudo realizar",
        };
    }
};
