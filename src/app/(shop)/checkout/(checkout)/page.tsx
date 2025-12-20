import Link from "next/link";
import { Title } from "@/components";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-6 rounded-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Title title="Verificar orden" size="md" className="text-center sm:text-left" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                    {/* Productos en el carrito */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                                    Ajustar elementos
                                </h2>
                                <Link
                                    href="/cart"
                                    className="text-blue-600 hover:text-blue-800 underline text-sm sm:text-base transition-colors"
                                >
                                    Editar carrito
                                </Link>
                            </div>

                            {/* Productos en el carrito */}
                            <ProductsInCart />
                        </div>
                    </div>

                    {/* Resumen de orden */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <PlaceOrder />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
