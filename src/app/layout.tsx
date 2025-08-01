import type { Metadata } from "next";
import { inter } from "@/config/fonts";
import { Provider } from "@/components";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "Teslo Shop - %s",
        default: "Home - Teslo | Shop",
    },
    description: "Tu tienda virtual de confianza",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
