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
    const [{ isPending }] = usePayPalScriptReducer();
    const rountedAmount = Math.round(amount * 100) / 100; // 123.20

    if (isPending) {
        // alternativa
        // return (
        //   <div className="animate-pulse mb-16">
        //     <div className="h-11 bg-gray-300 rounded"></div>
        //     <div className="h-11 bg-gray-300 rounded mt-4"></div>
        //   </div>
        // );

        return <Spinner />;
    }

    const createOrder = async (
        data: CreateOrderData,
        actions: CreateOrderActions
    ): Promise<string> => {
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
    };

    const onApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
        const details = await actions.order?.capture();
        if (!details) return;

        await paypalCheckPayment(details.id as string);
    };

    return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
