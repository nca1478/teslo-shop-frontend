import { httpClient } from "../http-client";

export interface SetTransactionIdRequest {
    orderId: string;
    transactionId: string;
}

export interface PayPalCheckPaymentRequest {
    paypalTransactionId: string;
}

export interface PaymentResponse {
    ok: boolean;
    message?: string;
}

export class PaymentsService {
    private basePath = "/api/payments";

    async setTransactionId(data: SetTransactionIdRequest, token: string): Promise<PaymentResponse> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await httpClient.post<void>(`${this.basePath}/set-transaction-id`, data, headers);

            return { ok: true };
        } catch (error) {
            console.error("Error setting transaction ID:", error);
            return {
                ok: false,
                message: "No se pudo actualizar el id de la transacción",
            };
        }
    }

    async paypalCheckPayment(
        data: PayPalCheckPaymentRequest,
        token: string
    ): Promise<PaymentResponse> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await httpClient.post<void>(`${this.basePath}/paypal/check`, data, headers);

            return { ok: true };
        } catch (error) {
            console.error("Error checking PayPal payment:", error);
            return {
                ok: false,
                message: "Error al verificar el pago",
            };
        }
    }
}

export const paymentsService = new PaymentsService();
