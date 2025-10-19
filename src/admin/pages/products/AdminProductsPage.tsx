import { Link } from "react-router";
import { PencilIcon, PlusIcon } from "lucide-react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/admin/hooks/useAdminProducts";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullscreenLoading";
import { currencyFormatter } from "@/lib/currency-formatter";

export const AdminProductsPage = () => {
    const { data, isLoading } = useAdminProducts();

    if (isLoading) return <CustomFullScreenLoading />;

    return (
        <>
            <div className="flex justify-between items-center">
                <AdminTitle
                    title="Productos"
                    subtitle="Aquí puedes ver y administrar tus productos"
                />

                {/* Nuevo Producto */}
                <div className="flex justify-end mb-10 gap-4">
                    <Link to="/admin/products/new">
                        <Button>
                            <PlusIcon />
                            Nuevo producto
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabla de Productos */}
            <Table className="bg-white p-10 shadow-xs border border-gray-200 mb-10">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">No.</TableHead>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Inventario</TableHead>
                        <TableHead>Tallas</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.products.map((product, index) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                                <img
                                    src={product.images[0] || "https://placehold.co/250x250"}
                                    alt={product.title}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                            </TableCell>
                            <TableCell>
                                <Link
                                    to={`/admin/products/${product.id}`}
                                    className="hover:text-blue-500 hover:underline"
                                >
                                    {product.title}
                                </Link>
                            </TableCell>
                            <TableCell>{currencyFormatter(product.price)}</TableCell>
                            <TableCell>{product.gender}</TableCell>
                            <TableCell>{product.stock} stock</TableCell>
                            <TableCell>{product.sizes.join(", ")}</TableCell>
                            <TableCell className="text-center">
                                <Link
                                    to={`/admin/products/${product.id}`}
                                    className="inline-flex items-center justify-center"
                                >
                                    <PencilIcon className="w-4 h-4 text-blue-500" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <CustomPagination totalPages={data?.pages || 0} />
        </>
    );
};
