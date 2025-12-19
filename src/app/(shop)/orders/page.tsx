// https://tailwindcomponents.com/component/hoverable-table
import Link from "next/link";

import { IoCardOutline } from "react-icons/io5";
import { getOrdersByUser } from "@/actions";
import { Title } from "@/components";

export default async function OrdersPage() {
    const { orders = [] } = await getOrdersByUser();

    // redirige al login si no hay sesión activa
    // esto ya se controla con el callback authorized de auth.config.tss - rutas protegidas
    // if (!ok) {
    //     redirect("/auth/login");
    // }

    return (
        <>
            {/* Titulo */}
            <Title title="Orders" />

            <div className="mb-10">
                {/* Tabla */}
                <table className="min-w-full">
                    {/* Encabezados */}
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                                #ID
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                                Nombre completo
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

                    {/* Cuerpo de la Tabla */}
                    <tbody>
                        {orders.map((order) => (
                            // Filas
                            <tr
                                key={order.id}
                                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                            >
                                {/* Columna - ID */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id.split("-").at(-1)}
                                </td>

                                {/* Columna - Nombre completo */}
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {order.orderAddress?.firstName} {order.orderAddress?.lastName}
                                </td>

                                {/* Columna - Estado */}
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

                                {/* Columna - Opciones */}
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
        </>
    );
}
