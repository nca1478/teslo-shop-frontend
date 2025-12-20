export const revalidate = 0;

import Link from "next/link";
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductImage, Title } from "@/components";
import { currencyFormat } from "@/utils";
import {
    ResponsiveTable,
    MobileCardContainer,
    MobileCardItem,
    MobileCardField,
} from "@/components/ui/table/ResponsiveTable";

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Title title="Gestión de Productos" subtitle="Administrar inventario" size="md" />

                <Link
                    href="/admin/product/new"
                    className="btn-primary text-center sm:text-left whitespace-nowrap"
                >
                    Nuevo Producto
                </Link>
            </div>

            <div className="mb-10">
                {/* Desktop Table */}
                <ResponsiveTable>
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-4 py-4 text-left"
                            >
                                Imagen
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Producto
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Precio
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Género
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Stock
                            </th>
                            <th
                                scope="col"
                                className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                            >
                                Tallas
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                {/* Imagen Artículo */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <Link href={`/product/${product.slug}`}>
                                        <ProductImage
                                            src={product.images[0]}
                                            width={60}
                                            height={60}
                                            alt={product.title}
                                            className="w-15 h-15 object-cover rounded-lg hover:scale-105 transition-transform"
                                        />
                                    </Link>
                                </td>

                                {/* Título */}
                                <td className="text-sm text-gray-900 px-6 py-4">
                                    <Link
                                        href={`/admin/product/${product.slug}`}
                                        className="font-medium hover:text-blue-600 transition-colors line-clamp-2"
                                    >
                                        {product.title}
                                    </Link>
                                </td>

                                {/* Precio */}
                                <td className="text-sm font-semibold text-gray-900 px-6 py-4 whitespace-nowrap">
                                    {currencyFormat(product.price)}
                                </td>

                                {/* Género */}
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                                        {product.gender}
                                    </span>
                                </td>

                                {/* Existencia */}
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                            product.inStock > 10
                                                ? "bg-green-100 text-green-800"
                                                : product.inStock > 0
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {product.inStock} unidades
                                    </span>
                                </td>

                                {/* Tallas */}
                                <td className="text-sm text-gray-900 px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {product.sizes.slice(0, 3).map((size) => (
                                            <span
                                                key={size}
                                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                        {product.sizes.length > 3 && (
                                            <span className="text-xs text-gray-500">
                                                +{product.sizes.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </ResponsiveTable>

                {/* Mobile Cards */}
                <MobileCardContainer>
                    {products.map((product) => (
                        <MobileCardItem key={product.id}>
                            <div className="flex items-start space-x-4 mb-4">
                                <Link href={`/product/${product.slug}`} className="shrink-0">
                                    <ProductImage
                                        src={product.images[0]}
                                        width={80}
                                        height={80}
                                        alt={product.title}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/admin/product/${product.slug}`}
                                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 block mb-2"
                                    >
                                        {product.title}
                                    </Link>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {currencyFormat(product.price)}
                                    </p>
                                </div>
                            </div>

                            <MobileCardField
                                label="Género"
                                value={
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                                        {product.gender}
                                    </span>
                                }
                            />
                            <MobileCardField
                                label="Stock"
                                value={
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                            product.inStock > 10
                                                ? "bg-green-100 text-green-800"
                                                : product.inStock > 0
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {product.inStock} unidades
                                    </span>
                                }
                            />
                            <MobileCardField
                                label="Tallas"
                                value={
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {product.sizes.map((size) => (
                                            <span
                                                key={size}
                                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                }
                            />
                        </MobileCardItem>
                    ))}
                </MobileCardContainer>

                {/* Paginación */}
                {products.length > 0 && <Pagination totalPages={totalPages} />}
            </div>
        </div>
    );
}
