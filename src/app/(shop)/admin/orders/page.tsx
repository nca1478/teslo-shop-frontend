export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

import { Title, Pagination } from "@/components";
import { getPaginatedOrders } from "@/actions";
import { extractTimeFromDate, singleDateFormat } from "@/utils";
import {
    ResponsiveTable,
    MobileCardContainer,
    MobileCardItem,
    MobileCardField,
} from "@/components/ui/table/ResponsiveTable";

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
    const { page } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;

    const {
        ok,
        orders = [],
        totalPages = 0,
    } = await getPaginatedOrders({
        page: pageParam,
        take: 10,
    });

    if (!ok) {
        redirect("/auth/login");
    }

    return (
        <div className="space-y-6">
            <Title
                title="Gestión de Órdenes"
                subtitle="Administrar pedidos de clientes"
                size="md"
            />

            <div className="mb-10">
                {/* Desktop Table */}
                <ResponsiveTable>
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-4 py-4 text-left"
                            >
                                #ID
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Cliente
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Fecha
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Hora
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
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.id.split("-").at(-1)}
                                </td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {order.orderAddress?.firstName} {order.orderAddress?.lastName}
                                </td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {singleDateFormat(order.createdAt)}
                                </td>
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {extractTimeFromDate(order.createdAt)}
                                </td>
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
                                label="Fecha"
                                value={singleDateFormat(order.createdAt)}
                            />
                            <MobileCardField
                                label="Hora"
                                value={extractTimeFromDate(order.createdAt)}
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
            </div>

            {totalPages > 0 && <Pagination totalPages={totalPages} />}
        </div>
    );
}
