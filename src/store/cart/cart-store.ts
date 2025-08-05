import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { CartProduct } from "@/interfaces";

interface State {
    cart: CartProduct[];
    addProductToCart: (product: CartProduct) => void;
    getTotalItems: () => number;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
    getSummaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };
}

export const useCartStore = create<State>()(
    devtools(
        persist(
            (set, get) => ({
                cart: [],

                // Agregar producto
                addProductToCart: (product: CartProduct) => {
                    const { cart } = get();

                    // 1. Revisar si el producto existe en el carrito con la talla seleccionada
                    const productInCart = cart.some(
                        (item) => item.id === product.id && item.size === product.size
                    );

                    if (!productInCart) {
                        set({ cart: [...cart, product] });
                        return;
                    }

                    // 2. El producto existe por talla, tengo que incrementar
                    const updateCartProducts = cart.map((item) => {
                        if (item.id === product.id && item.size === product.size) {
                            return { ...item, quantity: item.quantity + product.quantity };
                        }

                        return item;
                    });

                    set({ cart: updateCartProducts });
                },

                // Obtener total de items
                getTotalItems: () => {
                    const { cart } = get();
                    return cart.reduce((total, item) => total + item.quantity, 0);
                },

                // Actualizar cantidad del producto
                updateProductQuantity: (product: CartProduct, quantity: number) => {
                    const { cart } = get();

                    const updateCartProducts = cart.map((item) => {
                        if (item.id === product.id && item.size === product.size) {
                            return { ...item, quantity };
                        }
                        return item;
                    });

                    set({ cart: updateCartProducts });
                },

                // Remover Producto
                removeProduct: (product: CartProduct) => {
                    const { cart } = get();

                    const updateCartProducts = cart.filter(
                        (item) => item.id !== product.id || item.size !== product.size
                    );

                    set({ cart: updateCartProducts });
                },

                // Obtener resumen de la compra
                getSummaryInformation() {
                    const { cart } = get();

                    const subTotal = cart.reduce(
                        (subTotal, product) => product.quantity * product.price + subTotal,
                        0
                    );

                    const tax = subTotal * 0.15;
                    const total = subTotal + tax;
                    const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

                    return {
                        subTotal,
                        tax,
                        total,
                        itemsInCart,
                    };
                },
            }),
            {
                name: "shopping-cart",
                storage: createJSONStorage(() => localStorage),
                // skipHydration: true,
            }
        )
    )
);
