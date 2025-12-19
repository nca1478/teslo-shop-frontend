"use server";

import { paymentsService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";

export const setTransactionId = async (orderId: string, transactionId: string) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                ok: false,
                message: "No autorizado",
            };
        }

        const result = await paymentsService.setTransactionId({ orderId, transactionId }, token);

        return result;
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "No se pudo actualizar el id de la transacción",
        };
    }
};
