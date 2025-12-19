import Link from "next/link";
import { Title } from "@/components";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";
// import { initialData } from "@/seed/seed";

// const productsInCart = [initialData.products[0], initialData.products[1], initialData.products[2]];

export default function CartPage() {
    // redirect("/empty");

    return (
        <div className="flex justify-center items-start min-h-[60vh] px-4 sm:px-6 lg:px-0">
            <div className="w-full max-w-6xl">
                <Title title="Carrito de Compras" size="md" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mt-6">
                    {/* Carrito */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                                    Productos en tu carrito
                                </h2>
                                <Link
                                    href="/"
                                    className="text-blue-600 hover:text-blue-800 underline text-sm sm:text-base transition-colors"
                                >
                                    Continuar comprando
                                </Link>
                            </div>

                            {/* Productos en el carrito */}
                            <ProductsInCart />
                        </div>
                    </div>

                    {/* Checkout - Resumen de la orden */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-24">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                                Resumen de orden
                            </h2>

                            <OrderSummary />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
