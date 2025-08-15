export const revalidate = 0;

import Link from "next/link";
import Image from "next/image";
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, Title } from "@/components";
import { currencyFormat } from "@/utils";

interface Props {
    searchParams: Promise<{ page?: string; take?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const { page, take } = await searchParams;

    const pageParam = page ? parseInt(page) : 1;
    const takeParam = take ? parseInt(take) : 5;

    const { products, totalPages = 1 } = await getPaginatedProductsWithImages({
        page: pageParam,
        take: takeParam,
    });

    return (
        <>
            <Title title="Productos" />

            <div className="flex justify-end mb-5">
                <Link href="/admin/product/new" className="btn-primary">
                    Nuevo Producto
                </Link>
            </div>

            <div className="mb-10">
                <table className="min-w-full">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th
                                scope="col"
                                className="text-sm font-bold text-gray-900 px-4 py-4 text-left"
                            >
                                Artículo
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                            >
                                Título
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                            >
                                Precio
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                            >
                                Género
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                            >
                                Existencia
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                            >
                                Tallas
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                            >
                                {/* Imagen Artículo */}
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Link href={`/product/${product.slug}`}>
                                        <Image
                                            src={`/products/${product.ProductImage[0].url}`}
                                            width={80}
                                            height={80}
                                            alt={product.title}
                                            className="w-20 h-20 object-cover rounded"
                                        ></Image>
                                    </Link>
                                </td>

                                {/* Título */}
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    <Link
                                        href={`/admin/product/${product.slug}`}
                                        className="hover:underline"
                                    >
                                        {product.title}
                                    </Link>
                                </td>

                                {/* Precio */}
                                <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                                    {currencyFormat(product.price)}
                                </td>

                                {/* Género */}
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {product.gender}
                                </td>

                                {/* Existencia */}
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {product.inStock}
                                </td>

                                {/* Tallas */}
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {product.sizes.join(", ")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Paginación */}
                {products.length > 0 && <Pagination totalPages={totalPages} />}
            </div>
        </>
    );
}
