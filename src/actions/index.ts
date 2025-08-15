// address
export * from "./address/set-user-address";
export * from "./address/delete-user-address";
export * from "./address/get-user-address";

// auth
export * from "./auth/login";
export * from "./auth/logout";
export * from "./auth/register";

// category
export * from "./category/get-categories";

// country
export * from "./country/get-countries";

// order
export * from "./order/place-order";
export * from "./order/get-order-by-id";
export * from "./order/get-orders-by-user";
export * from "./order/get-paginated-orders";

// payments
export * from "./payments/set-transaction-id";
export * from "./payments/paypal-check-payment";

// product
export * from "./product/get-product-by-slug";
export * from "./product/product-pagination";
export * from "./product/get-stock-by-slug";
export * from "./product/create-update-product";

// user
export * from "./user/get-paginated-users";
export * from "./user/change-user-role";
