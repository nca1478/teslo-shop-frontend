"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AuthProvider } from "@/contexts/AuthContext";

interface Props {
    children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
                intent: "capture",
                currency: "USD",
                locale: "es_VE", // 'en_US': usa, 'es_ES': españa
            }}
        >
            <AuthProvider>{children}</AuthProvider>
        </PayPalScriptProvider>
    );
};
