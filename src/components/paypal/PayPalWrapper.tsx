"use client";

import { useEffect, useState } from "react";
import { PayPalButton } from "./PaypalButton";

interface Props {
    orderId: string;
    amount: number;
}

export const PayPalWrapper = ({ orderId, amount }: Props) => {
    const [isPayPalAvailable, setIsPayPalAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar si PayPal está disponible
        const checkPayPalAvailability = () => {
            const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

            if (!paypalClientId || paypalClientId === "") {
                setIsPayPalAvailable(false);
                setIsLoading(false);
                return;
            }

            setIsPayPalAvailable(true);
            setIsLoading(false);
        };

        checkPayPalAvailability();
    }, []);

    if (isLoading) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 bg-gray-300 rounded"></div>
                <div className="h-11 bg-gray-300 rounded mt-4"></div>
            </div>
        );
    }

    if (!isPayPalAvailable) {
        return (
            <div className="mb-16 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                    PayPal no está configurado. Contacta al administrador para habilitar los pagos
                    con PayPal.
                </p>
            </div>
        );
    }

    return <PayPalButton orderId={orderId} amount={amount} />;
};
