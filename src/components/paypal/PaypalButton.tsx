"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Spinner } from "../ui/spinner/Spinner";

export const PayPalButton = () => {
    const [{ isPending }] = usePayPalScriptReducer();

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

    return <PayPalButtons />;
};
