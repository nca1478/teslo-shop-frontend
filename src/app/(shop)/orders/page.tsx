// https://tailwindcomponents.com/component/hoverable-table
import Link from "next/link";

import { IoCardOutline } from "react-icons/io5";
import { getOrdersByUser } from "@/actions";
import { Title } from "@/components";
import {
    ResponsiveTable,
    MobileCardContainer,
    MobileCardItem,
    MobileCardField,
} from "@/components/ui/table/ResponsiveTable";

export default async function OrdersPage() {
    const { orders = [] } = await getOrdersByUser();

    return (
        <div className="space-y-6">
            {/* Titulo */}
            <Title title="Mis Órdenes" subtitle="Historial de pedidos" size="md" />

            <div className="mb-10">
                {/* Desktop Table */}
                <ResponsiveTable>
                    {/* Encabezados */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                #ID
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Nombre completo
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Estado
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    {/* Cuerpo de la Tabla */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            // Filas
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                {/* Columna - ID */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.id.split("-").at(-1)}
                                </td>

                                {/* Columna - Nombre completo */}
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {order.orderAddress?.firstName} {order.orderAddress?.lastName}
                                </td>

                                {/* Columna - Estado */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {order.isPaid ? (
                                            <>
                                                <IoCardOutline className="text-green-600 mr-2" />
                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                    Pagada
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <IoCardOutline className="text-red-600 mr-2" />
                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                    Pendiente
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </td>

                                {/* Columna - Opciones */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                    >
                                        Ver detalles
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </ResponsiveTable>

                {/* Mobile Cards */}
                <MobileCardContainer>
                    {orders.map((order) => (
                        <MobileCardItem key={order.id}>
                            <MobileCardField label="ID" value={`#${order.id.split("-").at(-1)}`} />
                            <MobileCardField
                                label="Cliente"
                                value={`${order.orderAddress?.firstName} ${order.orderAddress?.lastName}`}
                            />
                            <MobileCardField
                                label="Estado"
                                value={
                                    <div className="flex items-center justify-end">
                                        {order.isPaid ? (
                                            <>
                                                <IoCardOutline className="text-green-600 mr-2" />
                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                    Pagada
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <IoCardOutline className="text-red-600 mr-2" />
                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                    Pendiente
                                                </span>
                                            </>
                                        )}
                                    </div>
                                }
                            />
                            <div className="pt-3 mt-3 border-t border-gray-200">
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm block"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </MobileCardItem>
                    ))}
                </MobileCardContainer>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <IoCardOutline className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No tienes órdenes
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Cuando realices tu primera compra, aparecerá aquí.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Explorar productos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
