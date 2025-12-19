"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
    CreateOrderData,
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js";
import { Spinner } from "../ui/spinner/Spinner";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
    orderId: string;
    amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {
    const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();
    const rountedAmount = Math.round(amount * 100) / 100; // 123.20

    if (isPending) {
        return <Spinner />;
    }

    if (isRejected) {
        return (
            <div className="mb-16 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                    Error al cargar PayPal. Por favor, recarga la página o intenta más tarde.
                </p>
            </div>
        );
    }

    if (!isResolved) {
        return <Spinner />;
    }

    const createOrder = async (
        data: CreateOrderData,
        actions: CreateOrderActions
    ): Promise<string> => {
        try {
            const transactionId = await actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        invoice_id: orderId,
                        amount: { currency_code: "USD", value: `${rountedAmount}` },
                    },
                ],
            });

            const order = await setTransactionId(orderId, transactionId);
            if (!order) {
                throw new Error("No se pudo actualizar la orden");
            }

            return transactionId;
        } catch (error) {
            console.error("Error creating PayPal order:", error);
            throw error;
        }
    };

    const onApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
        try {
            const details = await actions.order?.capture();
            if (!details) {
                throw new Error("No se pudieron capturar los detalles del pago");
            }

            await paypalCheckPayment(details.id as string);
        } catch (error) {
            console.error("Error processing PayPal payment:", error);
            throw error;
        }
    };

    return (
        <div className="relative z-0">
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
        </div>
    );
};
