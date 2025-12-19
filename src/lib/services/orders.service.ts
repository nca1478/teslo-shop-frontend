import { httpClient } from "../http-client";
import { Address, Size } from "@/interfaces";

export interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export interface ProductImage {
    id: number;
    url: string;
    productId: string;
}

export interface OrderItemProduct {
    id: string;
    title: string;
    slug: string;
    ProductImage: ProductImage[];
}

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    size: string;
    productId: string;
    orderId: string;
    product?: OrderItemProduct;
}

export interface PlaceOrderAddressDto {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    phone: string;
    countryId: string;
}

export interface PlaceOrderItemDto {
    productId: string;
    quantity: number;
    size: string;
}

export interface PlaceOrderRequest {
    items: PlaceOrderItemDto[];
    address: PlaceOrderAddressDto;
}

export interface OrderAddress {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    phone: string;
    countryId: string;
    orderId: string;
}

export interface Order {
    id: string;
    subTotal: number;
    tax: number;
    total: number;
    itemsInOrder: number;
    isPaid: boolean;
    paidAt?: Date;
    transactionId?: string;
    userId: string;
    orderItems: OrderItem[];
    orderAddress?: OrderAddress;
    createdAt: Date;
    updatedAt: Date;
}

export interface PlaceOrderResponse {
    ok: boolean;
    order?: Order;
    message?: string;
}

export class OrdersService {
    private readonly basePath = "/api/orders";

    async placeOrder(
        productIds: ProductToOrder[],
        address: Address,
        token: string
    ): Promise<PlaceOrderResponse> {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const orderData: PlaceOrderRequest = {
                items: productIds.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size,
                })),
                address: {
                    firstName: address.firstName,
                    lastName: address.lastName,
                    address: address.address,
                    address2: address.address2,
                    postalCode: address.postalCode,
                    city: address.city,
                    phone: address.phone,
                    countryId: address.country,
                },
            };

            const result = await httpClient.post<Order>(this.basePath, orderData, headers);

            return {
                ok: true,
                order: result,
            };
        } catch (error) {
            console.log(error);
            let message = "Error desconocido";

            if (error instanceof Error) {
                message = error.message;
            }

            return {
                ok: false,
                message,
            };
        }
    }

    async getOrderById(id: string, token: string): Promise<Order | null> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            return await httpClient.get<Order>(`${this.basePath}/${id}`, headers);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getMyOrders(token: string): Promise<Order[]> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            return await httpClient.get<Order[]>(`${this.basePath}/my-orders`, headers);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export const ordersService = new OrdersService();
