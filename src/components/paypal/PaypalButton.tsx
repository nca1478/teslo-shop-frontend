"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions } from "@paypal/paypal-js";
import { Spinner } from "../ui/spinner/Spinner";

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
                    // reference_id: "d9f80740-38f0-11e8-b467-0ed5f89f718b",
                    amount: { currency_code: "USD", value: `${rountedAmount}` },
                },
            ],
        });

        console.log({ transactionId });

        return transactionId;
    };

    return <PayPalButtons createOrder={createOrder} />;
};
