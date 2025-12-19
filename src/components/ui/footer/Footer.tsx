import { titleFont } from "@/config/fonts/fonts";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
                    <Link
                        href="/"
                        className="flex items-center hover:text-gray-900 transition-colors"
                    >
                        <span
                            className={`${titleFont.className} antialiased font-bold text-gray-900`}
                        >
                            Teslo
                        </span>
                        <span className="ml-1">| Shop</span>
                        <span className="ml-2">© {new Date().getFullYear()}</span>
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                            Privacidad & Legal
                        </Link>

                        <Link href="/locations" className="hover:text-gray-900 transition-colors">
                            Ubicaciones
                        </Link>

                        <Link href="/contact" className="hover:text-gray-900 transition-colors">
                            Contacto
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
