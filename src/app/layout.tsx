import type { Metadata } from "next";
import { inter } from "@/config/fonts/fonts";
import { Providers } from "@/components";
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
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
