import { redirect } from "next/navigation";
import { OrderStatus, PayPalWrapper, ProductImage, Title } from "@/components";
import { getOrderById } from "@/actions";
import { currencyFormat } from "@/utils";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function OrdersByIdPage({ params }: Props) {
    const { id } = await params;

    // obtener la orden
    const { ok, order } = await getOrderById(id);

    if (!ok) {
        redirect("/");
    }

    const address = order!.orderAddress;

    return (
        <div className="space-y-6">
            <Title
                title={`Orden #${id.split("-").pop()}`}
                subtitle="Detalles del pedido"
                size="md"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Productos de la orden */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Estado de la orden */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Estado del pedido
                        </h3>
                        <OrderStatus isPaid={order!.isPaid} />
                    </div>

                    {/* Lista de productos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Productos ({order!.itemsInOrder}{" "}
                            {order!.itemsInOrder === 1 ? "artículo" : "artículos"})
                        </h3>

                        <div className="space-y-4">
                            {order!.orderItems.map((item) => (
                                <div
                                    key={(item.product?.slug || item.productId) + "-" + item.size}
                                    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    {/* Imagen del Producto */}
                                    <div className="shrink-0 mx-auto sm:mx-0">
                                        <ProductImage
                                            src={item.product?.ProductImage[0]?.url}
                                            width={100}
                                            height={100}
                                            alt={item.product?.title || "Producto"}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        {/* Información del producto */}
                                        <div className="mb-3">
                                            <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                                                {item.product?.title || "Producto no encontrado"}
                                            </h4>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Talla:{" "}
                                                <span className="font-medium">{item.size}</span>
                                            </p>
                                        </div>

                                        {/* Precio y cantidad */}
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                                <span className="text-gray-600">
                                                    Precio unitario:
                                                </span>
                                                <span className="font-medium">
                                                    {currencyFormat(item.price)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                                <span className="text-gray-600">Cantidad:</span>
                                                <span className="font-medium">
                                                    {item.quantity}{" "}
                                                    {item.quantity === 1 ? "unidad" : "unidades"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between sm:justify-start sm:gap-4 pt-2 border-t border-gray-100">
                                                <span className="text-gray-900 font-semibold">
                                                    Subtotal:
                                                </span>
                                                <span className="font-bold text-gray-900">
                                                    {currencyFormat(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Información de entrega y resumen */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Dirección de entrega */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Dirección de entrega
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <p className="font-medium text-gray-900">
                                    {`${address!.firstName} ${address!.lastName}`}
                                </p>
                            </div>
                            <div className="text-gray-600">
                                <p>{address!.address}</p>
                                {address!.address2 && <p>{address!.address2}</p>}
                                <p>
                                    {address!.city}, {address!.countryId}
                                </p>
                                <p>CP: {address!.postalCode}</p>
                                <p>Tel: {address!.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de la orden */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Resumen de orden
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Cantidad</span>
                                <span className="font-medium text-gray-900">
                                    {order!.itemsInOrder === 1
                                        ? "1 artículo"
                                        : `${order!.itemsInOrder} artículos`}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">
                                    {currencyFormat(order!.subTotal)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Impuestos (15%)</span>
                                <span className="font-medium text-gray-900">
                                    {currencyFormat(order!.tax)}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Total:
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                        {currencyFormat(order!.total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estado de pago / Botón de PayPal */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            {order!.isPaid ? (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                        Estado del pago
                                    </h4>
                                    <OrderStatus isPaid={order!.isPaid} />
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                        Completar pago
                                    </h4>
                                    <PayPalWrapper amount={order!.total} orderId={order!.id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
