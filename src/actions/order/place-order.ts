"use server";

import type { Address, Size } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    const session = await auth();
    const userId = session?.user.id;

    // Verificar sesión del usuario
    if (!userId) {
        return {
            ok: false,
            message: "No hay sesión de usuario",
        };
    }

    // Obtener información de los productos
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map((p) => p.productId),
            },
        },
    });

    // Calcular items de la orden
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    // Calcular subtotal, tax y total
    const { subTotal, tax, total } = productIds.reduce(
        (totals, item) => {
            const productQuantity = item.quantity;
            const product = products.find((product) => product.id === item.productId);

            if (!product) throw new Error(`${item.productId} no existe`);

            const subTotal = product.price * productQuantity;

            totals.subTotal += subTotal;
            totals.tax += subTotal * 0.15;
            totals.total += subTotal * 1.15;

            return totals;
        },
        { subTotal: 0, tax: 0, total: 0 }
    );

    // crear la transacción de la bd
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            // 1. actualizar el stock de los productos
            const updatedProductsPromises = products.map((product) => {
                // acumular los valores (filtra los ids de products y luego acumula las cantidades)
                const productQuantity = productIds
                    .filter((p) => p.productId === product.id)
                    .reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`);
                }

                // decrementa el stock del producto
                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // inStock: product.inStock - productQuantity, // no hacer esto - mala practica

                        // decrementa el stock del producto basado en el stock actual
                        inStock: {
                            decrement: productQuantity,
                        },
                    },
                });
            });

            // aqui ejecuta las promesas
            const updatedProducts = await Promise.all(updatedProductsPromises);

            // verificar valores negativos en la existencia, isStock <= 0
            updatedProducts.forEach((product) => {
                if (product.inStock < 0) {
                    throw new Error(
                        `El producto \"${product.title}\" no tiene existencia suficiente`
                    );
                }
            });

            // 2. crear la orden - orderItem - detalle de la orden
            const order = await tx.order.create({
                data: {
                    subTotal,
                    tax,
                    total,
                    itemsInOrder,
                    userId,

                    //relacion con OrdenItem (detalle de la orden)
                    OrderItem: {
                        createMany: {
                            data: productIds.map((p) => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price:
                                    products.find((product) => product.id === p.productId)?.price ??
                                    0,
                            })),
                        },
                    },
                },
            });

            // 3. crear la dirección de la orden
            const { country, ...restAddress } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    orderId: order.id,
                    countryId: country,
                },
            });

            return { order, updatedProducts, orderAddress };
        });

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx,
        };
    } catch (error) {
        if (error instanceof Error) {
            return { ok: false, message: error.message };
        } else {
            return { ok: false, message: "error desconocido" };
        }
    }
};
