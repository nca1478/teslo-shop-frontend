export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

import { Title, Pagination } from "@/components";
import { getPaginatedOrders } from "@/actions";
import { extractTimeFromDate, singleDateFormat } from "@/utils";

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
        <>
            <Title title="Orders" />

            <div className="mb-10">
                <table className="min-w-full">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                                #ID
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                                Cliente
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                                Fecha
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                                Hora
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                                Estado
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                                Opciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                            >
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id.split("-").at(-1)}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {order.orderAddress?.firstName} {order.orderAddress?.lastName}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {singleDateFormat(order.createdAt)}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {extractTimeFromDate(order.createdAt)}
                                </td>
                                <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {order.isPaid ? (
                                        <>
                                            <IoCardOutline className="text-green-800" />
                                            <span className="mx-2 text-green-800">Pagada</span>
                                        </>
                                    ) : (
                                        <>
                                            <IoCardOutline className="text-red-800" />
                                            <span className="mx-2 text-red-800">No Pagada</span>
                                        </>
                                    )}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 ">
                                    <Link href={`/orders/${order.id}`} className="hover:underline">
                                        Ver orden
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 0 && <Pagination totalPages={totalPages} />}
        </>
    );
}
