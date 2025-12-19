"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AuthProvider } from "@/contexts/AuthContext";

interface Props {
    children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    // Si no hay clientId de PayPal, solo usar AuthProvider
    if (!paypalClientId || paypalClientId === "") {
        console.warn("PayPal Client ID not configured. PayPal payments will not be available.");
        return <AuthProvider>{children}</AuthProvider>;
    }

    const paypalOptions = {
        clientId: paypalClientId,
        intent: "capture" as const,
        currency: "USD",
        locale: "es_ES",
    };

    return (
        <PayPalScriptProvider options={paypalOptions} deferLoading={true}>
            <AuthProvider>{children}</AuthProvider>
        </PayPalScriptProvider>
    );
};
